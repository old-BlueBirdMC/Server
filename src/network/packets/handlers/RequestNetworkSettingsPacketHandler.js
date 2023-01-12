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

const NetworkSettingsPacket = require("../NetworkSettingsPacket");
const HandlersBase = require("./HandlersBase");

class RequestNetworkSettingsPacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		let player = this.player;

		player.checkProtocol(packet.protocolVersion);

		let networkSettings = new NetworkSettingsPacket();
		networkSettings.threshold = 1; //all = 1, none = 0
		networkSettings.algorithm = 0; //snappy = 1, zlib = 0
		networkSettings.clientThrottling = false;
		networkSettings.throttleThreshold = 0;
		networkSettings.throttleScalar = 0.0;
		await networkSettings.sendTo(player);

		player.readyToLogin = true;
	}
}

module.exports = RequestNetworkSettingsPacketHandler;