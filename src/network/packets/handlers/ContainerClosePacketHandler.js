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

const ContainerClosePacket = require("../ContainerClosePacket");
const HandlersBase = require("./HandlersBase");

class ContainerClosePacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		const containerClose = new ContainerClosePacket();
		containerClose.windowID = packet.windowID;
		containerClose.server = false;
		containerClose.sendTo(this.player);
	}
}

module.exports = ContainerClosePacketHandler;