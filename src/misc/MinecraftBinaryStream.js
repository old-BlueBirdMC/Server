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

const BinaryStream = require("bbmc-binarystream");
const LoginTokens = require("../network/types/LoginTokens");
const BehaviorPackInfo = require("../network/types/BehaviorPackInfo");
const TexturePackInfo = require("../network/types/TexturePackInfo");
const ResourcePackIDVersion = require("../network/types/ResourcePackIDVersion");
const Experiment = require("../network/types/Experiment");
const GameRule = require("../network/types/GameRule");
const GameRuleTypes = require("../network/constants/GameRuleTypes");
const EducationSharedResourceURI = require("../network/types/EducationSharedResourceURI");
const BlockCoordinates = require("../network/types/BlockCoordinates");
const Vector3F = require("../network/types/Vector3F");
const Vector2F = require("../network/types/Vector2F");
const Vector3I = require("../network/types/Vector3I");
const Vector3U = require("../network/types/Vector3U");
const ItemState = require("../network/types/ItemState");
const BlockProperty = require("../network/types/BlockProperty");
const { NBTNetworkBinaryStream, NBTLEBinaryStream } = require("bbmc-nbt");
const Item = require("../network/types/Item");
const ItemExtraData = require("../network/types/ItemExtraData");
const BitArray = require("../network/constants/BitArray");
const BlockStorage = require("../world/chunk/BlockStorage");
const SubChunk = require("../world/chunk/SubChunk");
const Chunk = require("../world/chunk/Chunk");
const MetadataEntry = require("../entity/MetadataEntry");
const MetadataPropertyTypes = require("../network/constants/MetadataPropertyTypes");
const EntityLink = require("../network/types/EntityLink");
const CommandOriginData = require("../network/types/CommandOriginData");
const CommandOriginDataTypes = require("../network/constants/CommandOriginDataTypes");
const CommandEnum = require("../network/types/CommandEnum");
const CommandArgumentFlags = require("../network/constants/CommandArgumentFlags");
const CommandParam = require("../network/types/CommandParam");
const CommandData = require("../network/types/CommandData");
const CommandEnumConstraint = require("../network/types/CommandEnumConstraint");
const EntityProperty = require("../network/types/EntityProperty");
const PlayerAttribute = require("../network/types/PlayerAttribute");
const PlayerAttributeModifier = require("../network/types/PlayerAttributeModifier");

class MinecraftBinaryStream extends BinaryStream {
    readStringVarInt() {
        let len = this.readVarInt();
        return this.read(len).toString("utf-8");
    }

    writeStringVarInt(value) {
        let buf = Buffer.from(value);
        this.writeVarInt(buf.length);
        this.write(buf);
    }

    readStringIntLE() {
        let len = this.readIntLE();
        return this.read(len).toString("utf-8");
    }

    writeStringIntLE(value) {
        let buf = Buffer.from(value);
        this.writeIntLE(buf.length);
        this.write(buf);
    }

    readByteArrayVarInt() {
        return this.read(this.readVarInt());
    }

    writeByteArrayVarInt(value) {
        this.writeVarInt(value.length);
        this.write(value);
    }

    readByteArrayShortLE() {
        return this.read(this.readShortLE());
    }

    writeByteArrayShortLE(value) {
        this.writeShortLE(value.length);
        this.write(value);
    }

    readLoginTokens() {
        let value = new LoginTokens();
        value.identity = this.readStringIntLE();
        value.client = this.readStringIntLE();
        return value;
    }

    writeLoginTokens(value) {
        this.writeStringIntLE(value.identity);
        this.writeStringIntLE(value.client);
    }

    readBehaviorPackInfo() {
        let value = new BehaviorPackInfo();
        value.uuid = this.readStringVarInt();
        value.version = this.readStringVarInt();
        value.size = this.readUnsignedLongLE();
        value.contentKey = this.readStringVarInt();
        value.subPackName = this.readStringVarInt();
        value.contentIdentity = this.readStringVarInt();
        value.hadScripts = this.readBool();
        return value;
    }

