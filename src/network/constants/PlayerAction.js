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

class PlayerAction {
	static startBreak = 0;
	static abortBreak = 1;
	static stopBreaking = 2;
	static getUpdatedBlock = 3;
	static dropItem = 4;
	static startSleeping = 5;
	static stopSleeping = 6;
	static respawn = 7;
	static jump = 8;
	static startSprint = 9;
	static stopSprint = 10;
	static startSneak = 11;
	static stopSneak = 12;
	static creativeDestroyBlock = 13;
	static dimensionChangeAck = 14;
	static startGlide = 15;
	static stopGlide = 16;
	static worldImmutable = 17;
	static breakingBlock = 18;
	static changeSkin = 19;
	static setEnchantmentSeed = 20;
	static startSwimming = 21;
	static stopSwimming = 22;
	static startSpinAttack = 23;
	static stopSpinAttack = 24;
	static interactBlock = 25;
	static predictDestroyBlock = 26;
	static continueDestroyBlock = 27;
	static startItemUseON = 28;
	static stopItemUseON = 29;
}

module.exports = PlayerAction;