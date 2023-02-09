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

const fs = require("fs");
const path = require("path");
const LanguageDicts = require("./dicts/LanguageDicts");

class LanguageFileReader {
    filePath;
    content;

    constructor(languageName) {
        if (!fs.readdirSync("Language").includes(`${languageName}.json`)) {
            throw `Language not found.`;
        }
        this.filePath = `Language${path.sep}${languageName}.json`;
        this.content = fs.readFileSync(this.filePath).toString("utf-8");
        this.langDicts = new LanguageDicts(JSON.parse(this.content));
    }
}

module.exports = LanguageFileReader;
