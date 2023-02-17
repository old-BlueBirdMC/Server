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

import "./misc/GlobFX.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { InternetAddress } = require("bbmc-raknet");
import ServerInfo from "./ServerInfo.js";
import Logger from "./console/Logger.js";
import ResourceManager from "./managers/ResourceManager.js";
import GeneratorManager from "./managers/GeneratorManager.js";
import fs from "fs";
import BlocksList from "./block/BlocksList.js";
const { EventEmitter } = require("stream");
import Flat from "./world/generators/Flat.js";
import Overworld from "./world/generators/Overworld.js";
import World from "./world/World.js";
import CommandsList from "./command/CommandsList.js";
import CommandReader from "./console/CommandReader.js";
import RakNetInterface from "./network/RakNetInterface.js";
import PacketsList from "./network/minecraft/packets/PacketsList.js";
import ConfigIniManager from "./managers/ConfgIniManager.js";
import RakNetPlayerManager from "./managers/RakNetPlayerManager.js";
import Player from "./player/Player.js";
import LanguageManager from "./managers/LanguageManager.js";
import PluginsManager from "./managers/PluginsManager.js";

export default class Server {
    resourceManager;
    configManager;
    /** @type {Language} */
    language;
    generatorManager;
    #workingEvents = [];
    #eventsHandler;
    rakNetInterface;
    log;
    commandsList;
    consoleCommandReader;
    testWorld;
    pluginsManager;
    playerNamesInUse = 0;

    constructor() {
        let startTime = Date.now();
        this.resourceManager = new ResourceManager();
        this.configManager = new ConfigIniManager();
        this.languageManager = new LanguageManager(this.configManager.getLanguage());
        this.generatorManager = new GeneratorManager(this.resourceManager.blockStatesMap);
        this.registerDefaultGenerators();
        this.testWorld = new World(this.generatorManager);
        this.#eventsHandler = new EventEmitter();
        let rakNetMsgOptions = {
            motd: this.configManager.getMotd(),
            protocolVersion: ServerInfo.minecraftProtocolVersion,
            minecraftVersion: ServerInfo.minecraftVersion,
            maxPlayerCount: this.configManager.getMaxPlayerCount(),
            subMotd: this.configManager.getSubMotd(),
            gameMode: this.configManager.getGamemode(),
        };
        this.rakNetInterface = new RakNetInterface(this, new InternetAddress("0.0.0.0", this.configManager.getServerPort(), this.configManager.getAddressVersion()), rakNetMsgOptions, this.languageManager);
        this.log = new Logger({
            Name: "Server",
            AllowDebugging: false,
            WithColors: true,
        });
        this.log.info(this.languageManager.server("loading"));
        this.commandsList = new CommandsList();
        this.commandsList.refresh();
        this.consoleCommandReader = new CommandReader(this);
        this.consoleCommandReader.handle();
        PacketsList.refresh();
        BlocksList.refresh();
        this.rakNetInterface.handlePong();
        this.rakNetInterface.handle();
        this.log.info(this.languageManager.world("loading"));
        if (!fs.existsSync("worlds")) {
            fs.mkdirSync("worlds");
        }
        this.log.info(this.languageManager.world("loaded"));
        this.log.info(this.languageManager.player("loading"));
        if (!fs.existsSync("players_data")) {
            fs.mkdirSync("players_data");
        }
        this.log.info(this.languageManager.player("loaded"));
        this.log.info(this.languageManager.plugin("loading"));
        this.pluginsManager = new PluginsManager("plugins", this);
        this.pluginsManager.enableAllPlugins();
        this.log.info(this.languageManager.plugin("loaded"));
        this.playerNamesInUse = 0;
        this.log.info(this.languageManager.server("loaded"));
        this.log.info(this.languageManager.server("loadFinish", (Date.now() - startTime) / 1000));
        this.handleProcess();
    }

    handleProcess() {
        process.on("SIGHUP", () => {
            this.shutdown();
        });
        process.on("SIGINT", () => {
            this.shutdown();
        });
    }

