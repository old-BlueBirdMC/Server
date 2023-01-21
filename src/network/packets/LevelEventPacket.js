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

class LevelEventPacket extends PacketsBase {
	static id = Identifiers.levelEvent;

	event;
    position;
    data;

	deserialize() {
		this.event = this.readSignedVarInt();
		this.position = this.readVector3F();
		this.data = this.readSignedVarInt();
	}

	serialize() {
		this.writeSignedVarInt(this.event);
        this.writeVector3F(this.position);
		this.writeSignedVarInt(this.data);
	}
}

module.exports = LevelEventPacket;