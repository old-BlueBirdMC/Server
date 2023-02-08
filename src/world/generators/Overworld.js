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

const Chunk = require("../chunk/Chunk");
const Generator = require("../Generator");
const Perlin = require("../Perlin");
const Ocean = require("../generators/Normal/Ocean");

class Overworld extends Generator {
    static generatorName = "overworld";

    generate(chunkX, chunkZ) {
        return new Promise((resolve) => {
            let seed = 3;
            let air = this.blockStatesMap.legacyToRuntime("minecraft:air", 0);
            let bedrock = this.blockStatesMap.legacyToRuntime("minecraft:bedrock", 0);
            let dirt = this.blockStatesMap.legacyToRuntime("minecraft:dirt", 0);
            let grass = this.blockStatesMap.legacyToRuntime("minecraft:grass", 0);
            let stone = this.blockStatesMap.legacyToRuntime("minecraft:stone", 0);
            let water = this.blockStatesMap.legacyToRuntime("minecraft:water", 0);
            let gravel = this.blockStatesMap.legacyToRuntime("minecraft:gravel", 0);
            let chunk = new Chunk(chunkX, chunkZ, air);
            let perlin = new Perlin();
            for (let x = 0; x < 16; ++x) {
                for (let y = 0; y < 16; ++y)
                    for (let z = 0; z < 16; ++z) {
                        const ocean = new Ocean();
                        ocean.generate(x, y, z, chunkX, chunkZ, chunk, this.blockStatesMap)
                    }
            }
            resolve(chunk);
        });
    }
}

module.exports = Overworld;
