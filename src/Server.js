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

const { InternetAddress } = require("bbmc-raknet");
const ServerInfo = require("./ServerInfo");
const Logger = require("./console/Logger");
const ResourceManager = require("./managers/ResourceManager");
const GeneratorManager = require("./managers/GeneratorManager");
const fs = require("fs");
const BlocksList = require("./block/BlocksList");
const { EventEmitter } = require("stream");
const Flat = require("./world/generators/Flat");
const World = require("./world/World");
const PluginStructure = require("./plugin/PluginStructure");
const path = require("path");
const CommandsList = require("./command/CommandsList");
const CommandReader = require("./console/CommandReader");
const RakNetInterface = require("./network/RakNetInterface");
const PacketsList = require("./network/packets/PacketsList");
const ConfigIniManager = require("./managers/ConfgIniManager");
const PluginDescription = require("./plugin/PluginDescription");
const RakNetPlayerManager = require('./managers/RakNetPlayerManager');
const Player = require("./player/Player");

class Server {
	rakNetServer;
	rakNetMessage;
	log;
	#workingEvents = [];
	#workingPlugins = {};
	#eventsHandler;
	commandsList;
	resourceManager;
	configManager;
	generatorManager;
	testWorld;

	constructor() {
		let startTime = Date.now();
		this.resourceManager = new ResourceManager();
		this.configManager = new ConfigIniManager();
		this.generatorManager = new GeneratorManager(this.resourceManager.blockStatesMap);
		this.registerDefaultGenerators();
		this.testWorld = new World(this.generatorManager);
		this.#eventsHandler = new EventEmitter();
		let rakNetMsgFH = {motd: this.configManager.getMotd(), protocolVersion: ServerInfo.minecraftProtocolVersion,
		minecraftVersion: ServerInfo.minecraftVersion, maxPlayerCount: this.configManager.getMaxPlayerCount(),
		subMotd: this.configManager.getSubMotd(), gameMode: this.configManager.getGamemode()};
		this.rakNetInterface = new RakNetInterface(this, new InternetAddress("0.0.0.0", this.configManager.getServerPort(), this.configManager.getAddressVersion()), rakNetMsgFH);
		this.log = new Logger({Name: "Server", AllowDebugging: false, WithColors: true});
		this.log.info("Loading Server");
		this.commandsList = new CommandsList();
		this.commandsList.refresh();
		this.consoleCommandReader = new CommandReader(this);
		this.consoleCommandReader.readConsole();
		PacketsList.refresh();
		BlocksList.refresh();
		this.rakNetInterface.handlePong();
		this.rakNetInterface.handle();
		this.log.info("Loading worlds");
		if (!(fs.existsSync("worlds"))) {
			fs.mkdirSync("worlds");
		}
		this.log.info("Worlds Loaded");
		this.log.info("Loading PlayersData");
		if (!(fs.existsSync("players_data"))) {
			fs.mkdirSync("players_data");
		}
		this.log.info("PlayersData Loaded");
		this.log.info("Loading Plugins");
		if (!(fs.existsSync("plugins"))) {
			fs.mkdirSync("plugins");
		}
		this.enablePlugins();
		this.log.info("Plugins Loaded");
		this.log.info("Server Loaded");
		this.log.info("Done in (" + (Date.now() - startTime) / 1000 + ")s!");
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

	async shutdown(closeMessage = undefined, exitProcess = true) {
		await this.rakNetInterface.close(closeMessage, exitProcess);
	}

	async sendUnserializedMinecraftPacket(packet, player) {
		await this.rakNetInterface.queuePacket(packet, player);
	}

	addEvent(event, eventName) {
		if (!(this.#workingEvents.includes(eventName))) {
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
                        this.log.error(`Cant load plugin ${pluginName}, due to incompatible api version (${apiVersion})`);
                        return;
                    }
					if (!(pluginName in this.#workingPlugins)) {
						let dataPath = `plugins/${pluginsDir}/data`;
						let req = require(path.join(`../plugins/${pluginsDir}`, main.replace(".js", "")));
						let mainClass = new req(this, dataPath, pluginName);
						if (!(mainClass instanceof PluginStructure)) {
							this.log.error("Cant load plugin " + pluginName + ", cause: The plugin is not instance of PluginStructure");
							return;
						}
						mainClass.description = new PluginDescription();
						mainClass.description.pluginName = pluginName;
						mainClass.description.verison = version;
						mainClass.description.description = description;
						mainClass.description.author = author;
						this.#workingPlugins[pluginName] = mainClass;
						if (!(fs.existsSync(dataPath))) {
							fs.mkdirSync(dataPath);
						} else {
							if (!(fs.lstatSync(dataPath).isDirectory())) {
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

	disableAllPlugins() {
		let pluginEntries = Object.entries(this.#workingPlugins);
		if (pluginEntries.length > 0) {
			pluginEntries.forEach(plugin => {
				plugin[1].successfullyDisabled();
			});
		}
	}

	getAllPlugins() {
		return Object.entries(this.#workingPlugins);
	}

	getOnlinePlayer(name) {
		let foundPlayer;
		this.getOnlinePlayers().forEach((player) => {
			if (player.getRealName() === name) {
				foundPlayer = player;
			}
		});
		return foundPlayer;
	}

	getOnlinePlayerByID(id) {
		let foundPlayer;
		this.getOnlinePlayers().forEach((player) => {
			console.log(player.id === id);
			if (player.id === id) {
				foundPlayer = player;
			}
		});
		return foundPlayer;
	}

	getOnlinePlayerByRID(id) {
		let foundPlayer;
		this.getOnlinePlayers().forEach((player) => {
			console.log(player.id === id);
			if (BigInt(player.id) === id) {
				foundPlayer = player;
			}
		});
		return foundPlayer;
	}

	getOnlinePlayers() {
		let players = [];
		RakNetPlayerManager.getAllObjectValues().forEach((player) => {
			if (player instanceof Player) {
				players.push(player);
			}
		});
		return players;
	}

	registerDefaultGenerators() {
		this.generatorManager.registerGenerator(Flat);
	}
}

module.exports = Server;
