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

const GamePacket = require("../GamePacket");
const PacketsList = require("../PacketsList");
const PacketsBase = require("../PacketsBase");
const HandlersBase = require("./HandlersBase");
const HandlersList = require("./HandlersList");

class GamePacketHandler extends HandlersBase {
	#handledPackets = {};

	async startHandling(game) {
		if (!(game instanceof GamePacket)) return;
		game.streams.forEach((stream) => {
			let packet = PacketsList.get(stream.readVarInt());
			if (packet instanceof PacketsBase) {
				packet.buffer = stream.buffer;
				if (!(packet.buffer in this.#handledPackets)) {
					HandlersList.get(packet.getId(), this.player.connection.address.toString()).startHandling(packet);
					this.#handledPackets[packet.buffer] = true;
				}
			}
		});
	}
}

module.exports = GamePacketHandler;