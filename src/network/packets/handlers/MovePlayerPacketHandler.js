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
		let x = packet.position.x.toFixed(4);
		let y = packet.position.y.toFixed(4);
		let z = packet.position.z.toFixed(4);
		let rotX = Math.ffmd(Math.round(packet.rotation.x), 360);
		let rotY = Math.ffmd(Math.round(packet.rotation.y), 360);
		// let rotZ = Math.ffmd(Math.round(packet.rotation.z), 360);

		this.player.position.x = x;
		this.player.position.y = y;
		this.player.position.z = z;
		this.player.rotation.x = rotX;
		this.player.rotation.y = rotY;
	}
}

module.exports = MovePlayerPacketHandler;
