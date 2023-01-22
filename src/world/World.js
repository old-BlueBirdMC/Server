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

class World {
    generatorManager;
    chunks;

    constructor(generatorManager) {
        this.generatorManager = generatorManager;
        this.chunks = {};
    }

    hashXZ(x, z) {
        return (BigInt(x & 0xffffffff) << 16n) | (BigInt(z & 0xffffffff));
    }

    unhashXZ(xz) {
        return [BigInt.asIntN(32, xz << 16n), BigInt.asIntN(32, xz & 0xffffffff)];
    }

    async loadChunk(x, z) {
        let xz = this.hashXZ(x, z);
        if (!(xz in this.chunks)) {
            if (false === false) {
                this.chunks[xz] = await this.getGenerator().generate(x, z);
            } else {
                this.chunks[xz] = "read the chunk;";
            }
        } else if (this.chunks[xz] === null) {
            setTimeout(this.loadChunk(x, z), 10);
        }
        return this.chunks[xz];
    }

    async unloadChunk(x, z) {
        let xz = this.hashXZ(x, z);
        await this.saveChunk();
        if (xz in this.chunks) {
            delete this.chunks[xz];
        }
    }

    async saveChunk(x, z) {
        // save
    }

    getGenerator() {
        return this.generatorManager.getGenerator("flat");
    }

    getBlockRuntimeID(x, y, z, layer) {
        let xz = this.hashXZ(x >> 4, z >> 4);
        return this.chunks[xz].getBlockRuntimeID(x & 0x0f, y, z & 0x0f, layer);
    }

    setBlockRuntimeID(x, y, z, layer, runtimeID) {
        let xz = this.hashXZ(x >> 4, z >> 4);
        this.chunks[xz].setBlockRuntimeID(x & 0x0f, y, z & 0x0f, layer, runtimeID);
    }
}

module.exports = World;
