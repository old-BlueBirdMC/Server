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

class ContainerOpenPacket extends PacketsBase {
	static id = Identifiers.containerOpen;

	windowID;
	type;
	coordinates;
	runtimeEntityID;

	deserialize() {
		this.windowID = this.readByte();
		this.type = this.readByte();
		this.coordinates = this.readBlockCoordinates();
		this.runtimeEntityID = this.readRuntimeEntityID();
	}

	serialize() {
		this.writeByte(this.windowID);
		this.writeByte(this.type);
		this.writeBlockCoordinates(this.coordinates);
		this.writeRuntimeEntityID(this.runtimeEntityID);
	}
}

module.exports = ContainerOpenPacket;