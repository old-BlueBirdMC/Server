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

export default class PlayerAttribute {
    min;
    max;
    current;
    default;
    name;
    modifiers;

    constructor(min = 0.0, max = 0.0, current = 0.0, defaultValue = 0.0, name = "", modifiers = []) {
        this.min = min;
        this.max = max;
        this.current = current;
        this.default = defaultValue;
        this.name = name;
        this.modifiers = modifiers;
    }
}
