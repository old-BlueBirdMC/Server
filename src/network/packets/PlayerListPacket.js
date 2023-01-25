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

const PlayerListActionTypes = require("../constants/PlayerListActionTypes");
const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class PlayerListPacket extends PacketsBase {
	static id = Identifiers.playerList;

	actionType;
	entries;

	deserialize() {
		this.actionType = this.readUnsignedByte();
		this.entries = this.readPlayerListEntries(this.actionType);
		if (this.actionType === PlayerListActionTypes.add) {
			this.entries.forEach(entry => {
				entry.skin.verified = true;
			});
		}
	}

	serialize() {
		this.writeUnsignedByte(this.actionType);
		this.writePlayerListEntries(this.entries, this.actionType);
		if (this.actionType === PlayerListActionTypes.add) {
			this.entries.forEach(entry => {
				this.writeBool(entry.skin.verified);
			});
		}
	}
}

module.exports = PlayerListPacket;
