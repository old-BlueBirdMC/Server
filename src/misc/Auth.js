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

import IdentityTokenParser from "./IdentityTokenParser.js";

export default class Auth {
    player;
    server;
    onlineMode;
    identityTokenParser;

    constructor(player, server, onlineMode, identityToken) {
        this.player = player;
        this.server = server;
        this.onlineMode = onlineMode;
        this.identityTokenParser = new IdentityTokenParser(identityToken);
        this.player.name = this.identityTokenParser.realName;
    }

    authMainCheck() {
        this.xboxCheck();
        this.accountCheck();
        this.playerNameCheck();
    }

    xboxCheck() {
        if (this.onlineMode !== true) {
            return;
        }
        if (typeof this.identityTokenParser.xuid !== "string") {
            this.player.disconnect("use xbox auth to join this server");
        }
        if (this.identityTokenParser.xuid === "") {
            this.player.disconnect("use xbox auth to join this server");
        }
    }

    accountCheck() {
        if (this.onlineMode !== true) {
            return;
        }
        if (this.identityTokenParser.usingAccount === false) {
            this.player.disconnect("use an account to join the server");
        }
    }

    playerNameCheck() {
        if (this.onlineMode !== true) {
            return;
        }
        if (this.playerNameEqualToSomeone(this.server) === true) {
            this.player.name = this.identityTokenParser.realName + " - " + this.server.playerNamesInUse;
            ++this.server.playerNamesInUse;
        }
    }

    playerNameEqualToSomeone() {
        let retVal = false;
        let onlinePlayers = this.server.getOnlinePlayers();
        if (onlinePlayers.length <= 1) {
            return false;
        }
        onlinePlayers.forEach((players) => {
            if (players.auth.identityTokenParser.realName === this.identityTokenParser.realName) {
                retVal = true;
            }
        });
        return retVal;
    }
}
