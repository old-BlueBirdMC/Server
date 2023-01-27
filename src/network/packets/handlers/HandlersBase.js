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

const PacketsBase = require("../PacketsBase");

class HandlersBase {
	player;
	server;

	constructor(player, server) {
		this.player = player;
		this.server = server;
	}

	startHandling(packet) {
		if (!packet instanceof PacketsBase) return;
		if (this.player.connection === null)  return;
		packet.deserializeA();
	}
}

module.exports = HandlersBase;