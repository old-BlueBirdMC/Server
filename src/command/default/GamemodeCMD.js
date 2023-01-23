/** ****************************************\
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
\***************************************** */

const MinecraftTextColors = require('../../color/MinecraftTextColors');
const ConsoleCommandSender = require('../../console/ConsoleCommandSender');
const CommandArgumentFlags = require('../../network/constants/CommandArgumentFlags');
const CommandArgumentTypes = require('../../network/constants/CommandArgumentTypes');
const CommandParam = require('../../network/types/CommandParam');
const Command = require('../Command');

class GamemodeCMD extends Command {
  constructor() {
    const cmdParamGM = new CommandParam();
    cmdParamGM.name = 'gamemode';
    cmdParamGM.optional = true;
    cmdParamGM.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.str;
    cmdParamGM.options = 0;
    cmdParamGM.suffixes = [];
    const cmdParamTGT = new CommandParam();
    cmdParamTGT.name = 'player';
    cmdParamTGT.optional = true;
    cmdParamTGT.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.target;
    cmdParamTGT.options = 0;
    cmdParamTGT.suffixes = [];
    super('gamemode', 'change ur gamemode', ['gm'], [cmdParamGM, cmdParamTGT]);
    this.setPerm('gmcmd.bb.perm');
  }

  async run(sender, writtenCommand, args) {
    // if (!(sender.hasPerm(this.getPerm()))) {}
    if (typeof args[0] !== 'undefined' && typeof args[1] !== 'undefined') {
	  const player = sender.server.getPlayer(args[1]);
	  if (player) {
        this.changeGM(sender, player, args[0]);
	  }
      sender.message(`${MinecraftTextColors.red}[ERROR] The player is invalid, if he is in write his full name`);
      return;
    }
    this.noArg(args, sender);
    if (typeof args[0] !== 'undefined' && sender instanceof ConsoleCommandSender) {
      sender.message(`${MinecraftTextColors.red}[ERROR] You must provide a player name.`);
    }
    if (typeof args[0] !== 'undefined' && !sender instanceof ConsoleCommandSender) {
      this.noArg(args, sender);
      this.changeGM(sender, sender, args[0]);
    }
  }

  changeGM(messagesSentToWho, player, argument) {
    if (this.isAcceptedGM(argument) === false) {
      messagesSentToWho.message(`${MinecraftTextColors.red}[ERROR] The gamemode is unknown`);
      return;
    }
    if (player.setPlayerGameType(argument) === null) {
      messagesSentToWho.message(`${MinecraftTextColors.red}[ERROR] The gamemode requested is invalid`);
    } else {
      messagesSentToWho.message(`${MinecraftTextColors.green}[SUCCESS] gamemode has been changed to ${argument}`);
    }
  }

  isAcceptedGM(argument) {
    argument = argument.toLowerCase();
    const isAcceptedGM = (argument.includes('survival') || argument.includes('s')) ||
		(argument.includes('creative') || argument.includes('c')) ||
		(argument.includes('adventure') || argument.includes('a')) ||
		(argument.includes('spectator') || argument.includes('v'));
    if (!(isAcceptedGM)) {
      return false;
    }
  }

  noArg(args, messagesSentToWho) {
    if (args.length === 0) {
      messagesSentToWho.message(`${MinecraftTextColors.red}[ERROR] Please provide one of the following: "survival", "creative" or "adventure".`);
    }
  }
}

module.exports = GamemodeCMD;
