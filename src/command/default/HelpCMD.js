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

export default class HelpCMD extends Command {
    constructor() {
        let cmdParam = new CommandParam();
        cmdParam.name = "page";
        cmdParam.optional = true;
        cmdParam.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.int;
        cmdParam.options = 0;
        cmdParam.suffixes = [];
        let cmdParam2 = new CommandParam();
        cmdParam2.name = "command";
        cmdParam2.optional = true;
        cmdParam2.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.str;
        cmdParam2.options = 0;
        cmdParam2.suffixes = [];
        super("help", "Shows the help menu or for a certain command.", ["?"], [cmdParam, cmdParam2]);
    }

    async run(sender, writtenCommand, args) {
        let command = "";
        let page = -1;

        if (args.length === 0) {
        } else if (!isNaN(args[args.length - 1])) {
            page = parseInt(args.pop());
            if (page <= 0) page = 1;
            command = args.join(" ");
        } else {
            command = args.join(" ");
            page = 1;
        }

        if (command === "") {
            let commands = {};

            for (const [, command] of Object.entries(sender.server.commandsList.getAllCommands())) {
                command.overloads.forEach((overload) => {
                    command.aliases.forEach((prefix) => {
                        commands[prefix] = {
                            name: prefix,
                            description: command.description,
                        };
                    });
                    commands[command.name] = command;
                });
            }

            let sortedCommands = [];

            Object.keys(commands)
                .sort()
                .forEach((command) => {
                    sortedCommands.push(commands[command]);
                    delete commands[command];
                });

            page = Math.min(sortedCommands.length, page);

            if (page < 1) page = 1;

            sender.message("----- Help (" + page + " of " + Math.ceil(sortedCommands.length / 4) + ") -----");
            sortedCommands.slice(page * 4 - 4, page * 4).forEach((command) => {
                sender.message("/" + command.name + ": " + command.description);
            });
        } else {
            if (sender.server.commandsList.get(command.toLowerCase())) {
                let cmd = sender.server.commandsList.get(command.toLowerCase());
                sender.message("----- Help: /" + cmd.name + " -----");
                sender.message("Description: " + cmd.description);
            } else {
                sender.message("No help for /" + command.toLowerCase());
            }
        }
    }
}
