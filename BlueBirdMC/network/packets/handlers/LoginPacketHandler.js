/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the MIT    *
 * License. To use or modify it you must  *
 * accept the terms of the license.       *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const PlayStatus = require("../../constants/PlayStatus");
const ResourcePacksInfoPacket = require("../ResourcePacksInfoPacket");
const HandlersBase = require("./HandlersBase");
const canceller = require("../../../event/canceller");
const Auth = require("../../../misc/Auth");

class LoginPacketHandler extends HandlersBase {
    async startHandling(packet) {
        await super.startHandling(packet);
        let player = this.player;
        player.checkProtocol(packet.protocolVersion);

        const [, splittedClientToken] = packet.loginTokens.client.split(".");
        const parsedClientData = JSON.parse(Buffer.from(splittedClientToken, "base64").toString("binary"));
        player.clientData = parsedClientData;
        const auth = new Auth(this.player, this.server, this.server.configManager.isOnlineMode(), packet.loginTokens.identity);
        auth.authMainCheck();
        player.auth = auth;

        let ev = {
            player: this.player,
            canceller: new canceller(),
        };
        this.server.addEvent(ev, "login");
        if (ev.canceller.isCancelled()) {
            return;
        }

        player.sendPlayStatus(PlayStatus.loginSuccess);

        const resourcePacksInfo = new ResourcePacksInfoPacket();
        resourcePacksInfo.mustAccept = false;
        resourcePacksInfo.hasScripts = false;
        resourcePacksInfo.forceServerPacks = false;
        resourcePacksInfo.behaviorPacks = [];
        resourcePacksInfo.texturePacks = [];
        resourcePacksInfo.sendTo(player);
    }
}

module.exports = LoginPacketHandler;
