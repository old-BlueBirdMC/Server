/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const Identifiers = require("../Identifiers");
const fs = require("fs");

class HandlersList {
	static #handlers = {};

	static refresh(player, server, playerAddress) {
		fs.readdirSync(__dirname).forEach(async (handlersName) => { 
			let blackList = ["GamePacketHandler.js", "HandlersBase.js", "HandlersList.js"];
			if (!(blackList.includes(handlersName))) {
				let staticPacket = require("./" + handlersName.replace(".js", ""));
				let IdentifierName = handlersName;
				IdentifierName += "";
				let toIdentifiersWork = Identifiers[(IdentifierName.charAt(0).toLocaleLowerCase() + IdentifierName.substring(1)).replace("PacketHandler.js", "")];
				this.add(staticPacket, toIdentifiersWork, player, playerAddress, server);
			}
		});
	}

	static add(handler, packetID, player, playerAddress, server) {
		if (typeof this.#handlers[packetID] === "undefined" || typeof this.#handlers[packetID][playerAddress] === "undefined") {
			this.#handlers[packetID] = {};
			this.#handlers[packetID][playerAddress] = new handler(player, server);
		}
	}

	static remove(playerAddress) {
		for (const [packetID,] of this.getAll()) {
			if (typeof this.#handlers[packetID] === "undefined" || typeof this.#handlers[packetID][playerAddress] === "undefined") {
				delete this.#handlers[packetID][playerAddress];
			}
		}
	}

	static get(packetID, playerAddress) {
		if (typeof this.#handlers[packetID] === "undefined" && typeof this.#handlers[packetID][playerAddress] === "undefined") {
			return;
		}
		return this.#handlers[packetID][playerAddress];
	}

	static getAll() {
		return Object.entries(this.#handlers);
	}
}

module.exports = HandlersList;