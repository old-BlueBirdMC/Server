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

class LevelSoundEventPacket extends PacketsBase {
    static id = Identifiers.levelSoundEvent;

    soundID;
    position;
    extraData;
    entityType;
    isBabyMob;
    isGlobal;

    deserialize() {
        this.soundID = this.readVarInt();
        this.position = this.readVector3F();
        this.extraData = this.readSignedVarInt();
        this.entityType = this.readStringVarInt();
        this.isBabyMob = this.readBool();
        this.isGlobal = this.readBool();
    }

    serialize() {
        this.writeVarInt(this.soundID);
        this.writeVector3F(this.position);
        this.writeSignedVarInt(this.extraData);
        this.writeStringVarInt(this.entityType);
        this.writeBool(this.isBabyMob);
        this.writeBool(this.isGlobal);
    }
}

module.exports = LevelSoundEventPacket;
