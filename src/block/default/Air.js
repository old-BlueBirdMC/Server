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

import Block from "../Block.js";
import Tool from "../Tool.js";

export default class Air extends Block {
    maxStack = 64;
    tool = Tool.none;
    blastResistance = 0;
    hardness = 0;
    isLuminant = false;
    isTransparrent = true;
    isFlammable = false;
    catchesFireFromLava = false;

    constructor() {
        super("minecraft:air", 1);
    }
}
