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

const Vector2F = require("../network/types/Vector2F");
const Vector3F = require("../network/types/Vector3F");
const NetworkChunkPublisherUpdatePacket = require("../network/packets/NetworkChunkPublisherUpdatePacket");
const PlayStatusPacket = require("../network/packets/PlayStatusPacket");
const BlockCoordinates = require("../network/types/BlockCoordinates");
const LevelChunkPacket = require("../network/packets/LevelChunkPacket");
const MinecraftBinaryStream = require("../misc/MinecraftBinaryStream");
const GameMode = require("../network/constants/GameMode");
const Human = require("../entity/Human");
const TextPacket = require("../network/packets/TextPacket");
const TextTypes = require("../network/constants/TextTypes");
const DisconnectPacket = require("../network/packets/DisconnectPacket");
const ServerInfo = require("../ServerInfo");
const PlayStatus = require("../network/constants/PlayStatus");
const CommandData = require("../network/types/CommandData");
const AvailableCommandsPacket = require("../network/packets/AvailableCommandsPacket");
const RakNetPlayerManager = require("../managers/RakNetPlayerManager");
const EntityMetaDataFlags = require("../network/constants/EntityMetaDataFlags");
const MetadataListProperties = require("../network/constants/MetadataListProperties");
const SetEntityDataPacket = require("../network/packets/SetEntityDataPacket");
const EntityProperty = require("../network/types/EntityProperty");
const SetPlayerGameTypePacket = require("../network/packets/SetPlayerGameTypePacket");
const CommandEnum = require("../network/types/CommandEnum");
const PlayerAttribute = require("../network/types/PlayerAttribute");

class Player extends Human {
	connection;
	server;
	loginClient;
	loginIdentity;
	chunkRadius;
	position;
	rotation;
	realName;
	name;
	gamemode = GameMode.creative;
	breathing = true;
	resourcePackClientResponseSent = false; // fix spamming
	readyToLogin = false;
   	attributes = [];

	constructor(connection, server) {
		super();
		this.connection = connection;
		this.server = server;
		this.position = new Vector3F(); // TEMP UP UNLTI WORLDS ARE MADE
		this.position.x = 0.0;
		this.position.y = 8.0;
		this.position.z = 0.0;
		this.rotation = new Vector2F(); // TEMP UP UNLTI WORLDS ARE MADE
		this.rotation.x = 0.0;
		this.rotation.z = 0.0;
		this.boundingBox.x = 0.6; // width
		this.boundingBox.z = 1.9; // height
		this.updateMetadataFlags();
		this.updateAttributes();
	}

	updateName(updateFName = false) {
		let retVal;
		if (typeof this.loginIdentity === "undefined") {
			retVal = this.connection.address.toString();
		} else if (typeof this.loginIdentity[2] === "undefined") {
			retVal = this.connection.address.toString();
		} else {
			retVal = this.loginIdentity[2]["extraData"]["displayName"];
		}
		this.realName = retVal;
		if (updateFName === true) {
			this.name = retVal;
		}
	}

	getRealName() {
		return this.realName;
	}

	getName() {
		return this.name;
	}

	message(value) {
		this.text(TextTypes.raw, value);
	}

	popup(value) {
		this.text(TextTypes.popup, value);
	}

	tip(value) {
		this.text(TextTypes.tip, value);
	}

	disconnect(reason, hideNotification = false) {
		const disconnect = new DisconnectPacket();
		disconnect.message = reason;
		disconnect.hideNotification = hideNotification;
		disconnect.sendTo(this);
	}

	sendNetworkChunkPublisherUpdate() {
		let networkChunkPublisherUpdate = new NetworkChunkPublisherUpdatePacket();
		networkChunkPublisherUpdate.position = new BlockCoordinates();
		networkChunkPublisherUpdate.position.x = Math.floor(this.position.x);
		networkChunkPublisherUpdate.position.y = Math.floor(this.position.y);
		networkChunkPublisherUpdate.position.z = Math.floor(this.position.z);
		networkChunkPublisherUpdate.radius = this.chunkRadius << 4;
		networkChunkPublisherUpdate.savedChunks = [];
		networkChunkPublisherUpdate.sendTo(this);
	}

