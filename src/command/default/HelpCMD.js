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

const CommandArgumentFlags = require("../../network/constants/CommandArgumentFlags");
const CommandArgumentTypes = require("../../network/constants/CommandArgumentTypes");
const CommandParam = require("../../network/types/CommandParam");
const Command = require("../Command");

class HelpCMD extends Command {
	constructor() {
		let cmdParam = new CommandParam();
		cmdParam.name = "page/command";
		cmdParam.optional = true;
		cmdParam.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.int;
		cmdParam.options = 0;
		cmdParam.suffixes = [];
		super('help', "Shows the help menu.", ["?"], [cmdParam]);
	}

	async run(sender, writtenCommand, args) {
        	let command = "";
        	let page = -1;

        	if (args.length === 0) {
        	} else if(!isNaN(args[args.length - 1])) { 
				page = parseInt(args.pop());
				if(page <= 0) page = 1; command = args.join(" "); 
			} else {
				command = args.join(" ");
            	page = 1;
        	}

        	if (command === "") {
            		let commands = {};

            		for (const [,command] of Object.entries(sender.server.commandsList.getAllCommands())) {
						command.overloads.forEach(overload => {
                			command.aliases.forEach(prefix => { commands[prefix] = { name: prefix, description: command.description }; });
                			commands[command.name] = command;
						})
            		}

            		let sorted_commands = [];

            		Object.keys(commands).sort().forEach(command => {
                		sorted_commands.push(commands[command]);
                		delete commands[command];
            		});

            		page = Math.min(sorted_commands.length, page);

            		if (page < 1) page = 1;

            		sender.message("----- Help (" + page + " of " + Math.ceil(sorted_commands.length / 4) + ") -----");
            		sorted_commands.slice(((page*4)-4), (page*4)).forEach(command => {
                		sender.message("/" + command.name + ": " + command.description);
            		});
        	} else {
            		if(sender.server.commandsList.get(command.toLowerCase())){
                		let cmd = sender.server.commandsList.get(command.toLowerCase());
                		sender.message("----- Help: /" + cmd.name + " -----");
                		sender.message("Description: " + cmd.description);
            		} else {
                		sender.message("No help for /" + command.toLowerCase());
            		}
        	}
    	}
}

module.exports = HelpCMD;