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

class ResourcePackStackPacket extends PacketsBase {
    static id = Identifiers.resourcePackStack;

    mustAccept;
    behaviorPacks;
    texturePacks;
    gameVersion;
    experiments;
    experimentsPreviouslyUsed;

    deserialize() {
        this.mustAccept = this.readBool();
        this.behaviorPacks = this.readResourcePacksIDVersion();
        this.texturePacks = this.readResourcePacksIDVersion();
        this.gameVersion = this.readStringVarInt();
        this.experiments = this.readExperiments();
        this.experimentsPreviouslyUsed = this.readBool();
    }

    serialize() {
        this.writeBool(this.mustAccept);
        this.writeResourcePacksIDVersion(this.behaviorPacks);
        this.writeResourcePacksIDVersion(this.texturePacks);
        this.writeStringVarInt(this.gameVersion);
        this.writeExperiments(this.experiments);
        this.writeBool(this.experimentsPreviouslyUsed);
    }
}

module.exports = ResourcePackStackPacket;
