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

const BlockStorage = require("./BlockStorage");
const SubChunk = require("./SubChunk");

class Chunk {
	x;
	z;
	subChunks;
	biomes;

	constructor(x, z, runtimeID) {
		this.x = x;
		this.z = z;
		this.subChunks = [
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID),
			new SubChunk(runtimeID), new SubChunk(runtimeID), new SubChunk(runtimeID)
		];
		this.biomes = [
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1),
			new BlockStorage(1), new BlockStorage(1), new BlockStorage(1)
		];
	}

	getBlockRuntimeID(x, y, z, layer) {
		return this.subChunks[y >> 4].getBlockRuntimeID(x & 0x0f, y & 0x0f, z & 0x0f, layer);
	}

	setBlockRuntimeID(x, y, z, layer, runtimeID) {
		this.subChunks[y >> 4].setBlockRuntimeID(x & 0x0f, y & 0x0f, z & 0x0f, layer, runtimeID);
	}

	getHighestBlockAt(x, z, layer) {
		for (let i = (this.subChunks.length - 1); i >= 0; --i) {
			let y = this.subChunks[i].getHighestBlockAt(x, z, layer);
			if (y != -1) {
				return (i << 4) + y;
			}
		}
		return -1;
	}

	isEmpty() {
		for (let i = 0; i < this.subChunks.length; ++i) {
			if (this.subChunks[i].isEmpty() === false) {
				return false;
			}
		}
		return true;
	}

	getSubChunksSendCount() {
		for (let i = this.subChunks.length; i > 0; --i) {
			if (this.subChunks[i - 1].isEmpty() === false) {
				return i;
			}
		}
		return 0;
	}
}

module.exports = Chunk;