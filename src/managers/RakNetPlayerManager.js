/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

class RakNetPlayerManager {
    static #savedPlayers = {};

    static getPlayer(strAddr) {
        if (strAddr in this.#savedPlayers) {
            return this.#savedPlayers[strAddr];
        }
        return null;
    }

    static registerPlayer(strAddr, player) {
        if (strAddr in this.#savedPlayers) {
            return null;
        }
        this.#savedPlayers[strAddr] = player;
    }

    static unregisterPlayer(strAddr) {
        if (strAddr in this.#savedPlayers) {
            delete this.#savedPlayers[strAddr];
        }
    }

    static getAllWithoutEditing() {
        return this.#savedPlayers;
    }

    static getAllObjectEntries() {
        return Object.entries(this.#savedPlayers);
    }

    static getLength() {
        return this.getAllObjectEntries().length;
    }
}

module.exports = RakNetPlayerManager;
