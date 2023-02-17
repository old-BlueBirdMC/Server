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

import MinecraftTextColors from "../../color/MinecraftTextColors.js";
import Command from "../Command.js";

export default class PluginsCMD extends Command {
    constructor() {
        super("plugins", "The plugins list");
    }

    async run(sender, writtenCommand, args) {
        let list = "";
        const plugins = sender.server.getAllPlugins();
        sender.message("Plugins: (" + plugins.length + ") ");
        plugins.forEach((plugin) => {
            list += plugin[1].description.pluginName;
        });
        if (list.length > 0) {
            sender.message(`${MinecraftTextColors.green}${list}`);
        }
    }
}
