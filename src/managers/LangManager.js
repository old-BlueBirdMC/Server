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

const path = require("path");
const fs = require("fs");

class LangManager {
    // this is not an complete reader but it works so who cares/
    #content;

    constructor(language) {
        let fileContents = fs.readFileSync(`src/lang/${language}.ini`).toString();
        let fileLen = fileContents.length;
        this.#content = fileContents.split(/\r?\n/);
        let fixedContent = this.fixContent(fileLen);
        this.#content = this.turnIntoObject(fixedContent);
    }

    getContent(info) {
        return this.#content[info];
    }

    fixContent(fileLen) {
        let content = "";
        let obj = {};
        for (let i = 0; i < fileLen; ++i) {
            if (typeof this.#content[i] !== "undefined") {
                content = this.#content[i];
                if (content.includes(content.split(/#+/))) {
                    if (content.includes("=")) {
                        obj[i] = content.split("=");
                    } else if (content.includes(" =")) {
                        obj[i] = content.split(" =");
                    } else if (content.includes("= ")) {
                        obj[i] = content.split("= ");
                    }
                }
            }
        }
        return obj;
    }

    turnIntoObject(fixedContent) {
        let obj = {};
        Object.values(fixedContent).forEach((realArray) => {
            let index = realArray[0];
            let indexVal = realArray[1];
            obj[index] = this.removeQuotes(indexVal);
        });
        return obj;
    }

    removeQuotes(indexVal) {
        for (let i = 0; i < 2; ++i) {
            if (/\"+/.test(indexVal)) {
                indexVal = indexVal.replace(/\"+/, "");
            }
        }
        return indexVal;
    }
}

module.exports = LangManager;
