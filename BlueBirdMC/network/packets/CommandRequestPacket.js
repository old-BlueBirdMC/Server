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

class CommandRequestPacket extends PacketsBase {
    static id = Identifiers.commandRequest;

    command;
    data;
    internal;
    version;

    deserialize() {
        this.command = this.readStringVarInt();
        this.data = this.readCommandOrigin();
        this.internal = this.readBool();
        this.version = this.readVarInt();
    }

    serialize() {
        this.writeStringVarInt(this.command);
        this.writeCommandOrigin(this.data);
        this.writeBool(this.internal);
        this.writeVarInt(this.version);
    }
}

module.exports = CommandRequestPacket;
