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
const Ocean = require("./Normal/Ocean");

class Overworld extends Generator {
    static generatorName = "overworld";

    generate(chunkX, chunkZ) {
        return new Promise((resolve) => {
            let seed = 3;
            let air = this.blockStatesMap.legacyToRuntime("minecraft:air", 0);
            let chunk = new Chunk(chunkX, chunkZ, air);
            let perlin = new Perlin();
            let ocean = new Ocean();
            for (let x = 0; x < 16; ++x) {
                for (let z = 0; z < 16; ++z) {
                    for (let y = 0; y < 16; ++y) {
                        let noise = perlin.noise((chunkX << 4) + x + 0.5, y + 0.5, (chunkZ << 4) + z + 0.5, 8, 3);
                        if(noise < 0.25) {
                            if(noise < 0.7) {1
                                ocean.generator(x, y, z, chunkX, chunkZ, chunk, this.blockStatesMap)
                            }
                        }
                    }
                }
            }
            resolve(chunk);
        });
    }
}

module.exports = Overworld;
