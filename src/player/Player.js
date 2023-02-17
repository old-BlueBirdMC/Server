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

import Vector2F from "../network/minecraft/types/Vector2F.js";
import Vector3F from "../network/minecraft/types/Vector3F.js";
import NetworkChunkPublisherUpdatePacket from "../network/minecraft/packets/NetworkChunkPublisherUpdatePacket.js";
import PlayStatusPacket from "../network/minecraft/packets/PlayStatusPacket.js";
import BlockCoordinates from "../network/minecraft/types/BlockCoordinates.js";
import LevelChunkPacket from "../network/minecraft/packets/LevelChunkPacket.js";
import MinecraftBinaryStream from "../misc/MinecraftBinaryStream.js";
import GameMode from "../network/minecraft/constants/GameMode.js";
import Human from "../entity/Human.js";
import TextPacket from "../network/minecraft/packets/TextPacket.js";
import TextTypes from "../network/minecraft/constants/TextTypes.js";
import DisconnectPacket from "../network/minecraft/packets/DisconnectPacket.js";
import ServerInfo from "../ServerInfo.js";
import PlayStatus from "../network/minecraft/constants/PlayStatus.js";
import RakNetPlayerManager from "../managers/RakNetPlayerManager.js";
import EntityMetaDataFlags from "../network/minecraft/constants/EntityMetaDataFlags.js";
import MetadataListProperties from "../network/minecraft/constants/MetadataListProperties.js";
import SetEntityDataPacket from "../network/minecraft/packets/SetEntityDataPacket.js";
import EntityProperties from "../network/minecraft/types/EntityProperties.js";
import SetPlayerGameTypePacket from "../network/minecraft/packets/SetPlayerGameTypePacket.js";
import PlayerAttribute from "../network/minecraft/types/PlayerAttribute.js";

export default class Player extends Human {
    useCompression = false;
    connection;
    server;
    clientData;
    auth;
    name;
    chunkRadius;
    position;
    rotation;
    onGround = true;
    gamemode = GameMode.creative;
    breathing = true;
    sprint = false;
    attributes = [];
    spawned = false;

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

    disconnect(reason, hideNotification = false) {
        let disconnect = new DisconnectPacket();
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
        stream.writeChunk(chunk, levelChunk.subChunkCount, this.server.resourceManager.blockStatesMap.legacyToRuntime("minecraft:air", 0));
        levelChunk.payload = stream.buffer;
        levelChunk.sendTo(this);
    }

    sendChunks() {
        return new Promise((resolve) => {
            this.sendNetworkChunkPublisherUpdate();
            for (let chunkX = -this.chunkRadius; chunkX <= this.chunkRadius; ++chunkX) {
                for (let chunkZ = -this.chunkRadius; chunkZ <= this.chunkRadius; ++chunkZ) {
                    this.server.testWorld.loadChunk(chunkX + (this.position.x >> 4), chunkZ + (this.position.z >> 4)).then((value) => {
                        this.sendChunk(value);
                    });
                }
            }
            resolve();
        });
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
        for (const [, player] of RakNetPlayerManager.getAllObjectEntries()) {
            player.message(`<${this.name}> ${value}`);
        }
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

    text(id, message, needsTranslation = false, sourceName = "", parameters = [], xuid = "", platformChatID = "") {
        let text = new TextPacket();
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
            new PlayerAttribute(0, 3.4028234663852886e38, 0, 0, "minecraft:absorption"),
            new PlayerAttribute(0, 20, 20, 20, "minecraft:player.saturation"),
            new PlayerAttribute(0, 5, 0, 0, "minecraft:player.exhaustion"),
            new PlayerAttribute(0, 1, 0, 0, "minecraft:knockback_resistance"),
            new PlayerAttribute(0, 20, 20, 20, "minecraft:health"),
            new PlayerAttribute(0, 3.4028234663852886e38, 0.1, 0.1, "minecraft:movement"),
            new PlayerAttribute(0, 2048, 16, 16, "minecraft:follow_range"),
            new PlayerAttribute(0, 20, 20, 20, "minecraft:player.hunger"),
            new PlayerAttribute(0, 3.4028234663852886e38, 1, 1, "minecraft:attack_damage"),
            new PlayerAttribute(0, 24791, 0, 0, "minecraft:player.level"),
            new PlayerAttribute(0, 1, 0, 0, "minecraft:player.experience"),
            new PlayerAttribute(0, 3.4028234663852886e38, 0.02, 0.02, "minecraft:underwater_movement"),
            new PlayerAttribute(-1024, 1024, 0, 0, "minecraft:luck"),
            new PlayerAttribute(0, 2, 0.7, 0.7, "minecraft:horse.jump_strength"),
            new PlayerAttribute(0, 1, 0, 0, "minecraft:zombie.spawn_reinforcements"),
            new PlayerAttribute(0, 3.4028234663852886e38, 0.02, 0.02, "minecraft:lava_movement"),
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
        this.metadataStorage.setFlag(EntityMetaDataFlags.noAI, this.noAI);
        this.metadataStorage.setFlag(EntityMetaDataFlags.canClimb, this.canClimb);
        this.metadataStorage.setFlag(EntityMetaDataFlags.canDash, this.canDash);
        this.metadataStorage.setFlag(EntityMetaDataFlags.canPowerJump, this.canPowerJump);
        this.metadataStorage.setFlag(EntityMetaDataFlags.swimming, this.swimming);
        this.metadataStorage.setFlag(EntityMetaDataFlags.hasCollision, this.hasCollision);
        this.metadataStorage.setFlag(EntityMetaDataFlags.affectedByGravity, this.affectedByGravity);
        this.metadataStorage.setFlag(EntityMetaDataFlags.sprinting, this.sprint);
    }

    setPlayerGameType(value) {
        let translatedGamemode = this.server.translateGamemode(value);
        if (translatedGamemode === -1) {
            return null;
        }
        if (this.gamemode !== translatedGamemode) {
            const setPlayerGameType = new SetPlayerGameTypePacket();
            setPlayerGameType.mode = translatedGamemode;
            setPlayerGameType.sendTo(this);
            this.gamemode = translatedGamemode;
        }
    }

    updateData(updateFlags = false) {
        if (updateFlags === true) {
            this.updateMetadataFlags();
        }
        const setEntityData = new SetEntityDataPacket();
        setEntityData.runtimeEntityID = this.id;
        setEntityData.metadata = this.metadataStorage.metadata;
        setEntityData.properties = new EntityProperties();
        setEntityData.properties.intProperties = [];
        setEntityData.properties.floatProperties = [];
        setEntityData.tick = 0;
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
