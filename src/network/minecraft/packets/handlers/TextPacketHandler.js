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

import TextTypes from "../../constants/TextTypes.js";
import HandlersBase from "./HandlersBase.js";

export default class TextPacketHandler extends HandlersBase {
    async startHandling(packet) {
        await super.startHandling(packet);
        if (packet.typeID !== TextTypes.chat) {
            return;
        }
        this.player.sendChatMessage(packet.message);
    }
}
