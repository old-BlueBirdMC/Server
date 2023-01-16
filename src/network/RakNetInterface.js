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

const { RakNetServer, Frame, ReliabilityTool } = require("bbmc-raknet");
const HandlersList = require("./packets/handlers/HandlersList");
const ServerInfo = require("../ServerInfo");
const Identifiers = require("./packets/Identifiers");
const Logger = require("../console/Logger");
const GamePacket = require("./packets/GamePacket");
const Player = require("../player/Player");
const PacketsBase = require("./packets/PacketsBase");
const MinecraftTextColors = require("../color/MinecraftTextColors");
const RakNetMessage = require("../misc/RakNetMessage");
const RakNetPlayerManager = require("../managers/RakNetPlayerManager");
const GamePacketHandler = require("./packets/handlers/GamePacketHandler");

class RakNetInterface {
	server;
	address;
	rakNetServer;
	rakNetMessage;

	constructor(server, address, rakNetMsgFH) {
		this.server = server;
		this.address = address;
		this.rakNetServer = new RakNetServer(address, ServerInfo.rakNetProtocolVersion);
		this.rakNetMessage = new RakNetMessage(
			rakNetMsgFH.motd,
			rakNetMsgFH.protocolVersion,
			rakNetMsgFH.minecraftVersion,
			RakNetPlayerManager.getLength(),
			rakNetMsgFH.maxPlayerCount,
			this.rakNetServer.serverGUID.toString(),
			rakNetMsgFH.subMotd,
			rakNetMsgFH.gameMode
		);
		this.rakNetServer.message = this.rakNetMessage.toString();
		this.log = new Logger({Name: "RakNet", AllowDebugging: true, WithColors: true});
	}

	async handlePong() {
		const pinger = setInterval(async () => {
			return await new Promise(() => {
				if (this.rakNetServer.isRunning === false) {
					clearInterval(pinger);
				}

				if (this.rakNetMessage.playerCount !== RakNetPlayerManager.getLength()) {
					this.rakNetMessage.playerCount = RakNetPlayerManager.getLength();
				}
				this.rakNetServer.message = this.rakNetMessage.toString();
			});
		}, 50);
	}

	async handle() {
		this.rakNetServer.on("connect", (connection) => {
			let reg = RakNetPlayerManager.registerPlayer(connection.address.toString(), new Player(connection, this.server));
			if (reg !== null) {
				this.log.debug("New Connection, Address:", connection.address.toString());
			}
		});
		this.rakNetServer.on("disconnect", (address) => {
			this.log.debug("Disconnected, Address:", address.toString());
			const player = RakNetPlayerManager.getPlayer(address.toString());
			if (player !== null) {
				player.disconnect("", true);
				HandlersList.remove(address.toString());
				RakNetPlayerManager.unregisterPlayer(address.toString());
			}
		});
		this.rakNetServer.on("packet", async (stream, connection) => {
			if (stream.readUnsignedByte() === Identifiers.game) {
				const player = RakNetPlayerManager.getPlayer(connection.address.toString());
				if (player !== null) {
					const game = new GamePacket(stream.buffer);
					await game.deserializeA();
					HandlersList.refresh(player, this.server, connection.address.toString());
					const gameHandler = new GamePacketHandler(player, this.server);
					await gameHandler.startHandling(game);
				}
			}
		});
	}

	async queuePacket(packet, player) {
		if (player.connection.address.toString() in RakNetPlayerManager.getAllWithoutEditing()) {
			if (!(packet.serialized)) {
				packet.serializeA();
			}
			if (packet instanceof PacketsBase) {
				const frame = new Frame();
				frame.reliability = ReliabilityTool.RELIABLE_ORDERED;
				frame.orderChannel = 0;
				frame.isFragmented = false;
				const game = new GamePacket();
				game.compression = player.readyToLogin;
				game.streams.push(packet);
				await game.serializeA();
				frame.stream = game;
				player.connection.addToQueue(frame);
			} else {
				this.log.debug(`Failed to send an unknown packet, className: ${packet.constructor.name}`);
			}
		}
	}

	async close(closeMessage = undefined, exitProcess = false) {
		if (this.rakNetServer.isRunning === true) {
			if (exitProcess === true) {
				exitProcess = false;
				for (const [,player] of RakNetPlayerManager.getAllObjectEntries()) {
					if (closeMessage === undefined) {
						player.disconnect(`${MinecraftTextColors.red}Server killed`);
					} else if (typeof closeMessage === "string") {
						player.disconnect(`${MinecraftTextColors.red}Server killed, reason: ${closeMessage}`);
					}
				}
				setInterval(async () => {
					this.rakNetServer.isRunning = false;
					this.rakNetServer.socket.close();
					this.server.disableAllPlugins();
					process.exit();
				}, 100);
			} else {
				setInterval(async () => {
					this.rakNetServer.isRunning = false;
					this.rakNetServer.socket.close();
					this.server.disableAllPlugins();
				}, 1000);
				return;
			}
		}
	}
}

module.exports = RakNetInterface;
