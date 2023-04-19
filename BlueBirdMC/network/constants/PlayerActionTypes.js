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

class PlayerActionTypes {
    static startBreak = 0;
    static abortBreak = 1;
    static stopBreak = 2;
    static getUpdatedBlock = 3;
    static dropItem = 4;
    static startSleeping = 5;
    static stopSleeping = 6;
    static respawn = 7;
    static jump = 8;
    static startSprint = 9;
    static stopSprint = 10;
    static stopSneak = 11;
    static creativePlayerDestoryBlock = 12;
    static dimensionChangeAck = 13;
    static startGlide = 14;
    static stopGlide = 15;
    static buildDenied = 17;
    static crackBreak = 18;
    static changeSkin = 19;
    static setEnchantmentSeed = 20;
    static swmming = 21;
    static stopSwimming = 22;
    static startSpinAttack = 23;
    static stopSpinAttack = 24;
    static interactBlock = 25;
    static predictBreak = 26;
    static continueBreak = 27;
    static startItemUseON = 28;
    static stopItemUseON = 29;
}

module.exports = PlayerActionTypes;
