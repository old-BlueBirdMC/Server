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

const Block = require("../Block");
const Tool = require("../Tool");

class Dirt extends Block {
    maxStack = 64;
    tool = Tool.shovel;
    blastResistance = 0.5;
    hardness = 0.5;
    isLuminant = false;
    isTransparrent = false;
    isFlammable = false;
    catchesFireFromLava = false;

    constructor() {
        super("minecraft:dirt", 0);
    }
}

module.exports = Dirt;
