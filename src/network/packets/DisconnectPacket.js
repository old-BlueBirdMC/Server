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

class DisconnectPacket extends PacketsBase {
	static id = Identifiers.disconnect;

	hideNotification;
	message;

	deserialize() {
		this.hideNotification = this.readBool();
		this.message = this.readStringVarInt();
	}

	serialize() {
		this.writeBool(this.hideNotification);
		this.writeStringVarInt(this.message);
	}
}

module.exports = DisconnectPacket;