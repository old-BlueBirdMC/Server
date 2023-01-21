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

const EntityMetadataManager = require("../managers/EntityMetadataManager");

class Entity {
	id = 0;
	metadataManager;
	scaleValue = 1.0;
	onFire = false;
	fireImmune = false;
	noAI = true;
	canClimb = true;
	canDash = true;
	canFly = false;
	canPowerJump = true;
	swmming = false;
	metadataToSend = [];

	constructor() {
		this.id++;
		this.metadataManager = new EntityMetadataManager();
	}
}

module.exports = Entity;
