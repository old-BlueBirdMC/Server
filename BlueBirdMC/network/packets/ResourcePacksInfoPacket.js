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

class ResourcePacksInfoPacket extends PacketsBase {
    static id = Identifiers.resourcePacksInfo;

    mustAccept;
    hasScripts;
    forceServerPacks;
    behaviorPacks;
    texturePacks;

    deserialize() {
        this.mustAccept = this.readBool();
        this.hasScripts = this.readBool();
        this.forceServerPacks = this.readBool();
        this.behaviorPacks = this.readBehaviorPacksInfo();
        this.texturePacks = this.readTexturePacksInfo();
    }

    serialize() {
        this.writeBool(this.mustAccept);
        this.writeBool(this.hasScripts);
        this.writeBool(this.forceServerPacks);
        this.writeBehaviorPacksInfo(this.behaviorPacks);
        this.writeTexturePacksInfo(this.texturePacks);
    }
}

module.exports = ResourcePacksInfoPacket;
