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

const LanguagePlayerDict = require("./player/LanguagePlayerDict");
const LanguagePluginsDict = require("./plugins/LanguagePluginsDict");
const LanguageServerDict = require("./server/LanguageServerDict");
const LanguageWorldDict = require("./world/LanguageWorldDict");

class LanguageDicts {
    /** @type {Object} */
    content;
    dicts;

    /**
     * @param {Object} content
     */
    constructor(content) {
        this.content = content;
        this.dicts = {
            serverDict: new LanguageServerDict(this.content.server),
            worldDict: new LanguageWorldDict(this.content.world),
            playerDict: new LanguagePlayerDict(this.content.player),
            pluginsDict: new LanguagePluginsDict(this.content.plugins),
            commandsDict: "",
        };
    }

    name() {
        return this.content.name;
    }

    /**
     * @returns {LanguageServerDict}
     */
    server() {
        return this.dicts.serverDict;
    }

    /**
     * @returns {LanguageWorldDict}
     */
    world() {
        return this.dicts.worldDict;
    }

    /**
     * @returns {LanguagePlayerDict}
     */
    player() {
        return this.dicts.playerDict;
    }

    /**
     * @returns {LanguagePlayerDict}
     */
    plugins() {
        return this.dicts.pluginsDict;
    }

    commands() {}
}

module.exports = LanguageDicts;
