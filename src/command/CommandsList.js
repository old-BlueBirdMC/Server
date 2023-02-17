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

import * as fs from "fs";
import * as path from "path";
import ConsoleColors from "../color/ConsoleColors.js";
import MinecraftTextColors from "../color/MinecraftTextColors.js";
import ConsoleCommandSender from "../console/ConsoleCommandSender.js";
import Player from "../player/Player.js";
import Command from "./Command.js";
import * as MCommandsList from "./CommandsList.mjs";
import CommandSender from "./sender/CommandSender.js";

export default class CommandsList {
    #commands = {};
    #alias = {};

    refresh() {
        // const commandsListPath = `${__dirname(import.meta.url)}${path.sep}default`;
        // const commandsList = fs.readdirSync(commandsListPath);
        // commandsList.forEach((filesName) => {
        //     const req = import(path.join(`${commandsListPath}${path.sep}`, filesName.replace(".js", "")));
        //     this.add(new req());
        // });
        Object.values(MCommandsList).forEach((classes) => {
            this.add(new classes());
        });
    }

    add(command) {
        if (!(command.name in this.#commands)) {
            if (command instanceof Command) {
                this.#commands[command.name] = command;
                command.getAliases().forEach((alias) => {
                    if (alias.length < 0) return;
                    this.#alias[alias + "CmdAlias"] = command;
                });
            }
        }
    }

    remove(commandName) {
        if (commandName in this.#commands) {
            delete this.#commands[commandName];
        } else if (commandName in this.#alias) {
            delete this.#alias[commandName + "CmdAlias"];
        }
    }

    has(commandName) {
        if (commandName in this.#commands) {
            return true;
        } else if (commandName + "CmdAlias" in this.#alias) {
            return true;
        }
        return false;
    }

    get(commandName) {
        if (commandName in this.#commands) {
            return this.#commands[commandName];
        } else if (commandName + "CmdAlias" in this.#alias) {
            return this.#alias[commandName + "CmdAlias"];
        }
    }

    dispatch(sender, commandName) {
        if (commandName === "") return;
        let args = commandName.split(" ");
        commandName = args.shift();

        if (this.has(commandName)) {
            let command = this.get(commandName);
            if (sender instanceof Player || sender instanceof CommandSender) {
                command.run(sender, commandName, args);
            }
        } else {
            if (sender instanceof ConsoleCommandSender && commandName.trim() === "") {
                return;
            }
            if (sender instanceof ConsoleCommandSender) {
                sender.message(ConsoleColors.red + "type help to get the commands list");
            } else if (sender instanceof Player) {
                sender.message(MinecraftTextColors.red + "type /help to get the commands list");
            }
        }
    }

    getAllCommands() {
        return this.#commands;
    }

    getAllAliases() {
        return this.#alias;
    }
}