	 sendChunk(chunk) {
		let levelChunk = new LevelChunkPacket();
		levelChunk.subChunkCount = chunk.getSubChunksSendCount();
		levelChunk.highestSubChunkCount = 0;
		levelChunk.cacheEnabled = false;
		levelChunk.x = chunk.x;
		levelChunk.z = chunk.z;
		let stream = new MinecraftBinaryStream();
		stream.writeChunk(chunk, levelChunk.subChunkCount);
		levelChunk.payload = stream.buffer;
		levelChunk.sendTo(this);
	}

	sendAvailableCommands() {
		let data = [];
		// let enums = {};
		Object.values(this.server.commandsList.getAllCommands()).forEach((value) => {
			if (typeof data[value.name] !== "undefined") {
				return;
			}
			let cmdData = new CommandData();
			cmdData.name = value.name.toLowerCase();
			cmdData.description = value.description;
			cmdData.flags = 0;
			cmdData.permissionLevel = 0;
			cmdData.aliases = value.aliases;
			let cmdOverloads = value.overloads;
			if (Array.isArray(cmdOverloads)) {
				if (cmdOverloads.length !== 0) {
					cmdData.overloads = [
						[
							cmdOverloads
						]
					];
				} else {
					cmdData.overloads = [];
				}
			}
			data.push(cmdData);
			// if (value.enums.length > 0) {
			// 	enums = {"name": value.name, "enums": value.enums};
			// }
		});
		let availableCommands = new AvailableCommandsPacket();
		availableCommands.enumValues = [];
		availableCommands.suffixes = [];
		// todo availableCommands.enums = enums;
		availableCommands.enums = [];
		availableCommands.commandData = data;
		availableCommands.dynamicEnums = [];
		availableCommands.enumConstraints = [];
		availableCommands.sendTo(this);
	}

	sendPlayStatus(status) {
		let playStatus = new PlayStatusPacket();
		playStatus.status = status;
		playStatus.sendTo(this);
	}

	sendChatMessage(value) {
		if (typeof value !== "string") return;
		if (value.length >= 256) return;
		if (value.trim() === "") return;
 		for (const [,player] of RakNetPlayerManager.getAllObjectEntries()) {
			player.message(`<${this.getRealName()}> ${value}`);
		}
	}

	text(id, message, needsTranslation = false, sourceName = "", parameters = [], xuid = "", platformChatID = "") {
		const text = new TextPacket();
		text.typeID = id;
		text.message = message;
		text.needsTranslation = needsTranslation;
		text.sourceName = sourceName;
		text.parameters = parameters;
		text.xuid = xuid;
		text.platformChatID = platformChatID;
		text.sendTo(this);
	}

    updateAttributes() {
        this.attributes = [
            new PlayerAttribute(0, 3.4028234663852886e+38, 0, 0, "minecraft:absorption"),
            new PlayerAttribute(0, 20, 20, 20, "minecraft:player.saturation"),
            new PlayerAttribute(0, 5, 0, 0, "minecraft:player.exhaustion"),
            new PlayerAttribute(0, 1, 0, 0, "minecraft:knockback_resistance"),
            new PlayerAttribute(0, 20, 20, 20, "minecraft:health"),
            new PlayerAttribute(0, 3.4028234663852886e+38, 0.10, 0.10, "minecraft:movement"),
            new PlayerAttribute(0, 2048, 16, 16, "minecraft:follow_range"),
            new PlayerAttribute(0, 20, 20, 20, "minecraft:player.hunger"),
            new PlayerAttribute(0, 3.4028234663852886e+38, 1, 1, "minecraft:attack_damage"),
            new PlayerAttribute(0, 24791, 0, 0, "minecraft:player.level"),
            new PlayerAttribute(0, 1, 0, 0, "minecraft:player.experience"),
            new PlayerAttribute(0, 3.4028234663852886e+38, 0.02, 0.02, "minecraft:underwater_movement"),
            new PlayerAttribute(-1024, 1024, 0, 0, "minecraft:luck"),
            new PlayerAttribute(0, 2, 0.7, 0.7, "minecraft:horse.jump_strength"),
            new PlayerAttribute(0, 1, 0, 0, "minecraft:zombie.spawn_reinforcements"),
            new PlayerAttribute(0, 3.4028234663852886e+38, 0.02, 0.02, "minecraft:lava_movement"),
        ];
    }

