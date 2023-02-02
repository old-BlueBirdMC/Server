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

const MovePlayerModes = require("../constants/MovePlayerModes");
const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class MovePlayerPacket extends PacketsBase {
    static id = Identifiers.movePlayer;

    runtimeEntityID;
    position;
    rotation;
    mode;
    onGround;
    riddenRuntimeEntityID;
    teleportCause;
    teleportItem;
    tick;

    deserialize() {
        this.runtimeEntityID = this.readRuntimeEntityID();
        this.position = this.readVector3F();
        this.rotation = this.readVector3F();
        this.mode = this.readUnsignedByte();
        this.onGround = this.readBool();
        this.riddenRuntimeEntityID = this.readRuntimeEntityID();
        if (this.mode === MovePlayerModes.teleport) {
            this.teleportCause = this.readIntLE();
            this.teleportItem = this.readIntLE();
        }
        this.tick = this.readVarInt();
    }

    serialize() {
        this.writeRuntimeEntityID(this.runtimeEntityID);
        this.writeVector3F(this.position);
        this.writeVector3F(this.rotation);
        this.writeUnsignedByte(this.mode);
        this.writeBool(this.onGround);
        this.writeRuntimeEntityID(this.riddenRuntimeEntityID);
        if (this.mode === MovePlayerModes.teleport) {
            this.writeIntLE(this.teleportCause);
            this.writeIntLE(this.teleportItem);
        }
        this.writeVarInt(this.tick);
    }
}

module.exports = MovePlayerPacket;
