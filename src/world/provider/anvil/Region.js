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

const BinaryStream = require("bbmc-binarystream");
const fs = require("fs");
const RegionIndex = require("./types/RegionIndex");
const zlib = require("zlib");
const Logger = require("../../../console/Logger");

class Region {
    /**
     * Holds the data stream of the region file
     * @type {BinaryStream}
     */
    stream;
    /**
     * Holds usable indexes that where freed
     * @type {Array.<RegionIndex>}
     */
    freeIndexes;
    /**
     * The file path of the region file
     * @type {String}
     */
    path;

    /**
     * Loads a region file
     * @param {String} path 
     */
    constructor(path) {
        this.log = new Logger({Name: "Region", AllowDebugging: true, WithColors: true});
        fs.readFile(path, "binary", (err, buffer) => {
            if (err) {
                this.log.error(`Failed to read region file ${path}`);
            } else {
                this.path = path;
                this.stream = new BinaryStream(buffer);
                this.freeIndexes = [];
            }
        });
    }

    /**
     * Saves the region file
     */
    save() {
        fs.writeFile(this.path, this.stream.buffer, (err) => {
            if (err) {
                this.log.error(`Failed to write region file ${this.path}`);
            }
        });
    }

    /**
     * Reads the index location of the chunk
     * @param {Number} x
     * @param {Number} z
     * @returns {RegionIndex}
     */
    readIndex(x, z) {
        this.stream.offset = (x + z * 32) << 2;
        let index = new RegionIndex();
        index.offset = this.stream.readUnsignedTriadBE();
        index.length = this.stream.readUnsignedByte();
        return index;
    }

    /**
     * Writes an index to the index table 
     * @param {Number} x 
     * @param {Number} z 
     * @param {Number} offset 
     * @param {Number} length 
     */
    writeIndex(x, z, offset, length) {
        let stream = new BinaryStream();
        stream.writeUnsignedTriadBE(offset);
        stream.writeUnsignedByte(length);
        stream.buffer.copy(this.stream.buffer, (x + z * 32) << 2, 0, 4);
    }

    /**
     * Reads the chunk data from the region
     * @param {Number} x 
     * @param {Number} z
     * @returns {Buffer}
     */
    readChunkData(x, z) {
        let index = this.readIndex(x, z);
        this.stream.offset = index.offset << 12;
        if (index.length) {
            let length = this.stream.readIntBE();
            if ((length + 4) <= (index.length << 12) && length) {
                let compressionType = this.stream.readByte();
                let data = this.stream.read(length - 1);
                if (compressionType == 1) {
                    return zlib.gunzipSync(data);
                }
                if (compressionType == 2) {
                    return zlib.inflateSync(data);
                }
                if (compressionType == 3) {
                    return data;
                }
            }
        }
        return null;
    }

    /**
     * Writes the chunk data to the region
     * @param {Number} x 
     * @param {Number} z 
     * @param {Buffer} data 
     * @param {Number} compressionType
     */
    writeChunkData(x, z, data, compressionType) {
        let temp = new BinaryStream();
        temp.writeIntBE(data.length + 1);
        temp.writeByte(compressionType);
        if (compressionType == 1) {
            temp.write(zlib.gzipSync(data));
        } else if (compressionType == 2) {
            temp.write(zlib.deflateSync(data));
        } else if (compressionType == 3) {
            temp.write(data);
        }
        let sectorCount = (temp.length >> 12) + 1;
        let index = this.readIndex(x, z);
        if (sectorCount > index.length) {
            let i = 0;
            while (i < this.freeIndexes.length) {
                let freeIndex = this.freeIndexes[i];
                if (sectorCount <= freeIndex.length) {
                    temp.buffer.copy(this.stream.buffer, freeIndex.offset << 12, 0, sectorCount << 12);
                    if (sectorCount < freeIndex.length) {
                        let newFreeIndex = new RegionIndex();
                        newFreeIndex.offset = freeIndex.offset + sectorCount;
                        newFreeIndex.length = freeIndex.length - sectorCount;
                        this.freeIndexes.push(newFreeIndex);
                    }
                    this.writeIndex(freeIndex.offset, sectorCount);
                    this.freeIndexes.splice(i, 1);
                    break;
                }
                ++i;
            }
            if (i === this.freeIndexes.length) {
                this.writeIndex(this.stream.buffer.length << 12, sectorCount);
                this.stream.write(temp);
            }
            this.freeIndexes.push({...index});
        } else {
            temp.buffer.copy(this.stream.buffer, index.offset << 12, 0, sectorCount << 12);
            if (sectorCount < index.length) {
                let freeIndex = new RegionIndex();
                freeIndex.offset = index.offset + sectorCount;
                freeIndex.length = index.length - sectorCount;
                this.freeIndexes.push(freeIndex);
            }
            this.writeIndex(index.offset, sectorCount);
        }
    }
}

module.exports = Region;
