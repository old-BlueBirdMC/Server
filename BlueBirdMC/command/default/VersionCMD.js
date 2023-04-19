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

const Command = require("../Command");
const ServerInfo = require("../../ServerInfo");

class VersionCMD extends Command {
    constructor() {
        super("version", "Shows the version of BBMC is running or plugin version.", ["about", "ver", "versions"]);
    }

    async run(sender, writtenCommand, args) {
        if (typeof args[0] !== "undefined") {
            sender.message("Plugins Versions not supported yet!");
        } else {
            sender.message(`This server is running: ${ServerInfo.engine} and Minecraft version: ${ServerInfo.minecraftVersion}, ProtocolVersion: (${ServerInfo.minecraftProtocolVersion})`);
        }
    }
}

module.exports = VersionCMD;
