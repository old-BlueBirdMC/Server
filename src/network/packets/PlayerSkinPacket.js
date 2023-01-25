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

class PlayerSkinPacket extends PacketsBase {
	static id = Identifiers.playerSkin;

	uuid;
	skin;
	newSkinName;
	oldSkinName;

	deserialize() {
		this.uuid = this.readUUID();
		this.skin = this.readSkin();
		this.newSkinName = this.readStringVarInt();
		this.oldSkinName = this.readStringVarInt();
	}

	serialize() {
		this.writeUUID(this.uuid);
		this.writeSkin(this.skin);
		this.writeStringVarInt(this.newSkinName);
		this.writeStringVarInt(this.oldSkinName);
	}
}

module.exports = PlayerSkinPacket;
