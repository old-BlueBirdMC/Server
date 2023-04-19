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

const { NBTNetworkBinaryStream, NBTLEBinaryStream } = require("bbmc-nbt");
const fs = require("fs");
const path = require("path");
const BlockStatesMap = require("../misc/BlockStatesMap");
const Logger = require("../console/Logger");
const ItemStatesMap = require("../misc/ItemStatesMap");
const Item = require("../network/types/Item");
const ItemExtraData = require("../network/types/ItemExtraData");

class ResourceManager {
    log;
    itemStatesMap;
    blockStatesMap;
    biomeDefinitionList;
    availableEntityIdentifiers;
    creativeItems;

    readFile(name) {
        return fs.readFileSync(path.join(__dirname, `..${path.sep}mc_data${path.sep}${name}`));
    }

    readBiomeDefinitionList() {
        let stream = new NBTNetworkBinaryStream(this.readFile("biome_definition_list.nbt"));
        this.biomeDefinitionList = stream.readRootTag();
        this.log.info("Loaded biome_definition_list.nbt");
    }

    readAvailableEntityIdentifiers() {
        let stream = new NBTNetworkBinaryStream(this.readFile("available_entity_identifiers.nbt"));
        this.availableEntityIdentifiers = stream.readRootTag();
        this.log.info("Loaded available_entity_dentifiers.nbt");
    }

    readBlockStates() {
        let stream = new NBTNetworkBinaryStream(this.readFile("block_states.nbt"));
        this.blockStatesMap = new BlockStatesMap(stream.readCompoundTag());
        this.log.info("Loaded block_states.nbt");
    }

    readItemStates() {
        this.itemStatesMap = new ItemStatesMap(JSON.parse(this.readFile("item_states.json")));
        this.log.info("Loaded items_states.json");
    }

    readCreativeItems() {
        this.creativeItems = {};
        let creativeItems = JSON.parse(this.readFile("creative_items.json"));
        let entryID = 1;
        creativeItems.forEach((entry) => {
            let item = new Item();
            item.networkID = this.itemStatesMap.nameToRuntime(entry["name"]);
            item.count = 1;
            item.metadata = "metadata" in entry ? entry["metadata"] : 0;
            item.blockRuntimeID = "block_state_name" in entry ? this.blockStatesMap.legacyToRuntime(entry["block_state_name"], entry["block_state_metadata"]) : 0;
            item.extra = new ItemExtraData();
            if ("nbt_b64" in entry) {
                item.extra.hasNBT = true;
                item.extra.nbtVersion = 1;
                let stream = new NBTLEBinaryStream(Buffer.from(entry["nbt_b64"], "base64"));
                item.extra.nbt = stream.readRootTag();
            } else {
                item.extra.hasNBT = false;
            }
            item.extra.canPlaceOn = [];
            item.extra.canDestroy = [];
            item.extra.blockingTick = 0n;
            this.creativeItems[entryID] = item;
            ++entryID;
        });
        this.log.info("Loaded creative_items.json");
    }

    constructor() {
        this.log = new Logger({
            Name: "ResourceManager",
            AllowDebugging: false,
            WithColors: true,
        });
        this.log.info("Loading resources");
        this.readBiomeDefinitionList();
        this.readAvailableEntityIdentifiers();
        this.readBlockStates();
        this.readItemStates();
        this.readCreativeItems();
        this.log.info("Resources Loaded");
    }
}

module.exports = ResourceManager;
