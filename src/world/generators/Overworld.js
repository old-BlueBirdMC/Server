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

class Overworld extends Generator {
    static generatorName = "overworld";

    generate(chunkX, chunkZ) {
        return new Promise(resolve => {
            let chunk = new Chunk(chunkX, chunkZ, this.blockStatesMap.legacyToRuntime("minecraft:air", 0));
            let bedrock = this.blockStatesMap.legacyToRuntime("minecraft:bedrock", 0);
            let dirt = this.blockStatesMap.legacyToRuntime("minecraft:dirt", 0);
            let grass = this.blockStatesMap.legacyToRuntime("minecraft:grass", 0);
            let perlin = new Perlin(0);
            for (let x = 0; x < 16; ++x) {
                for (let z = 0; z < 16; ++z) {
                    for (let i = 0; i < 128; i++) {}
                    let y = perlin.perlin((chunkX << 4) + x, (chunkZ << 4) + z, 0);
                    console.log(y);
                    chunk.setBlockRuntimeID(x, y, z, 0, bedrock);
                    /*chunk.setBlockRuntimeID(x, 1, z, 0, dirt);
                    chunk.setBlockRuntimeID(x, 2, z, 0, dirt);
                    chunk.setBlockRuntimeID(x, 3, z, 0, grass);*/
                }
            }
            resolve(chunk);
        });
    }
}

module.exports = Overworld;
