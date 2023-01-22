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

    async loadChunk(x, z) {
        if (!(`${x}:${z}` in this.chunks)) {
            if (false === false) {
                this.chunks[`${x}:${z}`] = null;
                this.chunks[`${x}:${z}`] = await this.getGenerator().generate(x, z);
            } else {
                this.chunks[`${x}:${z}`] = "read the chunk;";
            }
        } else if (this.chunks[`${x}:${z}`] === null) {
            setTimeout(this.loadChunk(x, z), 10);
        }
        return this.chunks[`${x}:${z}`];
    }

    async unloadChunk(x, z) {
        await this.saveChunk();
        if (`${x}:${z}` in this.chunks) {
            delete this.chunks[`${x}:${z}`];
        }
    }

    async saveChunk(x, z) {
        // save
    }

    getGenerator() {
        return this.generatorManager.getGenerator("flat");
    }

    getBlockRuntimeID(x, y, z, layer) {
        return this.chunks[`${x >> 4}:${z >> 4}`].getBlockRuntimeID(x & 0x0f, y, z & 0x0f, layer);
    }

    setBlockRuntimeID(x, y, z, layer, runtimeID) {
        this.chunks[`${x >> 4}:${z >> 4}`].setBlockRuntimeID(x & 0x0f, y, z & 0x0f, layer, runtimeID);
    }
}

module.exports = World;
