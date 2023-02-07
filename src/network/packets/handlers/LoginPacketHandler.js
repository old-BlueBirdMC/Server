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

class LoginPacketHandler extends HandlersBase {
    async startHandling(packet) {
        await super.startHandling(packet);
        let player = this.player;
        player.checkProtocol(packet.protocolVersion);

        const [, lClient] = packet.loginTokens.client.split(".");
        const loginClient = JSON.parse(Buffer.from(lClient, "base64").toString("binary"));
        const lIdentity = JSON.parse(packet.loginTokens.identity.toString("binary"));
        const loginIdentity = lIdentity["chain"].map((data) => {
            const [, ldata] = data.split(".");
            return JSON.parse(Buffer.from(ldata, "base64").toString("binary"));
        });
        player.loginClient = loginClient;
        player.loginIdentity = loginIdentity;
        player.xuid = player.loginIdentity[2].extraData.XUID;
        player.identity = player.loginIdentity[2].extraData.identity;

        player.updateName(true);

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
