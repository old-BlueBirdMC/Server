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

import * as fs from "fs";

import * as MPacketsList from "./PacketsList.mjs";

export default class PacketsList {
    static #packets = {};

    static refresh() {
        // fs.readdirSync(__dirname(import.meta.url)).forEach(async (packetsName) => {
        //     let blackList = ["handlers", "GamePacket.js", "Identifiers.js", "PacketsBase.js", "PacketsList.js"];
        //     if (!blackList.includes(packetsName)) {
        //         this.add(require(`./${packetsName.replace(".js", "")}`));
        //     }
        // });
        Object.values(MPacketsList).forEach((classes) => {
            this.add(classes);
        });
    }

    static add(packet) {
        if (!(packet.id in this.#packets)) {
            this.#packets[packet.id] = new packet();
        }
    }

    static get(packetID) {
        if (!(packetID in this.#packets)) return;
        return this.#packets[packetID];
    }

    static getAll() {
        return Object.entries(this.#packets);
    }
}
