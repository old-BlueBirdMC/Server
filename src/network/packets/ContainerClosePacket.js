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

class ContainerClosePacket extends PacketsBase {
	static id = Identifiers.containerClose;

	windowID;
	server;

	deserialize() {
		this.windowID = this.readByte();
		this.server = this.readBool();
	}

	serialize() {
		this.writeByte(this.windowID);
		this.writeBool(this.server);
	}
}

module.exports = ContainerClosePacket;