	updateMetadataFlags() {
		this.metadataStorage.setFloat(MetadataListProperties.boundingBoxWidth, this.boundingBox.x);
		this.metadataStorage.setFloat(MetadataListProperties.boundingBoxHeight, this.boundingBox.z);
        this.metadataStorage.setShort(MetadataListProperties.maxAir, 400);
        this.metadataStorage.setShort(MetadataListProperties.air, 0);
        this.metadataStorage.setLong(MetadataListProperties.leadHolderEntityID, -1);
        this.metadataStorage.setFloat(MetadataListProperties.scale, 1);

		this.metadataStorage.setFlag(EntityMetaDataFlags.breathing, this.breathing);
		this.metadataStorage.setFlag(EntityMetaDataFlags.onFire, this.onFire);
        this.metadataStorage.setFlag(EntityMetaDataFlags.fireImmune, this.fireImmune);
        //this.metadataStorage.setFlag(EntityMetaDataFlags.noAI, this.noAI);
        this.metadataStorage.setFlag(EntityMetaDataFlags.canClimb, this.canClimb);
        this.metadataStorage.setFlag(EntityMetaDataFlags.canDash, this.canDash);
        this.metadataStorage.setFlag(EntityMetaDataFlags.canPowerJump, this.canPowerJump);
        this.metadataStorage.setFlag(EntityMetaDataFlags.swimming, this.swimming);
        this.metadataStorage.setFlag(EntityMetaDataFlags.hasCollision, this.hasCollision);
        this.metadataStorage.setFlag(EntityMetaDataFlags.affectedByGravity, this.affectedByGravity);
        this.metadataStorage.setFlag(EntityMetaDataFlags.sprinting, false);
	}

	setPlayerGameType(value) {
		let translatedGM = this.translateGM(value);
		if (translatedGM === -1) {
			return null;
		}
		if (this.gamemode !== translatedGM) {
			const setPlayerGameType = new SetPlayerGameTypePacket();
			setPlayerGameType.mode = translatedGM;
			setPlayerGameType.sendTo(this);
			this.gamemode = translatedGM;
		}
	}

	translateGM(value) {
		let gm = -1;
		switch (value.toLowerCase()) {
			case "survival":
			case  "s":
				gm = GameMode.survival;
				break;
			case "creative":
			case "c":
				gm = GameMode.creative;
				break;
			case "adventure":
			case "a":
				gm = GameMode.adventure;
				break;
			case "spectator":
			case "v":
				gm = GameMode.spectator;
				break;
		}
		return gm;
	}

	updateData(viewers = []) {
		const setEntityData = new SetEntityDataPacket();
		setEntityData.runtimeEntityID = this.id;
		setEntityData.metadata = this.metadataStorage.metadata;
		setEntityData.properties = new EntityProperty();
		setEntityData.properties.intProperties = [];
		setEntityData.properties.floatProperties = [];
		setEntityData.tick = 0;
		if (viewers.length > 0) {
			viewers.forEach(viewer => {
				setEntityData.sendTo(viewer);
			});
			return;
		}
		setEntityData.sendTo(this);
	}

	checkProtocol(version) {
		if (version !== ServerInfo.minecraftProtocolVersion) {
			const FailedStatus = [version < ServerInfo.protocolVersion, PlayStatus.loginFailedClient, version > ServerInfo.protocolVersion, PlayStatus.loginFailedServer];
			if (FailedStatus[0]) {
				this.sendPlayStatus(FailedStatus[1]);
			} else if (FailedStatus[2]) {
				this.sendPlayStatus(FailedStatus[3]); 
			}
			this.disconnect("", true);
			return;
		}
	}
}

module.exports = Player;
