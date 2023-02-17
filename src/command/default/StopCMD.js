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

import CommandArgumentFlags from "../../network/minecraft/constants/CommandArgumentFlags.js";
import CommandArgumentTypes from "../../network/minecraft/constants/CommandArgumentTypes.js";
import CommandParam from "../../network/minecraft/types/CommandParam.js";
import Command from "../Command.js";

export default class StopCMD extends Command {
    constructor() {
        let cmdParam = new CommandParam();
        cmdParam.name = "reason";
        cmdParam.optional = true;
        cmdParam.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.rawText;
        cmdParam.options = 0;
        cmdParam.suffixes = [];
        super("stop", "stop command", [], [cmdParam]);
    }

    async run(sender, writtenCommand, args) {
        sender.message("Stopping server...");
        if (typeof args[0] !== "undefined") {
            sender.server.shutdown(args[0]);
        } else {
            sender.server.shutdown();
        }
    }
}
