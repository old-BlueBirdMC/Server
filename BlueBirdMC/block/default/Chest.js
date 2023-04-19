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

const WindowIDS = require("../../network/constants/WindowIDS");
const WindowTypes = require("../../network/constants/WindowTypes");
const ContainerClosePacket = require("../../network/packets/ContainerClosePacket");
const ContainerOpenPacket = require("../../network/packets/ContainerOpenPacket");
const Block = require("../Block");
const Tool = require("../Tool");

class Chest extends Block {
    maxStack = 64;
    tool = Tool.axe;
    blastResistance = 2.5;
    hardness = 2.5;
    isLuminant = false;
    isTransparrent = false;
    isFlammable = true;
    catchesFireFromLava = true;
    openers = {};

    constructor() {
        super("minecraft:chest", 0);
    }

    interact(source, position, blockFace) {
        if (!this.isOpened(source.id)) {
            this.open(position, source);
        } else {
            this.close(source);
        }
    }

    isOpened(sourceRuntimeID) {
        if (sourceRuntimeID in this.openers) {
            return true;
        }
        return false;
    }

    open(position, source) {
        const containerOpen = new ContainerOpenPacket();
        containerOpen.windowID = WindowIDS.inventory; //chest... same as inventory
        containerOpen.type = WindowTypes.container;
        containerOpen.coordinates = position;
        containerOpen.runtimeEntityID = source.id;
        containerOpen.sendTo(source);
    }

    close(source) {
        const containerClose = new ContainerClosePacket();
        containerClose.windowID = WindowIDS.inventory;
        containerClose.server = false;
        containerClose.sendTo(source);
    }
}

module.exports = Chest;
