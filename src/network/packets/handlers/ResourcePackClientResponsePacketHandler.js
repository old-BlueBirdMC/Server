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

const PermissionLevel = require("../../constants/PermissionLevel");
const ResourcePackClientResponseStatus = require("../../constants/ResourcePackClientResponeStatus");
const Vector3F = require("../../types/Vector3F");
const ResourcePackStackPacket = require("../ResourcePackStackPacket");
const StartGamePacket = require("../StartGamePacket");
const HandlersBase = require("./HandlersBase");
const { Compound } = require("bbmc-nbt");
const EducationSharedResourceURI = require("../../types/EducationSharedResourceURI");
const BroadcastMode = require("../../constants/BroadcastMode");
const WorldType = require("../../constants/WorldType");
const BiomeDefinitionListPacket = require("../BiomeDefinitionListPacket");
const CreativeContentPacket = require("../CreativeContentPacket");
const GameMode = require("../../constants/GameMode");
const PlayStatus = require("../../constants/PlayStatus");
const AvailableEntityIdentifiersPacket = require("../AvailableEntityIdentifiersPacket");
const ChatRestrictionLevel = require("../../constants/ChatRestrictionLevel");
const ServerInfo = require("../../../ServerInfo");
const crypto = require("crypto");
const SetEntityDataPacket = require("../SetEntityDataPacket");
const MinecraftBinaryStream = require("../../../misc/MinecraftBinaryStream");
const UpdateAttributesPacket = require("../UpdateAttributesPacket");
const EntityProperties = require("../../types/EntityProperties");

class ResourcePackClientResponsePacketHandler extends HandlersBase {
    resourcePacksSent = false;

    randomUUID() {
        let stream = new MinecraftBinaryStream(crypto.randomBytes(16));
        return stream.readUUID();
    }

