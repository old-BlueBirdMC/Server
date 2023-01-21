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

const BlockStorage = require("./BlockStorage");

class SubChunk {
	blockStorages;

	constructor(runtime_id) {
		this.blockStorages = [
			new BlockStorage(runtime_id),
			new BlockStorage(runtime_id)
		];
	}

	getBlockRuntimeID(x, y, z, layer) {
		return this.blockStorages[layer].getBlockRuntimeID(x, y, z);
	}

	setBlockRuntimeID(x, y, z, layer, runtimeID) {
		this.blockStorages[layer].setBlockRuntimeID(x, y, z, runtimeID);
	}

	getHighestBlockAt(x, z, layer) {
		return this.blockStorages[layer].getHighestBlockAt(x, z);
	}

	isEmpty() {
		for (let i = 0; i < this.blockStorages.length; ++i) {
			if (this.blockStorages[i].isEmpty() === false) {
				return false;
			}
		}
		return true;
	}
}

module.exports = SubChunk;