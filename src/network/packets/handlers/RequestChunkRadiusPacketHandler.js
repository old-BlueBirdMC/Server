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

const HandlersBase = require("./HandlersBase");
const ChunkRadiusUpdatedPacket = require("../ChunkRadiusUpdatedPacket");

class RequestChunkRadiusPacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		let chunkRadiusUpdated = new ChunkRadiusUpdatedPacket();
		chunkRadiusUpdated.chunkRadius = packet.chunkRadius;
		chunkRadiusUpdated.sendTo(this.player);
		this.player.chunkRadius = chunkRadiusUpdated.chunkRadius;

		for (let chunkX = -this.player.chunkRadius; chunkX <= this.player.chunkRadius; ++chunkX) {
			for (let chunkZ = -this.player.chunkRadius; chunkZ <= this.player.chunkRadius; ++chunkZ) {
				//this.player.sendChunk(await this.server.testWorld.loadChunk(chunkX, chunkZ));
			}
		}
		this.player.sendNetworkChunkPublisherUpdate();
	}
}

module.exports = RequestChunkRadiusPacketHandler;