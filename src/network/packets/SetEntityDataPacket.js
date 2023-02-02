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

class SetEntityDataPacket extends PacketsBase {
    static id = Identifiers.setEntityData;

    runtimeEntityID;
    metadata;
    properties;
    tick;

    deserialize() {
        this.runtimeEntityID = this.readRuntimeEntityID();
        this.metadata = this.readMetadataList();
        this.properties = this.readEntityProperties();
        this.tick = this.readVarInt();
    }

    serialize() {
        this.writeRuntimeEntityID(this.runtimeEntityID);
        this.writeMetadataList(this.metadata);
        this.writeEntityProperties(this.properties);
        this.writeVarInt(this.tick);
    }
}

module.exports = SetEntityDataPacket;
