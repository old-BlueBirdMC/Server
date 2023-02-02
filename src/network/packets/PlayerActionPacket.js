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

class PlayerActionPacket extends PacketsBase {
    static id = Identifiers.playerAction;

    runtimeEntityID;
    actionType;
    blockCoordinates;
    resultBlockCoordinates;
    blockFace;

    deserialize() {
        this.runtimeEntityID = this.readRuntimeEntityID();
        this.actionType = this.readSignedVarInt();
        this.blockCoordinates = this.readBlockCoordinates();
        this.resultBlockCoordinates = this.readBlockCoordinates();
        this.blockFace = this.readUnsignedByte();
    }

    serialize() {
        this.writeRuntimeEntityID(this.runtimeEntityID);
        this.writeSignedVarInt(this.actionType);
        this.writeBlockCoordinates(this.blockCoordinates);
        this.writeBlockCoordinates(this.resultBlockCoordinates);
        this.writeUnsignedByte(this.blockFace);
    }
}

module.exports = PlayerActionPacket;
