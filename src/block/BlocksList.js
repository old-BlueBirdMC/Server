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

const Air = require("./default/Air");
const Andesite = require("./default/Andesite");
const Bedrock = require("./default/Bedrock");
const BirchPlanks = require("./default/BirchPlanks");
const DarkOakPlanks = require("./default/DarkOakPlanks");
const Diorite = require("./default/Diorite");
const Dirt = require("./default/Dirt");
const Granite = require("./default/Granite");
const Grass = require("./default/Grass");
const JunglePlanks = require("./default/JunglePlanks");
const OakPlanks = require("./default/OakPlanks");
const PolishedAndesite = require("./default/PolishedAndesite");
const PolishedDiorite = require("./default/PolishedDiorite");
const PolishedGranite = require("./default/PolishedGranite");
const SprucePlanks = require("./default/SprucePlanks");
const Stone = require("./default/Stone");
const CrimsonPlanks = require("./default/CrimsonPlanks");
const WarpedPlanks = require("./default/WarpedPlanks");

class BlocksList {
	static #list = {};

	static refresh() {
		this.add(new Air());
		this.add(new Stone());
		this.add(new Dirt());
		this.add(new Grass());
		this.add(new Bedrock());
		this.add(new Granite());
		this.add(new PolishedGranite());
		this.add(new Diorite());
		this.add(new PolishedDiorite());
		this.add(new Andesite());
		this.add(new PolishedAndesite());
		this.add(new OakPlanks());
		this.add(new SprucePlanks());
		this.add(new BirchPlanks());
		this.add(new JunglePlanks());
		this.add(new DarkOakPlanks());
		this.add(new CrimsonPlanks());
		this.add(new WarpedPlanks());
	}

	static add(block) {
		let blockAndMetadata = block.blockName + ">" + block.metadata;
		if (!(blockAndMetadata in this.#list)) {
			this.#list[blockAndMetadata] = block;
		}
	}

	static remove(block) {
		let blockAndMetadata = block.blockName + ">" + block.metadata;
		if (blockAndMetadata in this.#list) {
			delete this.#list[blockAndMetadata];
		}
	}

	static get(blockName, metadata = 0) {
		let blockAndMetadata = blockName + ">" + metadata;
		if (!(blockAndMetadata in this.#list)) {
			throw new Error("Trying to get unregistered block");
		}
		return this.#list[blockAndMetadata]
	}
}

module.exports = BlocksList;