    /**
     * shutdowns the server
     *
     * closeMessage = the message that will appear after closing the server
     * exitProcess = force exitting the process
     *
     * @param {string} closeMessage
     * @param {bool} exitProcess
     **/
    shutdown(closeMessage = undefined, exitProcess = true) {
        this.rakNetInterface.close(closeMessage, exitProcess, this.getOnlinePlayers());
    }

    sendUnserializedMinecraftPacket(packet, player) {
        this.rakNetInterface.queuePacket(packet, player);
    }

    addEvent(event, eventName) {
        if (!this.#workingEvents.includes(eventName)) {
            this.#workingEvents.push(eventName);
            this.#eventsHandler.emit(eventName, event);
        }
    }

    getEventsHandler() {
        return this.#eventsHandler;
    }

    /**
     * get a player by name
     *
     * @param {string} name
     * @returns {Player}
     **/
    getOnlinePlayer(name) {
        let foundPlayer;
        this.getOnlinePlayers().forEach((player) => {
            if (player.name === name) {
                foundPlayer = player;
            }
        });
        return foundPlayer;
    }

    /**
     * get player by prefix
     *
     * @param {String} prefix
     * @returns {Player}
     */
    getPlayerByPrefix(prefix) {
        let foundPlayer;

        this.getOnlinePlayers().forEach((player) => {
            if (player.name.toLowerCase().include(prefix.toLocaleLowerCase())) {
                foundPlayer = player;
            }
        });

        return foundPlayer;
    }

    /**
     * get a player by entity id
     *
     * @param {Number} id
     * @returns {Player}
     **/
    getOnlinePlayerByID(id) {
        let foundPlayer;
        this.getOnlinePlayers().forEach((player) => {
            if (player.id === id) {
                foundPlayer = player;
            }
        });
        return foundPlayer;
    }

    /**
     * get a player by runtime entity id
     *
     * @param {bigint} id
     * @returns {Player}
     **/
    getOnlinePlayerByRID(id) {
        let foundPlayer;
        this.getOnlinePlayers().forEach((player) => {
            if (BigInt(player.id) === id) {
                foundPlayer = player;
            }
        });
        return foundPlayer;
    }

    /**
     * get all online players but fixed for server
     *
     * @returns {Array}
     **/
    getOnlinePlayers() {
        let players = [];
        RakNetPlayerManager.getAllObjectValues().forEach((player) => {
            if (player instanceof Player) {
                players.push(player);
            }
        });
        return players;
    }

    /**
     * turns the gamemode version from string into int
     *
     * @param {String} value
     * @returns {Number}
     */
    translateGamemode(value) {
        let gm = -1;
        switch (value.toLowerCase()) {
            case "survival":
            case "s":
                gm = GameMode.survival;
                break;
            case "creative":
            case "c":
                gm = GameMode.creative;
                break;
            case "adventure":
            case "a":
                gm = GameMode.adventure;
                break;
            case "spectator":
            case "v":
                gm = GameMode.spectator;
                break;
        }
        return gm;
    }

    registerDefaultGenerators() {
        this.generatorManager.registerGenerator(Flat);
        this.generatorManager.registerGenerator(Overworld);
    }

    /**
     * broadcast message
     *
     * @param {String} message
     * @param {Array} players
     */
    broadcastMessage(message, players) {
        if (players.length === 0) players = this.getOnlinePlayers();

        players.forEach((player) => {
            player.message(message);
        });
    }

    /**
     * broadcast popup message
     *
     * @param {String} message
     * @param {Array} players
     */
    broadcastPopup(message, players) {
        if (players.length === 0) players = this.getOnlinePlayers();

        players.forEach((player) => {
            player.popup(message);
        });
    }

    /**
     * broadcast tip message
     *
     * @param {String} message
     * @param {Array} players
     */
    broadcastTip(message, players) {
        if (players.length === 0) players = this.getOnlinePlayers();

        players.forEach((player) => {
            player.tip(message);
        });
    }
}
