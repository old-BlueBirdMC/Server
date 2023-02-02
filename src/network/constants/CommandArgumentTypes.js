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

class CommandArgumentTypes {
    static int = 1;
    static float = 3;
    static value = 4;
    static wildcardInt = 5;
    static operator = 6;
    static compareOperator = 7;
    static target = 8;
    static wildcardTarget = 9;
    static filePath = 10;
    static fullIntRange = 11;
    static equipmentSlot = 12;
    static str = 39;
    static blockPos = 47;
    static position = 48;
    static message = 51;
    static rawText = 53;
    static json = 57;
    static blockStates = 67;
    static command = 70;
}

module.exports = CommandArgumentTypes;
