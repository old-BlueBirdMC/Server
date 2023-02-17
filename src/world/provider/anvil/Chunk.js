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

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { NBTBEBinaryStream } = require("bbmc-nbt");

export default class Chunk {
    /**
     * Chunk format version
     * @type {Number}
     */
    dataVersion;
    /**
     * x position in the map
     * @type {Number}
     */
    xPos;
    /**
     * z position in the map
     * @type {Number}
     */
    zPos;
    /**
     * y position in the map
     * @type {Number}
     */
    yPos;
    /**
     * step in the chunk generation process
     * @type {String}
     */
    status;
    /**
     * Last update time
     * @type {BigInt}
     */
    lastUpdate;
    /**
     * list of sections
     * @type {Set}
     */
    sections;

    /**
     * initializes a chunk
     * @param {Number} x
     * @param {Number} z
     */
    constructor(x, z) {
        this.dataVersion = 0;
        this.xPos = x;
        this.zPos = z;
        this.yPos = -2;
        this.status = "full";
        this.lastUpdate = 0;
        this.sections = new Map();
    }

    /**
     * loads up values from chunk data
     * @param {Buffer} data
     */
    loadChunkData(data) {
        if (data !== null) {
            let stream = new NBTBEBinaryStream(data);
            let root = stream.readRootTag();
            for (let i = 0; i < root.value.length; ++i) {
                let entry = root.value[i];
                if (entry.tagName == "DataVersion") {
                    this.dataVersion = entry.value;
                } else if (entry.tagName == "xPos") {
                    this.xPos = entry.value;
                } else if (entry.tagName == "zPos") {
                    this.zPos = entry.value;
                } else if (entry.tagName == "yPos") {
                    this.yPos = entry.value;
                } else if (entry.tagName == "Status") {
                    this.status = entry.value;
                } else if (entry.tagName == "LastUpdate") {
                    this.lastUpdate = entry.value;
                } else if (entry.tagName == "sections") {
                    // todo
                }
            }
        }
    }
}
