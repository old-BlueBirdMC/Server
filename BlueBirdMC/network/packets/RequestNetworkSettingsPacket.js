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

const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class RequestNetworkSettingsPacket extends PacketsBase {
    static id = Identifiers.requestNetworkSettings;

    protocolVersion;

    deserialize() {
        this.protocolVersion = this.readIntBE();
    }

    serialize() {
        this.writeIntBE(this.protocolVersion);
    }
}

module.exports = RequestNetworkSettingsPacket;
