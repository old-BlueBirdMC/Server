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

const CoordinateUtils = require("../../CoordinateUtils");
const Chunk = require("./Chunk");
const Region = require("./Region");
const fs = require("fs");

class Anvil {
    /**
     * Path to the world folder
     * @type {String}
     */
    path;
    /**
     * Holds all loaded regions
     * @type {Map}
     */
    regions;
    /**
     * Holds all loaded chunks
     * @type {Map}
     */
    chunks;

    /**
     * loads up a world
     * @param {String} path
     */
    constructor(path) {
        this.path = path;
        this.regions = new Map();
        this.chunks = new Map();
    }

    /**
     * loads a region
     * @param {Number} x
     * @param {Number} z
     * @returns {Region}
     */
    loadRegion(x, z) {
        let xz = CoordinateUtils.hashXZ(x, z);
        if (!this.regions.has(xz)) {
            let region = new Region(`${this.path}/region/${x}.${z}.mca`);
            this.regions.set(xz, region);
            return region;
        }
        return this.regions.get(xz);
    }

    /**
     * loads a chunk
     * @param {Number} x
     * @param {Number} z
     * @returns {Chunk}
     */
    loadChunk(x, z) {
        let xz = CoordinateUtils.hashXZ(x, z);
        if (!this.chunks.has(xz)) {
            let region = this.loadRegion(x >> 4, z >> 4);
            let data = region.readChunkData(x & 0x0f, z & 0x0f);
            let chunk = new Chunk(x, z);
            chunk.loadChunkData(data);
            this.chunks.set(xz, chunk);
            return chunk;
        }
        return this.chunks.get(xz);
    }
}

module.exports = Anvil;
