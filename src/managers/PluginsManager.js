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

import * as fs from "fs";
import * as path from "path";
import PluginInfo from "../plugin/PluginInfo.js";
import PluginPackageConfigurator from "../plugin/PluginPackageConfigurator.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default class PluginsManager {
    pluginsDir;
    server;
    enabledPlugins;
    packageConfigurator;

    constructor(pluginsDir, server) {
        this.pluginsDir = pluginsDir;
        this.server = server;
        this.enabledPlugins = {};

        if (!fs.existsSync(pluginsDir)) {
            fs.mkdirSync(pluginsDir);
        }
    }

    enableAllPlugins() {
        // only common js plugins support "fuck"
        // const pluginsDirContents = fs.readdirSync("plugins");
        // pluginsDirContents.forEach(async (pluginDirContents) => {
        //     if (fs.lstatSync(`${this.pluginsDir}${path.sep}${pluginDirContents}`).isDirectory()) {
        //         const pluginPackage = `${this.pluginsDir}${path.sep}${pluginDirContents}${path.sep}package.json`;
        //         if (fs.existsSync(pluginPackage)) {
        //             const packageContent = JSON.parse(fs.readFileSync(pluginPackage).toString("utf-8"));
        //             this.packageConfigurator = new PluginPackageConfigurator(packageContent);
        //             this.packageConfigurator.validate();
        //             if (!(this.packageConfigurator.name in this.enabledPlugins)) {
        //                 const dataPath = `${this.pluginsDir}${path.sep}${pluginDirContents}${path.sep}data`;
        //                 const req = require(path.join(path.join(__dirname(import.meta.url), `${path.sep}..${path.sep}..${path.sep}${this.pluginsDir}${path.sep}${pluginDirContents}`), this.packageConfigurator.main.replace(".js", "")));
        //                 const mainClass = new req(this.server, dataPath, this.packageConfigurator.name);
        //                 if (!(mainClass instanceof PluginStructure)) {
        //                     throw `Cant load plugin ${this.packageConfigurator.name}, due to the plugin is not an instance of PluginStructure`;
        //                 }
        //                 mainClass.info = PluginInfo.fromPackageConfigurator(this.packageConfigurator);
        //                 this.enabledPlugins[this.packageConfigurator.name] = mainClass;
        //                 if (!fs.existsSync(dataPath)) {
        //                     fs.mkdirSync(dataPath);
        //                 } else {
        //                     if (!fs.lstatSync(dataPath).isDirectory()) {
        //                         fs.mkdirSync(dataPath);
        //                     }
        //                 }
        //                 this.enabledPlugins[this.packageConfigurator.name].successfullyEnabled();
        //                 this.enabledPlugins[this.packageConfigurator.name].handleEvents();
        //             }
        //         }
        //     }
        // });
    }

    disableAllPlugins() {
        const pluginEntries = this.getAllPlugins();
        if (pluginEntries.length > 0) {
            pluginEntries.forEach((plugin) => {
                plugin[1].successfullyDisabled();
            });
        }
    }

    getAllPlugins() {
        return Object.entries(this.enabledPlugins);
    }
}
