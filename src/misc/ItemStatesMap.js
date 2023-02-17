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

import ItemState from "../network/minecraft/types/ItemState.js";

export default class ItemStatesMap {
    states;
    #runtimeToName;
    #nameToRuntime;

    constructor(states) {
        this.states = [];
        this.#runtimeToName = {};
        this.#nameToRuntime = {};
        states.forEach((entry) => {
            let state = new ItemState();
            state.itemName = entry["name"];
            state.runtimeID = entry["runtime_id"];
            state.componentBased = entry["component_based"];
            this.states.push(state);
            this.#runtimeToName[state.runtimeID] = state.itemName;
            this.#nameToRuntime[state.itemName] = state.runtimeID;
        });
    }

    runtimeToName(runtimeID) {
        return this.#runtimeToName[runtimeID];
    }

    nameToRuntime(name) {
        return this.#nameToRuntime[name];
    }
}
