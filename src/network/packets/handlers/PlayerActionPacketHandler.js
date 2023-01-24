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

const BlocksList = require("../../../block/BlocksList");
const RakNetPlayerManager = require("../../../managers/RakNetPlayerManager");
const PlayerActionTypes = require("../../constants/PlayerActionTypes");
const UpdateBlockFlags = require("../../constants/UpdateBlockFlags");
const HandlersBase = require("./HandlersBase");

class PlayerActionPacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		if (packet.actionType === PlayerActionTypes.startSprint) {
			this.playerSprint(true);
		} else if (packet.actionType === PlayerActionTypes.stopSprint) {
			this.playerSprint(false);
		} else if (packet.actionType === PlayerActionTypes.interactBlock) {
			// let blockName = "minecraft:chest";
			// let blockMetadata = 0;
			// BlocksList.get(blockName, blockMetadata).interact(this.server.getOnlinePlayerByRID(packet.runtimeEntityID), packet.blockCoordinates, packet.blockFace);
		}
	}

	playerSprint(value) {
		this.player.sprint = value;
		this.player.updateData(this.player.server.getOnlinePlayers(), true);
	}
}

module.exports = PlayerActionPacketHandler;