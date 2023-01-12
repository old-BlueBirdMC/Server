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

class Identifiers {
	static game = 0xfe;
	static login = 0x01;
	static playStatus = 0x02;
	static startGame = 0x0b;
	static resourcePacksInfo = 0x06;
	static resourcePackStack = 0x07;
	static resourcePackClientResponse = 0x08;
	static biomeDefinitionList = 0x7a;
	static creativeContent = 0x91;
	static levelChunk = 0x3a;
	static networkChunkPublisherUpdate = 0x79;
	static requestChunkRadius = 0x45;
	static chunkRadiusUpdated = 0x46;
	static availableActorIdentifiers = 0x77;
	static interact = 0x21;
	static containerOpen = 0x2e;
	static containerClose = 0x2f;
	static disconnect = 0x05;
	static commandRequest = 0x4d;
	static availableCommands = 0x4c;
	static text = 0x09;
	static modalFormRequest = 0x64;
	static networkSettings = 0x8f;
	static requestNetworkSettings = 0xc1;
}

module.exports = Identifiers;