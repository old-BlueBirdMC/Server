/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
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

class Player extends Human {
	connection;
	server;
	loginClient;
	loginIdentity;
	chunkRadius;
	position;
	rotation;
	gamemode = GameMode.creative;
	breathing = true;
	resourcePackClientResponseSent = false; // fix spamming
	readyToLogin = false;

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
		this.updateMetadataFlags();
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
			cmdData.aliases = []; // soon
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
		availableCommands.commandData = data;
		// availableCommands.enums = enums;
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
			player.message(`<${this.server.getPlayerName(this)}> ${value}`);
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

	updateMetadataFlags() {
		// let valScale = this.metadataManager.createFlag(MetadataListProperties.scale, this.scaleValue);
		// this.metadataToSend.push(valScale);
		let valBreath = this.metadataManager.createEntityFlag(this.metadataToSend, EntityMetaDataFlags.breathing, this.breathing); // smth wrong with mcbs: confirm
		this.metadataToSend.push(valBreath);
		// let valFire = this.metadataManager.createEntityFlag(this.metadataToSend, EntityMetaDataFlags.onFire, this.onFire);
		// this.metadataToSend.push(valFire);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.onFire, this.onFire);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.fireImmune, this.fireImmune);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.noAI, this.noAI);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.canClimb, this.canClimb);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.canDash, this.canDash);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.canFly, this.canFly);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.canPowerJump, this.canPowerJump);
		// this.metadataManager.setEntityFlag(EntityMetaDataFlags.swimming, this.swmming);
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
		console.log(gm);
		return gm;
	}

	updateData(viewers = []) {
		const setEntityData = new SetEntityDataPacket();
		setEntityData.runtimeEntityID = this.id;
		setEntityData.metadata = this.metadataToSend;
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
