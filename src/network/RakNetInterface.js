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
const GamePacketHandler = require("./packets/handlers/GamePacketHandler");
const HandlersList = require("./packets/handlers/HandlersList");
const ServerInfo = require("../ServerInfo");
const Identifiers = require("./packets/Identifiers");
const Logger = require("../console/Logger");
const GamePacket = require("./packets/GamePacket");
const Player = require("../player/Player");
const PacketsBase = require("./packets/PacketsBase");
const MinecraftTextColors = require("../color/MinecraftTextColors");

class RakNetInterface {
	server;
	address;
	rakNetServer;
	rakNetMessage;
	players = {};

	constructor(server, address, rakNetMessage) {
		this.server = server;
		this.address = address;
		this.rakNetServer = new RakNetServer(address, ServerInfo.rakNetProtocolVersion);
		rakNetMessage.playerCount = Object.entries(this.players).length;
		rakNetMessage.serverGUID = this.rakNetServer.serverGUID.toString();
		this.rakNetMessage = rakNetMessage;
		this.rakNetServer.message = rakNetMessage;
		this.log = new Logger({Name: "RakNet", AllowDebugging: false, WithColors: true});
	}

	async handlePong() {
		const pinger = setInterval(async () => {
			return await new Promise(() => {
				if (this.rakNetServer.isRunning === false) {
					clearInterval(pinger);
				}
				this.rakNetServer.message = this.rakNetMessage.toString();
			});
		}, 50);
	}

	async handle() {
		this.rakNetServer.on("connect", (connection) => {
			this.log.info("New Connection, Address:", connection.address.toString());
			if (!(connection.address.toString() in this.players)) {
				this.players[connection.address.toString()] = new Player(connection, this.server);
			}
		});
		this.rakNetServer.on("disconnect", (address) => {
			this.log.info("Disconnected, Address:", address.toString());
			if (address.toString() in this.players) {
				delete this.players[address.toString()];
			}
		});
		this.rakNetServer.on("packet", async (stream, connection) => {
			if (stream.buffer[0] == Identifiers.game) {
				const player = this.players[connection.address.toString()];
				HandlersList.refresh(player, this.server);
				const game = new GamePacket(stream.buffer);
				await game.deserializeA();
				const gamePacketHandler = new GamePacketHandler(player);
				await gamePacketHandler.startHandling(game);
			}
		});
	}

	async queuePacket(packet, player) {
		if (player.connection.address.toString() in this.players) {
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
				this.log.debug("failed to send an unknown packet, className: " + packet.constructor.name);
			}
		}
	}

	async close(exitProcess = false) {
		if (this.rakNetServer.isRunning === true) {
			if (exitProcess === true) {
				exitProcess = false;
				for (const [,player] of Object.entries(this.players)) {
					player.disconnect(`${MinecraftTextColors.red}Server killed`);
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
