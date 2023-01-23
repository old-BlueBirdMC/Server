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
const Command = require("../Command");

class pluginCMD extends Command {
	constructor() {
		super("plugin", "Shows a list of plugins", ["pl"], []);
	}

	async run(sender, writtenCommand, args) {
        let list = "";
        const getPlugins = sender.server.getAllPlugins();
        sender.message("Plugin(s) (" + getPlugins.length + ") ")
        getPlugins.forEach(plugin => {
            list += plugin[1].description.pluginName
        });
        sender.message(`${MinecraftTextColors.green}${list}`)
	}
}

module.exports = pluginCMD;
