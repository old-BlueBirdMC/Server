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

const LanguageLLDictBase = require("../LanguageLLDictBase");

class LanguageServerDict extends LanguageLLDictBase {
    /**
     * @returns {String}
     */
    loadFinish(rsn) {
        if (typeof rsn == "string" && rsn === "%rsn%") {
            rsn = "undefined";
        }
        return this.dict.loadFinish.replace("%rsn%", rsn);
    }

    /**
     * @returns {String}
     */
    closed() {
        this.dict.closed;
    }
}

module.exports = LanguageServerDict;