    writeBehaviorPackInfo(value) {
        this.writeStringVarInt(value.uuid);
        this.writeStringVarInt(value.version);
        this.writeUnsignedLongLE(value.size);
        this.writeStringVarInt(value.contentKey);
        this.writeStringVarInt(value.subPackName);
        this.writeStringVarInt(value.contentIdentity);
        this.writeBool(value.hadScripts);
    }

    readTexturePackInfo() {
        let value = new TexturePackInfo();
        value.uuid = this.readStringVarInt();
        value.version = this.readStringVarInt();
        value.size = this.readUnsignedLongLE();
        value.contentKey = this.readStringVarInt();
        value.subPackName = this.readStringVarInt();
        value.contentIdentity = this.readStringVarInt();
        value.hadScripts = this.readBool();
        value.rtxEnabled = this.readBool();
        return value;
    }

    writeTexturePackInfo(value) {
        this.writeStringVarInt(value.uuid);
        this.writeStringVarInt(value.version);
        this.writeUnsignedLongLE(value.size);
        this.writeStringVarInt(value.contentKey);
        this.writeStringVarInt(value.subPackName);
        this.writeStringVarInt(value.contentIdentity);
        this.writeBool(value.hadScripts);
        this.writeBool(value.rtxEnabled);
    }

    readBehaviorPacksInfo() {
        let value = [];
        for (let i = 0; i < this.readShortLE(); ++i) {
            value.push(this.readBehaviorPackInfo());
        }
        return value;
    }

    writeBehaviorPacksInfo(value) {
        this.writeShortLE(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeBehaviorPackInfo(value[i]);
        }
    }

    readTexturePacksInfo() {
        let value = [];
        for (let i = 0; i < this.readShortLE(); ++i) {
            value.push(this.readTexturePackInfo());
        }
        return value;
    }

    writeTexturePacksInfo(value) {
        this.writeShortLE(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeTexturePackInfo(value[i]);
        }
    }

    readResourcePackIDVersion() {
        let value = new ResourcePackIDVersion();
        value.uuid = this.readStringVarInt();
        value.version = this.readStringVarInt();
        value.name = this.readStringVarInt();
        return value;
    }

    writeResourcePackIDVersion(value) {
        this.writeStringVarInt(value.uuid);
        this.writeStringVarInt(value.version);
        this.writeStringVarInt(value.name);
    }

