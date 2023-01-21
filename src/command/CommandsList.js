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

const fs = require("fs");
const ConsoleColors = require("../color/ConsoleColors");
const MinecraftTextColors = require("../color/MinecraftTextColors");
const ConsoleCommandSender = require("../console/ConsoleCommandSender");
const Player = require("../player/Player");
const Command = require("./Command");
const HelpCMD = require("./default/HelpCMD");
const StopCMD = require("./default/StopCMD");
const CommandSender = require("./sender/CommandSender");

class CommandsList {
	#commands = {};
	#alias = {};

	refresh() {
		fs.readdirSync(__dirname + '/default').forEach((file) => {
			const command = require(__dirname + '/default/' + file);
			this.add(new command());
		});
	}
	
	add(command) {
		if (!(command.name in this.#commands)) {
			if (command instanceof Command){
				this.#commands[command.name] = command;
				command.getAliases().forEach(alias => {
					if(alias.length < 0) return;
					this.#alias[alias + "CcmdAlias"] = command;
				});
			}
		}
	}
	
	remove(commandName) {
		if (commandName in this.#commands) {
			delete this.#commands[commandName];
		} else if (commandName in this.#alias) {
			delete this.#alias[commandName + "CcmdAlias"];
		}
	}

	has(commandName) {
		if (commandName in this.#commands) {
			return true;
		} else if (commandName + "CcmdAlias" in this.#alias) {
			return true;
		}
		return false;
	}

	get(commandName) {
		if (commandName in this.#commands) {
			return this.#commands[commandName];
		} else if (commandName + "CcmdAlias" in this.#alias) {
			return this.#alias[commandName + "CcmdAlias"];
		}
	}

	async dispatch(sender, commandName) {
		if (commandName === "") {
			return;
		}
		let args = commandName.split(" ");
		commandName = args.shift();

		if (this.has(commandName)) {
			let command = this.get(commandName);
			if (sender instanceof Player || sender instanceof CommandSender) {
				await command.run(sender, commandName, args);
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

module.exports = CommandsList;
