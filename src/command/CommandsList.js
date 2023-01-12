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

const ConsoleColors = require("../color/ConsoleColors");
const MinecraftTextColors = require("../color/MinecraftTextColors");
const ConsoleCommandSender = require("../console/ConsoleCommandSender");
const Player = require("../player/Player");
const HelpCMD = require("./default/HelpCMD");
const StopCMD = require("./default/StopCMD");
const CommandSender = require("./sender/CommandSender");

class CommandsList {
	#commands = {};

	refresh() {
		this.add(new HelpCMD("?"));
		this.add(new HelpCMD("help"));
		this.add(new StopCMD());
	}
	
	add(command) {
		if (!(command.name in this.#commands)) {
			this.#commands[command.name] = command;
		}
	}
	
	remove(commandName) {
		if (!(commandName in this.#commands)) {
			delete this.#commands[commandName];
		}
	}

	has(commandName) {
		if (commandName in this.#commands) {
			return true;
		}
		return false;
	}

	get(commandName) {
		if (commandName in this.#commands) {
			return this.#commands[commandName];
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
}

module.exports = CommandsList;