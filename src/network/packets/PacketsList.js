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

const fs = require("fs");

class PacketsList {
    static #packets = {};

    static refresh() {
        fs.readdirSync(__dirname).forEach(async (packetsName) => {
            let blackList = ["handlers", "GamePacket.js", "Identifiers.js", "PacketsBase.js", "PacketsList.js"];
            if (!blackList.includes(packetsName)) {
                this.add(require("./" + packetsName.replace(".js", "")));
            }
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

module.exports = PacketsList;
