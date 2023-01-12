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

class BlockStorage {
	blocks;
	palette;

	constructor(runtimeID) {
		this.blocks = new Array(4096);
		this.blocks.fill(0);
		this.palette = [runtimeID]; 
	}

	getBlockRuntimeID(x, y, z) {
		return this.palette[this.blocks[(x << 8) | (z << 4) | y]];
	}

	setBlockRuntimeID(x, y, z, runtimeID) {
		if (this.palette.includes(runtimeID) === false) {
			this.palette.push(runtimeID);
		}
		this.blocks[(x << 8) | (z << 4) | y] = this.palette.indexOf(runtimeID);
	}
	
	getHighestBlockAt(x, z) {
		for (let y = 15; y >= 0; --y) {
			if (this.blocks[(x << 8) | (z << 4) | y] != 0) {
				return y;
			}
		}
		return -1;
	}

	isEmpty() {
		if (this.palette.length <= 1) {
			return true;
		}
		for (let i = 0; i < 4096; ++i) {
			if (this.blocks[i] != 0) {
				return false;
			}
		}
		return true;
	}
}

module.exports = BlockStorage;