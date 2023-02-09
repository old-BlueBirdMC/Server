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

const LanguageFileReader = require("../language/LanguageFileReader");
const LanguageDictionary = require("../language/LanguageDictionary");

class LanguageManager {
    /** @type {String} */
    defaultLanguage;
    /** @type {LanguageDictionary} */
    dictionary;

    constructor(defLang) {
        this.defaultLanguage = defLang;
        this.languageFileReader = new LanguageFileReader(this.defaultLanguage);
        this.dictionary = new LanguageDictionary(this.languageFileReader);
    }
}

module.exports = LanguageManager;
