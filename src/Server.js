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

require("./misc/GlobFX");
const { InternetAddress } = require("bbmc-raknet");
const ServerInfo = require("./ServerInfo");
const Logger = require("./console/Logger");
const ResourceManager = require("./managers/ResourceManager");
const GeneratorManager = require("./managers/GeneratorManager");
const fs = require("fs");
const BlocksList = require("./block/BlocksList");
const { EventEmitter } = require("stream");
const Flat = require("./world/generators/Flat");
const Overworld = require("./world/generators/Overworld");
const World = require("./world/World");
const PluginStructure = require("./plugin/PluginStructure");
const path = require("path");
const CommandsList = require("./command/CommandsList");
const CommandReader = require("./console/CommandReader");
const RakNetInterface = require("./network/RakNetInterface");
const PacketsList = require("./network/packets/PacketsList");
const ConfigIniManager = require("./managers/ConfgIniManager");
const PluginInfo = require("./plugin/PluginInfo");
const RakNetPlayerManager = require("./managers/RakNetPlayerManager");
const Player = require("./player/Player");
const LangManager = require("./managers/LangManager");

class Server {
    rakNetServer;
    rakNetMessage;
    log;
    languageManager;
    #workingEvents = [];
    #workingPlugins = {};
    #eventsHandler;
    commandsList;
    resourceManager;
    configManager;
    generatorManager;
    testWorld;
    playerNamesInUse = 0;

    constructor() {
        let startTime = Date.now();
        this.languageManager = new LangManager();
        this.resourceManager = new ResourceManager();
        this.configManager = new ConfigIniManager();
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
        this.rakNetInterface = new RakNetInterface(this, new InternetAddress("0.0.0.0", this.configManager.getServerPort(), this.configManager.getAddressVersion()), rakNetMsgOptions);
        this.log = new Logger({
            Name: "Server",
            AllowDebugging: false,
            WithColors: true,
        });
        this.log.info(this.languageManager.lang("serverLoading"));
        this.commandsList = new CommandsList();
        this.commandsList.refresh();
        this.consoleCommandReader = new CommandReader(this);
        this.consoleCommandReader.handle();
        PacketsList.refresh();
        BlocksList.refresh();
        this.rakNetInterface.handlePong();
        this.rakNetInterface.handle();
        this.log.info(this.languageManager.lang("worldLoading"));
        if (!fs.existsSync("worlds")) {
            fs.mkdirSync("worlds");
        }
        this.log.info(this.languageManager.lang("worldLoaded"));
        this.log.info(this.languageManager.lang("playerLoading"));
        if (!fs.existsSync("players_data")) {
            fs.mkdirSync("players_data");
        }
        this.log.info(this.languageManager.lang("playerLoaded"));
        this.log.info(this.languageManager.lang("pluginLoading"));
        if (!fs.existsSync("plugins")) {
            fs.mkdirSync("plugins");
        }
        this.enablePlugins();
        this.log.info(this.languageManager.lang("pluginLoaded"));
        this.playerNamesInUse = 0;
        this.log.info(this.languageManager.lang("serverLoaded"));
        this.log.info(this.languageManager.lang("serverDone") + "(" + (Date.now() - startTime) / 1000 + ")s!");
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

    enablePlugins() {
        fs.readdirSync("plugins").forEach(async (pluginsDir) => {
            if (fs.lstatSync(`plugins/${pluginsDir}`).isDirectory()) {
                let pluginPackage = `plugins/${pluginsDir}/package.json`;
                if (fs.existsSync(pluginPackage)) {
                    let data = JSON.parse(fs.readFileSync(pluginPackage).toString("utf-8"));
                    let pluginName = typeof data["name"] !== "undefined" ? data["name"] : "";
                    let main = typeof data["main"] !== "undefined" ? data["main"] : "";
                    let author = typeof data["author"] !== "undefined" ? data["author"] : "";
                    let description = typeof data["description"] !== "undefined" ? data["description"] : "";
                    let version = typeof data["version"] !== "undefined" ? data["version"] : "";
                    let apiVersion = typeof data["api"] !== "undefined" ? data["api"] : "";
                    if (apiVersion !== ServerInfo.apiVersion) {
                        throw `Cant load plugin ${pluginName}, due to incompatible api version (${apiVersion})`;
                    }
                    if (!(pluginName in this.#workingPlugins)) {
                        let dataPath = `plugins/${pluginsDir}/data`;
                        let req = require(path.join(`../plugins/${pluginsDir}`, main.replace(".js", "")));
                        let mainClass = new req(this, dataPath, pluginName);
                        if (!(mainClass instanceof PluginStructure)) {
                            throw `Cant load plugin ${pluginName}, due to the plugin is not an instance of PluginStructure`;
                        }
                        mainClass.info = new PluginInfo();
                        mainClass.info.pluginName = pluginName;
                        mainClass.info.verison = version;
                        mainClass.info.description = description;
                        mainClass.info.author = author;
                        this.#workingPlugins[pluginName] = mainClass;
                        if (!fs.existsSync(dataPath)) {
                            fs.mkdirSync(dataPath);
                        } else {
                            if (!fs.lstatSync(dataPath).isDirectory()) {
                                fs.mkdirSync(dataPath);
                            }
                        }
                        this.#workingPlugins[pluginName].successfullyEnabled();
                        this.#workingPlugins[pluginName].handleEvents();
                    }
                }
            }
        });
    }

    /**
     * disable all plugins
     * @returns {void}
     */
    disableAllPlugins() {
        let pluginEntries = Object.entries(this.#workingPlugins);
        if (pluginEntries.length > 0) {
            pluginEntries.forEach((plugin) => {
                plugin[1].successfullyDisabled();
            });
        }
    }

    /**
     * get all working plugins
     * @returns {Object}
     */
    getAllPlugins() {
        return Object.entries(this.#workingPlugins);
    }

    /**
     * get a player by displayName
     * @param {string} displayName
     * @returns {Player}
     **/
    getOnlinePlayer(name) {
        let foundPlayer;
        this.getOnlinePlayers().forEach((player) => {
            if (player.displayName === name) {
                foundPlayer = player;
            }
        });
        return foundPlayer;
    }

    /**
     * get a player by entity id
     * @param {string} displayName
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
     * @param {string} displayName
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
     * @returns {void}
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
}

module.exports = Server;
