const Biome = require("../../Biome");
const Perlin = require("../../Perlin");

class Ocean {
    generate(x, y, z, chunkX, chunkZ, chunk, blockMap) {
            let bedrock = blockMap.legacyToRuntime("minecraft:bedrock", 0);
            let stone = blockMap.legacyToRuntime("minecraft:stone", 0);
            let water = blockMap.legacyToRuntime("minecraft:water", 0);
            let perlin = new Perlin();
            chunk.biomes[y >> 4].setBlockRuntimeID(x & 0x0f, y & 0x0f, z & 0x0f, Biome.OCEAN);
            const noise = perlin.octaveNoise(x, y, z, 8, 4, 5)
            if (y === 0) chunk.setBlockRuntimeID(x, y, z, 0, bedrock);
            if (noise === 0) {
                chunk.setBlockRuntimeID(x, y, z, 0, stone);
            }
    }
}

module.exports = Ocean;