    async startHandling(packet) {
        if (this.resourcePacksSent === true) {
            return;
        }
        await super.startHandling(packet);
        switch (packet.responseStatus) {
            case ResourcePackClientResponseStatus.refused:
                this.player.disconnect("You need to accept the resource packs");
                break;
            case ResourcePackClientResponseStatus.sendPacks:
                break;
            case ResourcePackClientResponseStatus.none:
            case ResourcePackClientResponseStatus.haveAllPacks:
                const resourcePackStack = new ResourcePackStackPacket();
                resourcePackStack.mustAccept = false;
                resourcePackStack.behaviorPacks = [];
                resourcePackStack.texturePacks = [];
                resourcePackStack.gameVersion = ServerInfo.minecraftVersion;
                resourcePackStack.experiments = [];
                resourcePackStack.experimentsPreviouslyUsed = false;
                await resourcePackStack.sendTo(this.player);
                break;
            case ResourcePackClientResponseStatus.completed:
                let worldPos = new Vector3F(); // temp
                worldPos.x = 0.0;
                worldPos.y = 6.0;
                worldPos.z = 0.0;
                const startGame = new StartGamePacket();
                startGame.entityID = BigInt(this.player.id);
                startGame.runtimeEntityID = this.player.id;
                startGame.playerGamemode = this.player.gamemode;
                startGame.playerPosition = this.player.position;
                startGame.rotation = this.player.rotation;
                startGame.seed = 0n;
                startGame.biomeType = 0;
                startGame.biomeName = "plains";
                startGame.dimension = 0;
                startGame.worldType = WorldType.infinite;
                startGame.worldGamemode = GameMode.survival;
                startGame.difficulty = 0;
                startGame.spawnPosition = worldPos;
                startGame.achievementsDisabled = false;
                startGame.editorWorld = false;
                startGame.dayCycleStopTime = 0;
                startGame.eduOffer = 0;
                startGame.eduFeaturesEnabled = false;
                startGame.eduProductUUID = this.randomUUID();
                startGame.rainLevel = 0.0;
                startGame.lightningLevel = 0.0;
                startGame.hasConfirmedPlatformLockedContent = false;
                startGame.isMultiplayer = true;
                startGame.broadcastToLAN = true;
                startGame.xboxLiveBroadcatMode = BroadcastMode.public;
                startGame.platformBroadcastMode = BroadcastMode.public;
                startGame.enableCommands = true;
                startGame.requireResourcePacks = false;
                startGame.gameRules = [];
                startGame.experiments = [];
                startGame.experimentsPreviouslyUsed = false;
                startGame.bonusChest = false;
                startGame.mapEnabled = false;
                startGame.permissionLevel = PermissionLevel.member;
                startGame.serverChunkTickRange = 0;
                startGame.hasLockedBehaviorPack = false;
                startGame.hasLockedTexturepack = false;
                startGame.isFromLockedWorldTemplate = false;
                startGame.msaGamertagsOnly = false;
                startGame.isFromWorldTemplate = false;
                startGame.isWorldTemplateOptionLocked = false;
                startGame.onlySpawnV1Villagers = false;
                startGame.personaDisabled = false;
                startGame.customSkinsDisabled = false;
                startGame.gameVersion = ServerInfo.minecraftVersion;
                startGame.limitedWorldWidth = 0;
                startGame.limitedWorldLength = 0;
                startGame.isNewNether = true;
                startGame.eduResourceURI = new EducationSharedResourceURI();
                startGame.eduResourceURI.buttonName = "";
                startGame.eduResourceURI.linkURI = "";
                startGame.experimentalGameplayOverride = false;
                startGame.levelID = this.randomUUID();
                startGame.chatRestrictionLevel = ChatRestrictionLevel.none;
                startGame.playerInteractionsDisabled = false;
                startGame.worldName = "test";
                startGame.premiumWorldTemplateID = this.randomUUID();
                startGame.isTrial = false;
                startGame.movementAuthority = 0;
                startGame.rewindHistorySize = 0;
                startGame.serverAuthoritativeBlockBreaking = false;
                startGame.currentTick = 0n;
                startGame.enchantmentSeed = 0;
                startGame.blockProperties = [];
                startGame.itemStates = this.server.resourceManager.itemStatesMap.states;
                startGame.multiplayerCorrelationID = "";
                startGame.serverAuthoritativeInventory = false;
                startGame.engine = ServerInfo.engine;
                startGame.propertyData = new Compound();
                startGame.blockPaletteChecksum = 0n;
                startGame.worldTemplateID = this.randomUUID();
                startGame.clientSideGeneration = false;
                await startGame.sendTo(this.player);

                const biomeDefinitionList = new BiomeDefinitionListPacket();
                biomeDefinitionList.nbt = this.server.resourceManager.biomeDefinitionList;
                await biomeDefinitionList.sendTo(this.player);

                const setEntityData = new SetEntityDataPacket();
                setEntityData.runtimeEntityID = this.player.id;
                setEntityData.metadata = this.player.metadataStorage.metadata;
                setEntityData.properties = new EntityProperties();
                setEntityData.properties.intProperties = [];
                setEntityData.properties.floatProperties = [];
                setEntityData.tick = 0;
                await setEntityData.sendTo(this.player);

                const updateAttributes = new UpdateAttributesPacket();
                updateAttributes.runtimeEntityID = this.player.id;
                updateAttributes.attributes = this.player.attributes;
                updateAttributes.tick = 0;
                await updateAttributes.sendTo(this.player);
                
                this.player.sendAvailableCommands();

                const availableEntityIdentifiers = new AvailableEntityIdentifiersPacket();
                availableEntityIdentifiers.nbt = this.server.resourceManager.availableEntityIdentifiers;
                await availableEntityIdentifiers.sendTo(this.player);

                const creativeContent = new CreativeContentPacket();
                creativeContent.entries = this.server.resourceManager.creativeItems;
                await creativeContent.sendTo(this.player);

                this.player.sendPlayStatus(PlayStatus.playerSpawn);
                this.resourcePacksSent = true;
                break;
        }
    }
}

module.exports = ResourcePackClientResponsePacketHandler;
