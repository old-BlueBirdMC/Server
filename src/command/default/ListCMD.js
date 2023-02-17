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

import Command from "../Command.js";

export default class ListCMD extends Command {
    constructor() {
        super("list", "show a list of the online players");
        this.setPerm("listcmd.bb.perm");
    }

    async run(sender, writtenCommand, args) {
        // if (!(sender.hasPerm(this.getPerm()))) {}
        let onlinePlayers = sender.server.getOnlinePlayers();
        if (onlinePlayers.length > 0) {
            sender.message(`Found: ${onlinePlayers.length}`);
            onlinePlayers.forEach((playerFound) => {
                sender.message(`id: ${playerFound.id}, name: ${playerFound.name}`);
            });
        } else {
            sender.message("There is no players online");
        }
    }
}
