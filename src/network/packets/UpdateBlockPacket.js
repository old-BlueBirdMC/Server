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

const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class UpdateBlockPacket extends PacketsBase {
	static id = Identifiers.updateBlock;

	coordinates;
	runtimeID;
	flags;
	layer;

	deserialize() {
		this.coordinates = this.readBlockCoordinates();
		this.runtimeID = this.readVarInt();
		this.flags = this.readVarInt();
		this.layer = this.readVarInt();
	}

	deserialize() {
		this.writeBlockCoordinates(this.coordinates);
		this.writeVarInt(this.runtimeID);
		this.writeVarInt(this.flags);
		this.writeVarInt(this.layer);
	}
}

module.exports = UpdateBlockPacket;
