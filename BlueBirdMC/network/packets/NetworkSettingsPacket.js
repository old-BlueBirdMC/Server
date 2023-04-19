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

class NetworkSettingsPacket extends PacketsBase {
    static id = Identifiers.networkSettings;

    threshold;
    algorithm;
    clientThrottling;
    throttleThreshold;
    throttleScalar;

    deserialize() {
        this.threshold = this.readUnsignedShortLE();
        this.algorithm = this.readUnsignedShortLE();
        this.clientThrottling = this.readBool();
        this.throttleThreshold = this.readUnsignedByte();
        this.throttleScalar = this.readFloatLE();
    }

    serialize() {
        this.writeUnsignedShortLE(this.threshold);
        this.writeUnsignedShortLE(this.algorithm);
        this.writeBool(this.clientThrottling);
        this.writeUnsignedByte(this.throttleThreshold);
        this.writeFloatLE(this.throttleScalar);
    }
}

module.exports = NetworkSettingsPacket;
