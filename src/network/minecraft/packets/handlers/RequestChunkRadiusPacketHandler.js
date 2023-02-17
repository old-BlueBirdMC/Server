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

import HandlersBase from "./HandlersBase.js";
import ChunkRadiusUpdatedPacket from "../ChunkRadiusUpdatedPacket.js";

export default class RequestChunkRadiusPacketHandler extends HandlersBase {
    async startHandling(packet) {
        await super.startHandling(packet);

        this.player.chunkRadius = packet.chunkRadius;
        this.player.chunkRadius = 2;

        let chunkRadiusUpdated = new ChunkRadiusUpdatedPacket();
        chunkRadiusUpdated.chunkRadius = this.player.chunkRadius;
        await chunkRadiusUpdated.sendTo(this.player);

        if (!this.player.spawned) {
            this.player.sendChunks();
            this.player.spawned = true;
        }
    }
}
