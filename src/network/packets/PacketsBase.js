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

const MinecraftBinaryStream = require("../../misc/MinecraftBinaryStream");

class PacketsBase extends MinecraftBinaryStream {
	static id = -1;

	serialized = false;

	/**
	 * @returns {Number}
	 */
	getID() {
		return this.constructor.id;
	}

	/**
	 * @returns {String}
	 */
	static getName() {
		return this.name;
	}

	deserializeA() {
		this.rewind();
		let packetId = this.readVarInt();
		if (packetId !== this.getID()) {
			throw new Error("Wrong packetId, result=" + packetId);
		}
		this.deserialize();
	}

	serializeA() {
		this.reset();
		this.writeVarInt(this.getID());
		this.serialize();
		this.serialized = true;
	}

	serialize() {}

	deserialize() {}

	async sendTo(player) {
		if (player.connection === null) return;

		await player.server.sendUnserializedMinecraftPacket(this, player);
	}
}

module.exports = PacketsBase;