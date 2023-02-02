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

class BlocksList {
    static #list = {};

    static refresh() {
        fs.readdirSync(__dirname + "/default").forEach((file) => {
            const block = require(__dirname + "/default/" + file);
            this.add(new block());
        });
    }

    static add(block) {
        let blockAndMetadata = `${block.blockName} ${block.metadata}`;
        if (!(blockAndMetadata in this.#list)) {
            this.#list[blockAndMetadata] = block;
        }
    }

    static remove(block) {
        let blockAndMetadata = `${block.blockName} ${block.metadata}`;
        if (blockAndMetadata in this.#list) {
            delete this.#list[blockAndMetadata];
        }
    }

    static get(blockName, metadata = 0) {
        let blockAndMetadata = `${blockName} ${metadata}`;
        if (!(blockAndMetadata in this.#list)) {
            throw new Error("Trying to get unregistered block");
        }
        return this.#list[blockAndMetadata];
    }
}

module.exports = BlocksList;
