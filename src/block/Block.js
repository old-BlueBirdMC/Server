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

class Block {
	blockName;
	metadata;
	maxStack;
	tool;
	blastResistance;
	hardness;
	isLuminant;
	isTransparrent;
	isFlammable;
	catchesFireFromLava;

	constructor(blockName, metadata = 0) {
		this.blockName = blockName;
		this.metadata = metadata;
	}

	toRuntimeID(resourceManager) {
		return resourceManager.blockStatesMap.legacyToRuntime(this.blockName, this.metadata);
	}
}

module.exports = Block;