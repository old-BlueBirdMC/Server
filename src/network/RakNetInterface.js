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

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { RakNetServer, Frame, ReliabilityTool } = require("bbmc-raknet");
import HandlersList from "./minecraft/packets/handlers/HandlersList.js";
import ServerInfo from "../ServerInfo.js";
import Identifiers from "./minecraft/packets/Identifiers.js";
import Logger from "../console/Logger.js";
import GamePacket from "./minecraft/packets/GamePacket.js";
import Player from "../player/Player.js";
import PacketsBase from "./minecraft/packets/PacketsBase.js";
import MinecraftTextColors from "../color/MinecraftTextColors.js";
import RakNetMessage from "../misc/RakNetMessage.js";
import RakNetPlayerManager from "../managers/RakNetPlayerManager.js";
import GamePacketHandler from "./minecraft/packets/handlers/GamePacketHandler.js";

export default class RakNetInterface {
    server;
    address;
    languageManager;
    rakNetServer;
    rakNetMessage;

    constructor(server, address, rakNetMsgOptions, languageManager) {
        this.server = server;
        this.address = address;
        this.languageManager = languageManager;
        this.rakNetServer = new RakNetServer(address, ServerInfo.rakNetProtocolVersion);
        this.rakNetMessage = new RakNetMessage(
            rakNetMsgOptions.motd,
            rakNetMsgOptions.protocolVersion,
            rakNetMsgOptions.minecraftVersion,
            RakNetPlayerManager.getLength(),
            rakNetMsgOptions.maxPlayerCount,
            this.rakNetServer.serverGUID.toString(),
            rakNetMsgOptions.subMotd,
            rakNetMsgOptions.gameMode
        );
        this.rakNetServer.message = this.rakNetMessage.toString();
        this.log = new Logger({
            Name: "RakNet",
            AllowDebugging: true,
            WithColors: true,
        });
    }

    handlePong() {
        const pinger = setInterval(async () => {
            return new Promise(() => {
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
                HandlersList.remove(address.toString());
                RakNetPlayerManager.unregisterPlayer(address.toString());
            }
        });
        this.rakNetServer.on("packet", async (stream, connection) => {
            if (stream.readUnsignedByte() === Identifiers.game) {
                const player = RakNetPlayerManager.getPlayer(connection.address.toString());
                if (player !== null) {
                    const game = new GamePacket(stream.buffer);
                    game.useCompression = player.useCompression;
                    await game.deserializeA();
                    HandlersList.refresh(player, this.server, connection.address.toString());
                    const gamePacketHandler = new GamePacketHandler(player, this.server);
                    await gamePacketHandler.startHandling(game);
                }
            }
        });
    }

    async queuePacket(packet, player) {
        if (player.connection.address.toString() in RakNetPlayerManager.getAllWithoutEditing()) {
            if (!packet.serialized) {
                packet.serializeA();
            }
            if (packet instanceof PacketsBase) {
                const frame = new Frame();
                frame.reliability = ReliabilityTool.RELIABLE_ORDERED;
                frame.orderChannel = 0;
                frame.isFragmented = false;
                const game = new GamePacket();
                game.useCompression = player.useCompression;
                game.streams.push(packet);
                await game.serializeA();
                frame.stream = game;
                player.connection.addToQueue(frame);
            } else {
                this.log.debug(`Failed to send an unknown packet, className: ${packet.constructor.name}`);
            }
        }
    }

    async close(closeMessage = undefined, exitProcess = false, players = []) {
        if (this.rakNetServer.isRunning === true) {
            if (exitProcess === true) {
                exitProcess = false;
                players.forEach((player) => {
                    if (closeMessage === undefined) {
                        player.disconnect(`${MinecraftTextColors.red}${this.languageManager.server("close")}`);
                    } else if (typeof closeMessage === "string") {
                        player.disconnect(`${MinecraftTextColors.red}Server killed due to: ${closeMessage}`);
                    }
                });
                setInterval(async () => {
                    this.rakNetServer.isRunning = false;
                    this.rakNetServer.socket.close();
                    this.server.pluginsManager.disableAllPlugins();
                    process.exit();
                }, 100);
            } else {
                setInterval(async () => {
                    this.rakNetServer.isRunning = false;
                    this.rakNetServer.socket.close();
                    this.pluginsManager.server.disableAllPlugins();
                }, 1000);
                return;
            }
        }
    }
}
