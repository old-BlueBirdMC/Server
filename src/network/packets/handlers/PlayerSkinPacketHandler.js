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

const PlayerSkinPacket = require("../PlayerSkinPacket");
const HandlersBase = require("./HandlersBase");

class PlayerSkinPacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		const playerSkin = new PlayerSkinPacket();
		playerSkin.uuid = this.player.identity;
		playerSkin.skin = packet.skin;
		playerSkin.oldSkinName = "";
		playerSkin.newSkinName = "";
		this.server.getOnlinePlayers().forEach(viewers => { // impl wg,w,c,rr
			playerSkin.sendTo(viewers);
		});
	}
}

module.exports = PlayerSkinPacketHandler;
