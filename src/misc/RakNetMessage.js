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

class RakNetMessage {
	motd;
	protocolVersion;
	version;
	playerCount;
	maxPlayerCount;
	serverGUID;
	subMotd;
	gamemode;

	constructor(motd = "", protocolVersion = 0, version = "", playerCount = 0, maxPlayerCount = 0, serverGUID = 0, subMotd = "", gamemode = "") {
		this.motd = motd;
		this.protocolVersion = protocolVersion;
		this.version = version;
		this.playerCount = playerCount;
		this.maxPlayerCount = maxPlayerCount;
		this.serverGUID = serverGUID;
		this.subMotd = subMotd;
		this.gamemode = gamemode;
	}

	toString() {
		return `MCPE;${this.motd};${this.protocolVersion.toString()};${this.version};${this.playerCount.toString()};${this.maxPlayerCount.toString()};${this.serverGUID.toString()};${this.subMotd};${this.gamemode};`
	}
}

module.exports = RakNetMessage;
