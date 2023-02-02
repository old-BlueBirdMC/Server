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

class ConfigIniManager {
    // this is not an complete reader but it works so who cares/
    #content;

    constructor() {
        let fileContents = fs.readFileSync(path.join(__dirname, `..${path.sep}..${path.sep}config.ini`)).toString();
        let fileLen = fileContents.length;
        this.#content = fileContents.split(/\r?\n/);
        let fixedContent = this.fixContent(fileLen);
        this.#content = this.turnIntoObject(fixedContent);
    }

    getMotd() {
        return this.#content.motd;
    }

    getSubMotd() {
        return this.#content.subMotd;
    }

    getGamemode() {
        return this.#content.gamemode;
    }

    getMaxPlayerCount() {
        return this.#content.maxPlayerCount;
    }

    getServerPort() {
        return this.#content.serverPort;
    }

    getAddressVersion() {
        return this.#content.getAddressVersion;
    }

    getChatRestriction() {
        return this.#content.chatRestriction;
    }

    isOnlineMode() {
        return this.#content.onlineMode;
    }

    getWorldName() {
        return this.#content.worldName;
    }

    fixContent(fileLen) {
        let content = "";
        let obj = {};
        for (let i = 0; i < fileLen; ++i) {
            if (typeof this.#content[i] !== "undefined") {
                content = this.#content[i];
                if (content.includes(content.split(/#+/))) {
                    if (content.includes("=")) {
                        // ' = ' or ' =' or '= ' is not supported but who cares?
                        obj[i] = content.split("=");
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

module.exports = ConfigIniManager;
