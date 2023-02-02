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

const RakNetPlayerManager = require("../../managers/RakNetPlayerManager");
const Command = require("../Command");

class ListCMD extends Command {
    constructor() {
        super("list", "show a list of the online players");
        this.setPerm("listcmd.bb.perm");
    }

    async run(sender, writtenCommand, args) {
        // if (!(sender.hasPerm(this.getPerm()))) {}
        if (RakNetPlayerManager.getLength() > 0) {
            sender.message(`Found: ${RakNetPlayerManager.getLength()}`);
            RakNetPlayerManager.getAllObjectValues().forEach((playerFound) => {
                sender.message(`id: ${playerFound.id}, name: ${sender.server.getPlayerName(playerFound)}`);
            });
        } else {
            sender.message("There is no players online");
        }
    }
}

module.exports = ListCMD;
