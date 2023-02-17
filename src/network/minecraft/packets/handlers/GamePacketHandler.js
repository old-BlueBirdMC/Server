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

import GamePacket from "../GamePacket.js";
import PacketsList from "../PacketsList.js";
import PacketsBase from "../PacketsBase.js";
import HandlersBase from "./HandlersBase.js";
import HandlersList from "./HandlersList.js";

export default class GamePacketHandler extends HandlersBase {
    async startHandling(game) {
        if (!(game instanceof GamePacket)) return;
        game.streams.forEach((stream) => {
            let packet = PacketsList.get(stream.readVarInt());
            if (packet instanceof PacketsBase) {
                packet.buffer = stream.buffer;
                let handled = HandlersList.get(packet.getID(), this.player.connection.address.toString());
                if (handled !== null) {
                    handled.startHandling(packet);
                }
            }
        });
    }
}
