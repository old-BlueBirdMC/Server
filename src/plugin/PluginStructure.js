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

const Logger = require("../console/Logger");

class PluginStructure {
    server;
    dataPath;
    log;
    description = {};

    constructor(server, dataPath, pluginName) {
        this.server = server;
        this.dataPath = dataPath;
        this.log = new Logger({
            Name: pluginName,
            WithColors: true,
            AllowDebugging: false,
        });
    }

    successfullyEnabled() {}

    handleEvents() {}

    successfullyDisabled() {}
}

module.exports = PluginStructure;
