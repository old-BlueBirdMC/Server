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

class LevelChunkPacket extends PacketsBase {
	static id = Identifiers.levelChunk;

	x;
	z;
	subChunkCount;
	highestSubChunkCount;
	cacheEnabled;
	hashes;
	payload;

	deserialize() {
		this.x = this.readSignedVarInt();
		this.z = this.readSignedVarInt();
		this.subChunkCount = this.readVarInt();
		if (this.subChunkCount == 0xfffffffe) {
			this.highestSubChunkCount = this.readUnsignedShortLE();
		}
		this.cacheEnabled = this.readBool();
		if (this.cacheEnabled === true) {
			this.hashes = [];
			let hashesCount = this.readVarInt();
			for (let i = 0; i < hashesCount; ++i) {
				this.hashes.push(this.readUnsignedLongLE());
			}
		}
		this.payload = this.readByteArrayVarInt();
	}

	serialize() {
		this.writeSignedVarInt(this.x);
		this.writeSignedVarInt(this.z);
		this.writeVarInt(this.subChunkCount);
		if (this.subChunkCount == 0xfffffffe) {
			this.writeUnsignedShortLE(this.highestSubChunkCount);
		}
		this.writeBool(this.cacheEnabled);
		if (this.cacheEnabled === true) {
			this.writeVarInt(this.hashes.length);
			for (let i = 0; i < this.hashes.length; ++i) {
				this.writeUnsignedLongLE(this.hashes[i]);
			}
			this.writeVarInt(0);
		} else {
			this.writeByteArrayVarInt(this.payload);
		}
	}
}

module.exports = LevelChunkPacket;