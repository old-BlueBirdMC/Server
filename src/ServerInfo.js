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

const Path = require("path");

global.bbmcPath = Path.normalize(__dirname);

class ServerInfo {
	static rakNetProtocolVersion = 11;
	static minecraftProtocolVersion = 560;
	static minecraftVersion = "1.19.50";
	static engine = "BlueBirdMC-Server";
    static apiVersion = "0.0.1";
}

module.exports = ServerInfo;