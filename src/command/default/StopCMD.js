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

const CommandArgumentFlags = require("../../network/constants/CommandArgumentFlags");
const CommandArgumentTypes = require("../../network/constants/CommandArgumentTypes");
const CommandParam = require("../../network/types/CommandParam");
const Command = require("../Command");

class StopCMD extends Command {
	constructor() {
		let cmdParam = new CommandParam();
		cmdParam.name = "stopMessage";
		cmdParam.optional = true;
		cmdParam.enumData = [];
		cmdParam.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.rawText;
		cmdParam.options = 0;
		cmdParam.suffixes = [];
		super("stop", "stop command", [cmdParam]);
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

module.exports = StopCMD;
