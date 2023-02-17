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

import Chunk from "../chunk/Chunk.js";
import Generator from "../Generator.js";
import Perlin from "../Perlin.js";

export default class Overworld extends Generator {
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
                for (let z = 0; z < 16; ++z) {
                    let y = perlin.perlin((chunkX << 4) + x, (chunkZ << 4) + z, 10.0 * seed, 1, 8, 4, 0.4, 2) + 62;
                    let startPoint = y;
                    while (y >= 0) {
                        if (y < 1 && y >= 0) {
                            chunk.setBlockRuntimeID(x, y, z, 0, bedrock);
                        } else if (y < startPoint && y > startPoint - 4) {
                            if (y > 60) {
                                chunk.setBlockRuntimeID(x, y, z, 0, dirt);
                            } else {
                                chunk.setBlockRuntimeID(x, y, z, 0, gravel);
                            }
                        } else if (y === startPoint) {
                            if (y > 61) {
                                chunk.setBlockRuntimeID(x, y, z, 0, grass);
                            } else {
                                chunk.setBlockRuntimeID(x, y, z, 0, gravel);
                            }
                        } else {
                            chunk.setBlockRuntimeID(x, y, z, 0, stone);
                        }
                        --y;
                    }
                    for (let i = 0; i < 62; ++i) {
                        if (chunk.getBlockRuntimeID(x, i, z, 0) == air) {
                            chunk.setBlockRuntimeID(x, i, z, 0, water);
                        }
                    }
                }
            }
            resolve(chunk);
        });
    }
}
