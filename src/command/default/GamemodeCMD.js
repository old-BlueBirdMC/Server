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

const MinecraftTextColors = require("../../color/MinecraftTextColors");
const RakNetPlayerManager = require("../../managers/RakNetPlayerManager");
const CommandArgumentFlags = require("../../network/constants/CommandArgumentFlags");
const CommandArgumentTypes = require("../../network/constants/CommandArgumentTypes");
const CommandEnum = require("../../network/types/CommandEnum");
const CommandParam = require("../../network/types/CommandParam");
const Command = require("../Command");

class GamemodeCMD extends Command {
	constructor() {
		let cmdParamGM = new CommandParam();
		cmdParamGM.name = "gamemode";
		cmdParamGM.optional = false;
		cmdParamGM.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.str;
		cmdParamGM.options = 0;
		cmdParamGM.suffixes = [];
		let cmdParamTGT = new CommandParam();
		cmdParamTGT.name = "player";
		cmdParamTGT.optional = true;
		cmdParamTGT.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.target;
		cmdParamTGT.options = 0;
		cmdParamTGT.suffixes = [];
		// let cmdENM = new CommandEnum();
		// cmdENM.name = "GameMode";
		// cmdENM.values = [];
		// cmdENM.isDynamic = false;
		super("gamemode", "change ur gamemode", ["gm"], [cmdParamGM, cmdParamTGT]); //, [cmdENM]
		this.setPerm("gmcmd.bb.perm");
	}

	async run(sender, writtenCommand, args) {
		// if (!(sender.hasPerm(this.getPerm()))) {}
		if (typeof args[0] == "undefined") return sender.message(`${MinecraftTextColors.red}Please provide one of the following: "survival", "creative" or "adventure."`);
		if (sender.setPlayerGameType(args[0]) === null) { 
			sender.message(`${MinecraftTextColors.red}The gamemode requested is invalid`);
		} else { sender.message(`${MinecraftTextColors.green}[SUCCESS] gamemode has been changed`); }
	}
}

module.exports = GamemodeCMD;
