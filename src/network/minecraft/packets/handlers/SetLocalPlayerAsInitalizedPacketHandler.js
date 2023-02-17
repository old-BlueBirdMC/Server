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

import canceller from "../../../../event/canceller.js";
import RakNetPlayerManager from "../../../../managers/RakNetPlayerManager.js";
import HandlersBase from "./HandlersBase.js";

export default class SetLocalPlayerAsInitalizedPacketHandler extends HandlersBase {
    async startHandling(packet) {
        super.startHandling(packet);
        let ev = {
            player: this.player,
            message: "",
            canceller: new canceller(),
        };
        this.server.addEvent(ev, "join");
        if (ev.canceller.isCancelled()) {
            RakNetPlayerManager.unregisterPlayer(this.player.connection.address.toString());
            this.player.disconnect("Join cancelled", false);
            return;
        }
        this.server.log.info(ev.message !== "" ? ev.message : `${this.player.name} joined the server!`);
    }
}
