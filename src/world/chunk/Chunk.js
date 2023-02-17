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

import BlockStorage from "./BlockStorage.js";
import SubChunk from "./SubChunk.js";

const MAXSUBCHUNKS = 24;

export default class Chunk {
    x;
    z;
    subChunks;
    biomes;
    runtimeID;

    constructor(x, z, runtimeID) {
        this.x = x;
        this.z = z;
        this.runtimeID = runtimeID;
        this.subChunks = new Map();
        this.biomes = [
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
            new BlockStorage(1),
        ];
    }

    getBlockRuntimeID(x, y, z, layer) {
        let index = y >> 4;
        if (this.subChunks.has(index)) {
            return this.subChunks.get(index).getBlockRuntimeID(x & 0x0f, y & 0x0f, z & 0x0f, layer);
        }
        return this.runtimeID;
    }

    setBlockRuntimeID(x, y, z, layer, runtimeID) {
        let index = y >> 4;
        if (index < MAXSUBCHUNKS && index >= 0) {
            if (!this.subChunks.has(index)) {
                this.subChunks.set(index, new SubChunk(this.runtimeID));
            }
            return this.subChunks.get(index).setBlockRuntimeID(x & 0x0f, y & 0x0f, z & 0x0f, layer, runtimeID);
        }
    }

    getHighestBlockAt(x, z, layer) {
        for (let i = MAXSUBCHUNKS - 1; i >= 0; --i) {
            if (this.subChunks.has(i)) {
                let y = this.subChunks.get(i).getHighestBlockAt(x, z, layer);
                if (y != -1) {
                    return (i << 4) + y;
                }
            }
        }
        return -1;
    }

    isEmpty() {
        if (this.subChunks.size() == 0) {
            return true;
        }
        for (let i = 0; i < MAXSUBCHUNKS; ++i) {
            if (this.subChunks.has(i)) {
                if (this.subChunks.get(i).isEmpty() === false) {
                    return false;
                }
            }
        }
        return true;
    }

    getSubChunksSendCount() {
        for (let i = MAXSUBCHUNKS - 1; i >= 0; --i) {
            if (this.subChunks.has(i)) {
                if (this.subChunks.get(i).isEmpty() === false) {
                    return i + 1;
                }
            }
        }
        return 0;
    }
}
