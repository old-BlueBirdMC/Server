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

const Block = require("../Block");
const Tool = require("../Tool");

class AcaciaPlanks extends Block {
	maxStack = 64;
	tool = Tool.axe;
	blastResistance = 3;
	hardness = 2;
	isLuminant = false;
	isTransparrent = false;
	isFlammable = true;
	catchesFireFromLava = true;

	constructor() {
		super("minecraft:planks", 4);
	}
}

module.exports = AcaciaPlanks;