const Biome = require("../../Biome");
const Perlin = require("../../Perlin");

class Ocean {
    generate(x, y, z, chunkX, chunkZ, chunk, blockMap) {
        return new Promise((resolve) => {
            let bedrock = blockMap.legacyToRuntime("minecraft:bedrock", 0);
            let stone = blockMap.legacyToRuntime("minecraft:stone", 0);
            let water = blockMap.legacyToRuntime("minecraft:water", 0);
            let perlin = new Perlin();
            chunk.biomes[y >> 4].setBlockRuntimeID(x & 0x0f, y & 0x0f, z & 0x0f, Biome.OCEAN);
            for (let bedrockY = 0; bedrockY < 128; ++bedrockY) {
                if (bedrockY === 0) {
                    chunk.setBlockRuntimeID(x, bedrockY, z, 0, bedrock);
                }
                let noise = perlin.noise(((chunkX << 4) + x) * 0.0625, y * 0.0625, ((chunkZ << 4) + z) * 0.0625);
                if (noise > 0) {
                    chunk.setBlockRuntimeID(x, y, z, 0, stone);
                } else if (y <= 62) {
                    chunk.setBlockRuntimeID(x, y, z, 0, water);
                }
            }
            return resolve();
        });
    }
}

module.exports = Ocean;
