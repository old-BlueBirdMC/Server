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

const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class CreativeContentPacket extends PacketsBase {
	static id = Identifiers.creativeContent;

	entries;

	deserialize() {
		this.entries = {};
		let length = this.readVarInt();
		for (let i = 0; i < length; ++i) {
			this.entries[this.readVarInt()] = this.readItem(false);
		}
	}

	serialize() {
		let length = Object.keys(this.entries).length;
		this.writeVarInt(length);
		for (let i = 0; i < length; ++i) {
			this.writeVarInt(Object.keys(this.entries)[i]);
			this.writeItem(Object.values(this.entries)[i], false);
		}
	}
}

module.exports = CreativeContentPacket;