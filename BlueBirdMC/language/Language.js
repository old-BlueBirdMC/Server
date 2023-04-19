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

const Language = require("bbmc-lang");

class Languages {
    content;

    constructor(languageName) {
        this.content = Language(languageName);
    }

    plugin(item, arg) {
        if (!arg) {
            return this.content.plugins[item];
        }

        return this.content.plugins[item].replace("%rsn%", arg);
    }
    server(item, arg) {
        if (!arg) {
            return this.content.server[item];
        }
        return this.content.server[item].replace("%rsn%", arg);
    }

    world(item, arg) {
        if (!arg) {
            return this.content.world[item];
        }

        return this.content.world[item].replace("%rsn%", arg);
    }

    player(item, arg) {
        if (!arg) {
            return this.content.player[item];
        }

        return this.content.player[item].replace("%rsn%", arg);
    }
}

module.exports = Languages;
