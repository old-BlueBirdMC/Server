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

const LanguagePlayerDict = require("./dicts/player/LanguagePlayerDict");
const LanguagePluginsDict = require("./dicts/plugins/LanguagePluginsDict");
const LanguageServerDict = require("./dicts/server/LanguageServerDict");
const LanguageWorldDict = require("./dicts/world/LanguageWorldDict");
const LanguageFileReader = require("./LanguageFileReader");

class LanguageDictionary {
    /** @type {LanguageFileReader} */
    languageFileReader;

    /**
     * @param {LanguageFileReader} languageFileReader
     */
    constructor(languageFileReader) {
        this.languageFileReader = languageFileReader;
    }

    /** @returns {String} */
    fullName() {
        return this.languageFileReader.langDicts.name();
    }

    /** @returns {LanguageServerDict} */
    server() {
        return this.languageFileReader.langDicts.server();
    }

    /** @returns {LanguageWorldDict} */
    world() {
        return this.languageFileReader.langDicts.world();
    }

    /** @returns {LanguagePlayerDict} */
    player() {
        return this.languageFileReader.langDicts.player();
    }

    /** @returns {LanguagePluginsDict} */
    plugins() {
        return this.languageFileReader.langDicts.plugins();
    }

    commands() {
        // not really needed
    }
}

module.exports = LanguageDictionary;
