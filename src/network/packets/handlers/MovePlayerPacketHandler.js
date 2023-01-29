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

class MovePlayerPacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		let x = packet.position.x;
		let y = packet.position.y;
		let z = packet.position.z;
		let rotX = Math.ffmd(Math.round(packet.rotation.x), 360);
		let rotY = Math.ffmd(Math.round(packet.rotation.y), 360);
		// let rotZ = Math.ffmd(Math.round(packet.rotation.z), 360);

        let leftChunkRadius = false;

        if (
            ((x >> 4) / this.player.chunkRadius) != ((this.player.position.x >> 4) / this.player.chunkRadius) ||
            ((z >> 4) / this.player.chunkRadius) != ((this.player.position.z >> 4) / this.player.chunkRadius)
        ) {
            leftChunkRadius = true;
        }

		this.player.position.x = x;
		this.player.position.y = y;
		this.player.position.z = z;
		this.player.rotation.x = rotX;
		this.player.rotation.y = rotY;
        if (leftChunkRadius) {
            this.player.sendChunks();
        }
	}
}

module.exports = MovePlayerPacketHandler;