    readResourcePacksIDVersion() {
        let value = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            value.push(this.readResourcePackIDVersion());
        }
        return value;
    }

    writeResourcePacksIDVersion(value) {
        this.writeVarInt(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeResourcePackIDVersion(value[i]);
        }
    }

    readExperiment() {
        let value = new Experiment();
        value.name = this.readStringVarInt();
        value.enabled = this.readBool();
        return value;
    }

    writeExperiment(value) {
        this.writeStringVarInt(value.name);
        this.writeBool(value.enabled);
    }

    readExperiments() {
        let value = [];
        for (let i = 0; i < this.readIntLE(); ++i) {
            value.push(this.readExperiment());
        }
        return value;
    }

    writeExperiments(value) {
        this.writeIntLE(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeExperiment(value[i]);
        }
    }

    readResourcePacksID() {
        let value = [];
        for (let i = 0; i < this.readShortLE(); ++i) {
            value.push(this.readStringVarInt());
        }
        return value;
    }

    writeResourcePacksID(value) {
        this.writeShortLE(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeStringVarInt(value[i]);
        }
    }

    readGameRule() {
        let value = new GameRule();
        value.name = this.readStringVarInt();
        value.editable = this.readBool();
        value.type = this.readVarInt();
        switch (value.type) {
            case GameRuleTypes.bool:
                value.value = this.readBool();
                break;
            case GameRuleTypes.int:
                value.value = this.readSignedVarInt();
                break;
            case GameRuleTypes.float:
                value.value = this.readFloatLE();
                break;
        }
        return value;
    }

    writeGameRule(value) {
        this.writeStringVarInt(value.name);
        this.writeBool(value.editable);
        this.writeVarInt(value.type);
        switch (value.type) {
            case GameRuleTypes.bool:
                this.writeBool(value.value);
                break;
            case GameRuleTypes.int:
                this.writeSignedVarInt(value.value);
                break;
            case GameRuleTypes.float:
                this.writeFloatLE(value.value);
                break;
        }
    }

    readGameRules() {
        let value = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            value.push(this.readGameRule());
        }
        return value;
    }

    writeGameRules(value) {
        this.writeVarInt(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeGameRule(value[i]);
        }
    }

    readEducationSharedResourceURI() {
        let value = new EducationSharedResourceURI();
        value.buttonName = this.readStringVarInt();
        value.linkURI = this.readStringVarInt();
        return value;
    }

    writeEducationSharedResourceURI(value) {
        this.writeStringVarInt(value.buttonName);
        this.writeStringVarInt(value.linkURI);
    }

    readBlockCoordinates() {
        let value = new BlockCoordinates();
        value.x = this.readSignedVarInt();
        value.y = this.readVarInt();
        value.z = this.readSignedVarInt();
        return value;
    }

    writeBlockCoordinates(value) {
        this.writeSignedVarInt(value.x);
        this.writeVarInt(value.y);
        this.writeSignedVarInt(value.z);
    }

    readEntityID() {
        return this.readSignedVarLong();
    }

    writeEntityID(value) {
        this.writeSignedVarLong(value);
    }

    readRuntimeEntityID() {
        return this.readVarLong();
    }

    writeRuntimeEntityID(value) {
        this.writeVarLong(value);
    }

    readGamemode() {
        return this.readSignedVarInt();
    }

    writeGamemode(value) {
        this.writeSignedVarInt(value);
    }

    readUUID() {
        let temp = this.read(16);
        let value = "";
        let conv;
        for (let i = 0; i < 16; ++i) {
            conv = temp[i].toString(16);
            if (conv.length === 1) {
                value += "0";
            }
            value += conv;
            if (i == 3 || i == 5 || i == 7 || i == 9) {
                value += "-";
            }
        }
        return value;
    }

    writeUUID(value) {
        this.writeUnsignedByte(parseInt(value.slice(0, 2), 16));
        this.writeUnsignedByte(parseInt(value.slice(2, 4), 16));
        this.writeUnsignedByte(parseInt(value.slice(4, 6), 16));
        this.writeUnsignedByte(parseInt(value.slice(6, 8), 16));
        this.writeUnsignedByte(parseInt(value.slice(9, 11), 16));
        this.writeUnsignedByte(parseInt(value.slice(11, 13), 16));
        this.writeUnsignedByte(parseInt(value.slice(14, 16), 16));
        this.writeUnsignedByte(parseInt(value.slice(16, 18), 16));
        this.writeUnsignedByte(parseInt(value.slice(19, 21), 16));
        this.writeUnsignedByte(parseInt(value.slice(21, 23), 16));
        this.writeUnsignedByte(parseInt(value.slice(24, 26), 16));
        this.writeUnsignedByte(parseInt(value.slice(26, 28), 16));
        this.writeUnsignedByte(parseInt(value.slice(28, 30), 16));
        this.writeUnsignedByte(parseInt(value.slice(30, 32), 16));
        this.writeUnsignedByte(parseInt(value.slice(32, 34), 16));
        this.writeUnsignedByte(parseInt(value.slice(34, 36), 16));
    }

    readVector3F() {
        let value = new Vector3F();
        value.x = this.readFloatLE();
        value.y = this.readFloatLE();
        value.z = this.readFloatLE();
        return value;
    }

    writeVector3F(value) {
        this.writeFloatLE(value.x);
        this.writeFloatLE(value.y);
        this.writeFloatLE(value.z);
    }

    readVector2F() {
        let value = new Vector2F();
        value.x = this.readFloatLE();
        value.z = this.readFloatLE();
        return value;
    }

    writeVector2F(value) {
        this.writeFloatLE(value.x);
        this.writeFloatLE(value.z);
    }

    readVector3I() {
        let value = new Vector3I();
        value.x = this.readSignedVarInt();
        value.y = this.readSignedVarInt();
        value.z = this.readSignedVarInt();
        return value;
    }

    writeVector3I(value) {
        this.writeSignedVarInt(value.x);
        this.writeSignedVarInt(value.y);
        this.writeSignedVarInt(value.z);
    }

    readVector3U() {
        let value = new Vector3U();
        value.x = this.readVarInt();
        value.y = this.readVarInt();
        value.z = this.readVarInt();
        return value;
    }

    writeVector3U(value) {
        this.writeVarInt(value.x);
        this.writeVarInt(value.y);
        this.writeVarInt(value.z);
    }

    readItemState() {
        let value = new ItemState();
        value.itemName = this.readStringVarInt();
        value.runtimeID = this.readShortLE();
        value.componentBased = this.readBool();
        return value;
    }

    writeItemState(value) {
        this.writeStringVarInt(value.itemName);
        this.writeShortLE(value.runtimeID);
        this.writeBool(value.componentBased);
    }

    readItemStates() {
        let value = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            value.push(this.readItemState());
        }
        return value;
    }

    writeItemStates(value) {
        this.writeVarInt(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeItemState(value[i]);
        }
    }

    readNBT() {
        let stream = new NBTNetworkBinaryStream(this.buffer, this.offset);
        let tag = stream.readRootTag();
        this.offset = stream.offset;
        return tag;
    }

    writeNBT(value) {
        let stream = new NBTNetworkBinaryStream();
        stream.writeRootTag(value);
        this.write(stream.buffer);
    }

    readNBTLE() {
        let stream = new NBTLEBinaryStream(this.buffer, this.offset);
        let tag = stream.readRootTag();
        this.offset = stream.offset;
        return tag;
    }

    writeNBTLE(value) {
        let stream = new NBTLEBinaryStream(this.buffer, this.offset);
        stream.writeRootTag(value);
        this.write(stream.buffer);
    }

    readBlockProperty() {
        let value = new BlockProperty();
        value.name = this.readStringVarInt();
        value.nbt = this.readNBT();
        return value;
    }

    writeBlockProperty(value) {
        this.writeStringVarInt(value.name);
        this.writeNBT(value.nbt);
    }

    readBlockProperties() {
        let value = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            value.push(this.readBlockProperty());
        }
        return value;
    }

    writeBlockProperties(value) {
        this.writeVarInt(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeBlockProperty(value[i]);
        }
    }

    readItemExtraData(withBlockingTick) {
        let value = new ItemExtraData();
        let hasNBT = this.readUnsignedShortLE();
        if (hasNBT == 0xffff) {
            value.hasNBT = true;
            value.nbtVersion = this.readUnsignedByte();
            value.nbt = this.readNBTLE();
        } else if (hasNBT == 0x0000) {
            value.hasNBT = false;
        }
        value.canPlaceOn = [];
        let canPlaceOnLength = this.readIntLE();
        for (let i = 0; i < canPlaceOnLength; ++i) {
            value.canPlaceOn.push(this.readByteArrayShortLE());
        }
        value.canDestroy = [];
        let canDestroyLength = this.readIntLE();
        for (let i = 0; i < canDestroyLength; ++i) {
            value.canDestroy.push(this.readByteArrayShortLE());
        }
        if (withBlockingTick === true) {
            value.blockingTick = this.readLongLE();
        }
        return value;
    }

    writeItemExtraData(value, withBlockingTick) {
        this.writeUnsignedShortLE(value.hasNBT === true ? 0xffff : 0x0000);
        if (value.hasNBT === true) {
            this.writeUnsignedByte(value.nbtVersion);
            this.writeNBTLE(value.nbt);
        }
        this.writeIntLE(value.canPlaceOn.length);
        for (let i = 0; i < value.canPlaceOn.length; ++i) {
            this.writeByteArrayShortLE(value.canPlaceOn[i]);
        }
        this.writeIntLE(value.canDestroy.length);
        for (let i = 0; i < value.canDestroy.length; ++i) {
            this.writeByteArrayShortLE(value.canDestroy[i]);
        }
        if (withBlockingTick === true) {
            this.writeLongLE(value.blockingTick);
        }
    }

    readItem(withStackID) {
        let value = new Item();
        value.networkID = this.readSignedVarInt();
        if (value.networkID !== 0) {
            value.count = this.readUnsignedShortLE();
            value.metadata = this.readVarInt();
            if (withStackID === true) {
                value.hasStackID = this.readBool();
                if (value.hasStackID === true) {
                    value.stackID = this.readSignedVarInt();
                }
            }
            value.blockRuntimeID = this.readSignedVarInt();
            let stream = new MinecraftBinaryStream(this.readByteArrayVarInt());
            value.extra = stream.readItemExtraData(value.networkID === 355 ? true : false);
        }
    }

    writeItem(value, withStackID) {
        this.writeSignedVarInt(value.networkID);
        if (value.networkID !== 0) {
            this.writeUnsignedShortLE(value.count);
            this.writeVarInt(value.metadata);
            if (withStackID === true) {
                this.writeBool(value.hasStackID);
                if (value.hasStackID === true) {
                    this.writeSignedVarInt(value.stackID);
                }
            }
            this.writeSignedVarInt(value.blockRuntimeID);
            let stream = new MinecraftBinaryStream();
            stream.writeItemExtraData(value.extra, value.networkID === 355 ? true : false);
            this.writeByteArrayVarInt(stream.buffer);
        }
    }

    writeBlockStorage(value) {
        let bitsPerBlock = Math.ceil(Math.log2(value.palette.length));
        let version;
        switch (bitsPerBlock) {
            case 0:
            case 1:
                version = BitArray.v1;
                break;
            case 2:
                version = BitArray.v2;
                break;
            case 3:
                version = BitArray.v3;
                break;
            case 4:
                version = BitArray.v4;
                break;
            case 5:
                version = BitArray.v5;
                break;
            case 6:
                version = BitArray.v6;
                break;
            case 7:
            case 8:
                version = BitArray.v8;
                break;
            default:
                if (bitsPerBlock > 8) {
                    version = BitArray.v16;
                }
                break;
        }
        this.writeUnsignedByte(version.header);
        let position = 0;
        for (let i = 0; i < version.wordsPerChunk; ++i) {
            let word = 0;
            for (let j = 0; j < version.blocksPerWord; ++j) {
                let state = value.blocks[position++];
                word |= state << (version.bitsPerBlock * j);
            }
            this.writeIntLE(word);
        }
        this.writeSignedVarInt(value.palette.length);
        for (let i = 0; i < value.palette.length; ++i) {
            this.writeSignedVarInt(value.palette[i]);
        }
    }

    writeSubChunk(value) {
        this.writeUnsignedByte(8);
        this.writeUnsignedByte(value.blockStorages.length);
        for (let i = 0; i < value.blockStorages.length; ++i) {
            this.writeBlockStorage(value.blockStorages[i]);
        }
    }

    writeChunk(value, count, runtimeID) {
        let emptySubChunk = new MinecraftBinaryStream();
        emptySubChunk.writeSubChunk(new SubChunk(runtimeID));
        for (let i = 0; i < count; ++i) {
            if (value.subChunks.has(i)) {
                this.writeSubChunk(value.subChunks.get(i));
            } else {
                this.write(emptySubChunk.buffer);
            }
        }
        for (let i = 0; i < value.biomes.length; ++i) {
            this.writeBlockStorage(value.biomes[i]);
        }
        this.writeUnsignedByte(0);
    }

    readMetadataList() {
        let value = {};
        let metadataListSize = this.readVarInt();
        for (let i = 0; i < metadataListSize; ++i) {
            let metadataKey = this.readVarInt();
            let entry = new MetadataEntry();
            entry.type = this.readVarInt();
            if (entry.type == MetadataPropertyTypes.byte) {
                entry.value = this.readByte();
            } else if (entry.type == MetadataPropertyTypes.short) {
                entry.value = this.readShortLE();
            } else if (entry.type == MetadataPropertyTypes.int) {
                entry.value = this.readSignedVarInt();
            } else if (entry.type == MetadataPropertyTypes.float) {
                entry.value = this.readFloatLE();
            } else if (entry.type == MetadataPropertyTypes.str) {
                entry.value = this.readStringVarInt();
            } else if (entry.type == MetadataPropertyTypes.nbt) {
                entry.value = this.readNBTLE();
            } else if (entry.type == MetadataPropertyTypes.vec3i) {
                entry.value = this.readVector3I();
            } else if (entry.type == MetadataPropertyTypes.long) {
                entry.value = this.readSignedVarLong();
            } else if (entry.type == MetadataPropertyTypes.vec3f) {
                entry.value = this.readVector3F();
            } else {
                throw new Error("Invalid type");
            }
            value[metadataKey] = entry;
        }
        return value;
    }

    writeMetadataList(value) {
        this.writeVarInt(Object.values(value).length);
        for (const [metadataKey, entry] of Object.entries(value)) {
            this.writeVarInt(metadataKey);
            this.writeVarInt(entry.type);
            if (entry.type == MetadataPropertyTypes.byte) {
                this.writeByte(entry.value);
            } else if (entry.type == MetadataPropertyTypes.short) {
                this.writeShortLE(entry.value);
            } else if (entry.type == MetadataPropertyTypes.int) {
                this.writeSignedVarInt(entry.value);
            } else if (entry.type == MetadataPropertyTypes.float) {
                this.writeFloatLE(entry.value);
            } else if (entry.type == MetadataPropertyTypes.str) {
                this.writeStringVarInt(entry.value);
            } else if (entry.type == MetadataPropertyTypes.nbt) {
                this.writeNBTLE(entry.value);
            } else if (entry.type == MetadataPropertyTypes.vec3i) {
                this.writeVector3I(entry.value);
            } else if (entry.type == MetadataPropertyTypes.long) {
                this.writeSignedVarLong(entry.value);
            } else if (entry.type == MetadataPropertyTypes.vec3f) {
                this.writeVector3F(entry.value);
            } else {
                throw new Error("Invalid type");
            }
        }
    }

    readEntityLink() {
        let value = new EntityLink();
        value.riddenRuntimeEntityID = this.readRuntimeEntityID();
        value.riderRuntimeEntityID = this.readRuntimeEntityID();
        value.type = this.readUnsignedByte();
        value.immediate = this.readBool();
        value.byRider = this.readBool();
        return value;
    }

    writeEntityLink(value) {
        this.writeRuntimeEntityID(value.riddenRuntimeEntityID);
        this.writeRuntimeEntityID(value.riderRuntimeEntityID);
        this.writeUnsignedByte(value.type);
        this.writeBool(value.immediate);
        this.writeBool(value.byRider);
    }

    readEntityLinks() {
        let links = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            links.push(this.readEntityLink());
        }
        return links;
    }

    writeEntityLinks(value) {
        this.writeVarInt(value.length);
        for (let i = 0; i < value.length; ++i) {
            this.writeEntityLink(value[i]);
        }
    }

    readCommandOrigin() {
        let value = new CommandOriginData();
        value.typeID = this.readVarInt();
        value.uuid = this.readUUID();
        value.requestID = this.readStringVarInt();
        if (value.typeID === CommandOriginDataTypes.devConsole || value.typeID === CommandOriginDataTypes.test) {
            value.entityID = this.readEntityID();
        }
        return value;
    }

    writeCommandOrigin(value) {
        this.writeVarInt(value.typeID);
        this.writeUUID(value.uuid);
        this.writeStringVarInt(value.requestID);
        if (value.typeID === CommandOriginDataTypes.devConsole || value.typeID === CommandOriginDataTypes.test) {
            this.writeEntityID(value.entityID);
        }
    }

    readCommandEnum(enumValues) {
        let value = new CommandEnum();
        value.name = this.readVarInt();
        value.values = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            if (enumValues.length < 255) {
                value.values.push(this.readUnsignedByte());
            } else if (enumValues.length < 65536) {
                value.values.push(this.readUnsignedShortLE());
            } else {
                value.values.push(this.readUnsignedIntLE());
            }
        }
        value.isDynamic = false;
        return value;
    }

    writeCommandEnum(value, enumValues) {
        this.writeStringVarInt(value.name);
        this.writeVarInt(value.values.length);
        for (let i = 0; i < value.values.length; ++i) {
            if (enumValues.length < 255) {
                this.writeUnsignedByte(value.values[i]);
            } else if (enumValues.length < 65536) {
                this.writeUnsigendShortLE(value.values[i]);
            } else {
                this.writeUnsignedIntLE(value.values[i]);
            }
        }
    }

    readCommandData(enums, suffixes) {
        let value = new CommandData();
        value.name = this.readStringVarInt();
        value.description = this.readStringVarInt();
        value.flags = this.readUnsignedShortLE();
        value.permissionLevel = this.readUnsignedByte();
        value.aliases = [];
        value.overloads = [];

        for (let i = 0; i < this.readVarInt(); ++i) {
            let overload = {};
            overload[i] = [];
            for (let i2 = 0; i2 < this.readVarInt(); ++i2) {
                let cmdParam = new CommandParam();
                cmdParam.name = this.readStringVarInt();
                cmdParam.typeID = this.readIntLE();
                if (cmdParam.typeID & (CommandArgumentFlags.enum !== 0)) {
                    let len = cmdParam.typeID & 65535;
                    if (len > enums.length - 1) {
                        throw new Error("Enum limition reached max. (MCBS)");
                    }
                    cmdParam.typeID = enums[len];
                } else if (cmdParam.typeID & (CommandArgumentFlags.suffix !== 0)) {
                    let len = cmdParam.typeID & 65535;
                    if (len > suffixes.length - 1) {
                        throw new Error("Suffix limition reached max. (MCBS)");
                    }
                    cmdParam.suffixes = suffixes[len];
                }
                cmdParam.optional = this.readBool();
                cmdParam.options = this.readUnsignedByte();
                overload[i] = [[cmdParam]]; // if this is wrong fix it
            }
            value.overloads.push([overload]);
        }
    }

    writeCommandData(value, enums, dynamicEnums, suffixes) {
        this.writeStringVarInt(value.name);
        this.writeStringVarInt(value.description);
        this.writeUnsignedShortLE(value.flags);
        this.writeUnsignedByte(value.permissionLevel);
        this.writeIntBE(-1); // aliases
        this.writeVarInt(value.overloads.length);

        for (const [overload] of value.overloads) {
            this.writeVarInt(overload.length);
            overload.forEach((overloadVal) => {
                this.writeStringVarInt(overloadVal.name);
                let typeID = overloadVal.typeID;
                enums.forEach((val) => {
                    if (val.isDynamic) {
                        typeID = CommandArgumentFlags.softEnum | CommandArgumentFlags.valid | dynamicEnums[overloadVal.typeID];
                    } else if (enums.length != 0 && !val.isDynamic) {
                        typeID = CommandArgumentFlags.enum | CommandArgumentFlags.valid | enums[overloadVal.typeID];
                    } else if (overloadVal.suffixes.length != 0) {
                        typeID = CommandArgumentFlags.suffix | CommandArgumentFlags.valid | suffixes[overloadVal.suffix];
                    }
                });
                this.writeIntLE(typeID);
                this.writeBool(overloadVal.optional);
                this.writeUnsignedByte(overloadVal.options);
            });
        }
    }

    readDynamicCommandEnum() {
        let value = new CommandEnum();
        value.name = this.readStringVarInt();
        value.values = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            value.values.push(this.readStringVarInt());
        }
        value.isDynamic = true;
        return value;
    }

    writeDynamicCommandEnum(value) {
        this.writeStringVarInt(value.name);
        this.writeVarInt(value.values.length);
        for (const [value] of value.values) {
            this.writeStringVarInt(value);
        }
    }

    readCommandEnumConstraint() {
        let value = new CommandEnumConstraint();
        value.value = this.readIntLE();
        value.enumIndex = this.readIntLE();
        value.constraints = [];
        for (let i = 0; i < this.readVarInt(); ++i) {
            value.constraints.push(this.readUnsignedByte());
        }
        return value;
    }

    writeCommandEnumConstraint(value) {
        this.writeIntLE(value.value);
        this.writeIntLE(value.enumIndex);
        this.writeVarInt(value.constraints.length);
        for (const [value] of value.constraints) {
            this.writeUnsignedByte(value);
        }
    }

    readEntityProperties() {
        let value = new EntityProperty();
        value.intProperties = this.readIntEntityProperties();
        value.floatProperties = this.readFloatEntityProperties();
        return value;
    }

    writeEntityProperties(value) {
        this.writeIntEntityProperties(value.intProperties);
        this.writeFloatEntityProperties(value.floatProperties);
    }

    readIntEntityProperties() {
        let value = {};
        for (let i = 0; i < this.readVarInt(); ++i) {
            value[this.readVarInt()] = this.readSignedVarInt();
        }
        return value;
    }

    writeIntEntityProperties(value) {
        this.writeVarInt(value.length);
        Object.entries(value).forEach((index, val) => {
            this.writeVarInt(value[index]);
            this.writeSignedVarInt(value[val]);
        });
        return value;
    }

    readFloatEntityProperties() {
        let value = {};
        for (let i = 0; i < this.readVarInt(); ++i) {
            value[this.readVarInt()] = this.readFloatLE();
        }
        return value;
    }

    writeFloatEntityProperties(value) {
        this.writeVarInt(value.length);
        Object.entries(value).forEach((index, val) => {
            this.writeVarInt(value[index]);
            this.writeFloatLE(value[val]);
        });
        return value;
    }

    readPlayerAttributeModifier() {
        let modifier = new PlayerAttributeModifier();
        modifier.id = this.readStringVarInt();
        modifier.name = this.readStringVarInt();
        modifier.amount = this.readFloatLE();
        modifier.operation = this.readIntLE();
        modifier.operand = this.readIntLE();
        modifier.serializable = this.readBool();
        return modifier;
    }

    writePlayerAttributeModifier(modifier) {
        this.writeStringVarInt(modifier.id);
        this.writeStringVarInt(modifier.name);
        this.writeFloatLE(modifier.amount);
        this.writeIntLE(modifier.operation);
        this.writeIntLE(modifier.operand);
        this.writeBool(modifier.serializable);
    }

    readPlayerAttribute() {
        let attribute = new PlayerAttribute();
        attribute.min = this.readFloatLE();
        attribute.max = this.readFloatLE();
        attribute.current = this.readFloatLE();
        attribute.default = this.readFloatLE();
        attribute.name = this.readStringVarInt();
        let modifiersCount = this.readVarInt();
        for (let i = 0; i < modifiersCount; ++i) {
            attribute.modifiers.push(this.readPlayerAttributeModifier());
        }
        return attribute;
    }

    writePlayerAttribute(attribute) {
        this.writeFloatLE(attribute.min);
        this.writeFloatLE(attribute.max);
        this.writeFloatLE(attribute.current);
        this.writeFloatLE(attribute.default);
        this.writeStringVarInt(attribute.name);
        this.writeVarInt(attribute.modifiers.length);
        attribute.modifiers.forEach((value) => {
            this.writePlayerAttributeModifier(value);
        });
    }

    readPlayerAttributes() {
        let attributes = [];
        let attributesCount = this.readVarInt();
        for (let i = 0; i < attributesCount; ++i) {
            attributes.push(this.readPlayerAttribute());
        }
        return attributes;
    }

    writePlayerAttributes(attributes) {
        this.writeVarInt(attributes.length);
        attributes.forEach((value) => {
            this.writePlayerAttribute(value);
        });
    }
}

module.exports = MinecraftBinaryStream;
