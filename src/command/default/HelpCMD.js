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

const Command = require("../Command");

class HelpCMD extends Command {
	constructor() {
		super('help', "help command", ["?"]);
	}

	async run(sender, writtenCommand, args) {
		var commands = [];

		sender.message("----- Help -----");
		for (const [,command] of Object.entries(sender.server.commandsList.getAllCommands())) {
			commands.push({name: command.name, description: command.description})
			command.aliases.forEach(prefix => {
				commands.push({name: prefix, description: command.description})
			});
		}
		commands.forEach(command => {
			sender.message("/" + command.name + ": " + command.description);
		})
	}
}

module.exports = HelpCMD;