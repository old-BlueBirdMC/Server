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

const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class StartGamePacket extends PacketsBase {
    static id = Identifiers.startGame;

    entityID;
    runtimeEntityID;
    playerGamemode;
    playerPosition;
    rotation;
    seed;
    biomeType;
    biomeName;
    dimension;
    worldType;
    worldGamemode;
    difficulty;
    spawnPosition;
    achievementsDisabled;
    editorWorld;
    dayCycleStopTime;
    eduOffer;
    eduFeaturesEnabled;
    eduProductUUID;
    rainLevel;
    lightningLevel;
    hasConfirmedPlatformLockedContent;
    isMultiplayer;
    broadcastToLAN;
    xboxLiveBroadcatMode;
    platformBroadcastMode;
    enableCommands;
    requireResourcePacks;
    gameRules;
    experiments;
    experimentsPreviouslyUsed;
    bonusChest;
    mapEnabled;
    permissionLevel;
    serverChunkTickRange;
    hasLockedBehaviorPack;
    hasLockedTexturepack;
    isFromLockedWorldTemplate;
    msaGamertagsOnly;
    isFromWorldTemplate;
    isWorldTemplateOptionLocked;
    onlySpawnV1Villagers;
    personaDisabled;
    customSkinsDisabled;
    emoteChatMuted;
    gameVersion;
    limitedWorldWidth;
    limitedWorldLength;
    isNewNether;
    eduResourceURI;
    experimentalGameplayOverride;
    chatRestrictionLevel;
    playerInteractionsDisabled;
    levelID;
    worldName;
    premiumWorldTemplateID;
    isTrial;
    movementAuthority;
    rewindHistorySize;
    serverAuthoritativeBlockBreaking;
    currentTick;
    enchantmentSeed;
    blockProperties;
    itemStates;
    multiplayerCorrelationID;
    serverAuthoritativeInventory;
    engine;
    propertyData;
    blockPaletteChecksum;
    worldTemplateID;
    clientSideGeneration;

    deserialize() {
        this.entityID = this.readEntityID();
        this.runtimeEntityID = this.readRuntimeEntityID();
        this.playerGamemode = this.readGamemode();
        this.playerPosition = this.readVector3F();
        this.rotation = this.readVector2F();
        this.seed = this.readUnsignedLongLE();
        this.biomeType = this.readShortLE();
        this.biomeName = this.readStringVarInt();
        this.dimension = this.readSignedVarInt();
        this.worldType = this.readSignedVarInt();
        this.worldGamemode = this.readGamemode();
        this.difficulty = this.readSignedVarInt();
        this.spawnPosition = this.readBlockCoordinates();
        this.achievementsDisabled = this.readBool();
        this.editorWorld = this.readBool();
        this.dayCycleStopTime = this.readSignedVarInt();
        this.eduOffer = this.readSignedVarInt();
        this.eduFeaturesEnabled = this.readBool();
        this.eduProductUUID = this.readStringVarInt();
        this.rainLevel = this.readFloatLE();
        this.lightningLevel = this.readFloatLE();
        this.hasConfirmedPlatformLockedContent = this.readBool();
        this.isMultiplayer = this.readBool();
        this.broadcastToLAN = this.readBool();
        this.xboxLiveBroadcatMode = this.readVarInt();
        this.platformBroadcastMode = this.readVarInt();
        this.enableCommands = this.readBool();
        this.requireResourcePacks = this.readBool();
        this.gameRules = this.readGameRules();
        this.experiments = this.readExperiments();
        this.experimentsPreviouslyUsed = this.readBool();
        this.bonusChest = this.readBool();
        this.mapEnabled = this.readBool();
        this.permissionLevel = this.readUnsignedByte();
        this.serverChunkTickRange = this.readIntLE();
        this.hasLockedBehaviorPack = this.readBool();
        this.hasLockedTexturepack = this.readBool();
        this.isFromLockedWorldTemplate = this.readBool();
        this.msaGamertagsOnly = this.readBool();
        this.isFromWorldTemplate = this.readBool();
        this.isWorldTemplateOptionLocked = this.readBool();
        this.onlySpawnV1Villagers = this.readBool();
        this.personaDisabled = this.readBool();
        this.customSkinsDisabled = this.readBool();
        this.emoteChatMuted = this.readBool();
        this.gameVersion = this.readStringVarInt();
        this.limitedWorldWidth = this.readIntLE()();
        this.limitedWorldLength = this.readIntLE();
        this.isNewNether = this.readBool();
        this.eduResourceURI = this.readEducationSharedResourceURI();
        this.experimentalGameplayOverride = this.readBool();
        this.chatRestrictionLevel = this.readUnsignedByte();
        this.playerInteractionsDisabled = this.readBool();
        this.levelID = this.readStringVarInt();
        this.worldName = this.readStringVarInt();
        this.premiumWorldTemplateID = this.readStringVarInt();
        this.isTrial = this.readBool();
        this.movementAuthority = this.readSignedVarInt();
        this.rewindHistorySize = this.readSignedVarInt();
        this.serverAuthoritativeBlockBreaking = this.readBool();
        this.currentTick = this.readLongLE();
        this.enchantmentSeed = this.readSignedVarInt();
        this.blockProperties = this.readBlockProperties();
        this.itemStates = this.readItemStates();
        this.multiplayerCorrelationID = this.readStringVarInt();
        this.serverAuthoritativeInventory = this.readBool();
        this.engine = this.readStringVarInt();
        this.propertyData = this.readNBT();
        this.blockPaletteChecksum = this.readUnsignedLongLE();
        this.worldTemplateID = this.readUUID();
        this.clientSideGeneration = this.readBool();
    }

    serialize() {
        this.writeEntityID(this.entityID);
        this.writeRuntimeEntityID(this.runtimeEntityID);
        this.writeGamemode(this.playerGamemode);
        this.writeVector3F(this.playerPosition);
        this.writeVector2F(this.rotation);
        this.writeUnsignedLongLE(this.seed);
        this.writeShortLE(this.biomeType);
        this.writeStringVarInt(this.biomeName);
        this.writeSignedVarInt(this.dimension);
        this.writeSignedVarInt(this.worldType);
        this.writeGamemode(this.worldGamemode);
        this.writeSignedVarInt(this.difficulty);
        this.writeBlockCoordinates(this.spawnPosition);
        this.writeBool(this.achievementsDisabled);
        this.writeBool(this.editorWorld);
        this.writeSignedVarInt(this.dayCycleStopTime);
        this.writeSignedVarInt(this.eduOffer);
        this.writeBool(this.eduFeaturesEnabled);
        this.writeStringVarInt(this.eduProductUUID);
        this.writeFloatLE(this.rainLevel);
        this.writeFloatLE(this.lightningLevel);
        this.writeBool(this.hasConfirmedPlatformLockedContent);
        this.writeBool(this.isMultiplayer);
        this.writeBool(this.broadcastToLAN);
        this.writeVarInt(this.xboxLiveBroadcatMode);
        this.writeVarInt(this.platformBroadcastMode);
        this.writeBool(this.enableCommands);
        this.writeBool(this.requireResourcePacks);
        this.writeGameRules(this.gameRules);
        this.writeExperiments(this.experiments);
        this.writeBool(this.experimentsPreviouslyUsed);
        this.writeBool(this.bonusChest);
        this.writeBool(this.mapEnabled);
        this.writeUnsignedByte(this.permissionLevel);
        this.writeIntLE(this.serverChunkTickRange);
        this.writeBool(this.hasLockedBehaviorPack);
        this.writeBool(this.hasLockedTexturepack);
        this.writeBool(this.isFromLockedWorldTemplate);
        this.writeBool(this.msaGamertagsOnly);
        this.writeBool(this.isFromWorldTemplate);
        this.writeBool(this.isWorldTemplateOptionLocked);
        this.writeBool(this.onlySpawnV1Villagers);
        this.writeBool(this.personaDisabled);
        this.writeBool(this.customSkinsDisabled);
        this.writeBool(this.emoteChatMuted);
        this.writeStringVarInt(this.gameVersion);
        this.writeIntLE(this.limitedWorldWidth);
        this.writeIntLE(this.limitedWorldLength);
        this.writeBool(this.isNewNether);
        this.writeEducationSharedResourceURI(this.eduResourceURI);
        this.writeBool(this.experimentalGameplayOverride);
        this.writeUnsignedByte(this.chatRestrictionLevel);
        this.writeBool(this.playerInteractionsDisabled);
        this.writeStringVarInt(this.levelID);
        this.writeStringVarInt(this.worldName);
        this.writeStringVarInt(this.premiumWorldTemplateID);
        this.writeBool(this.isTrial);
        this.writeSignedVarInt(this.movementAuthority);
        this.writeSignedVarInt(this.rewindHistorySize);
        this.writeBool(this.serverAuthoritativeBlockBreaking);
        this.writeLongLE(this.currentTick);
        this.writeSignedVarInt(this.enchantmentSeed);
        this.writeBlockProperties(this.blockProperties);
        this.writeItemStates(this.itemStates);
        this.writeStringVarInt(this.multiplayerCorrelationID);
        this.writeBool(this.serverAuthoritativeInventory);
        this.writeStringVarInt(this.engine);
        this.writeNBT(this.propertyData);
        this.writeUnsignedLongLE(this.blockPaletteChecksum);
        this.writeUUID(this.worldTemplateID);
        this.writeBool(this.clientSideGeneration);
    }
}

module.exports = StartGamePacket;
