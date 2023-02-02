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

const TextTypes = require("../constants/TextTypes");
const Identifiers = require("./Identifiers");
const PacketsBase = require("./PacketsBase");

class TextPacket extends PacketsBase {
    static id = Identifiers.text;

    typeID;
    needsTranslation;
    sourceName;
    message;
    parameters;
    xuid;
    platformChatID;

    deserialize() {
        this.typeID = this.readUnsignedByte();
        this.needsTranslation = this.readBool();
        switch (this.typeID) {
            case TextTypes.chat:
            case TextTypes.whisper:
            case TextTypes.announcement:
                this.sourceName = this.readStringVarInt();
            case TextTypes.raw:
            case TextTypes.tip:
            case TextTypes.system:
            case TextTypes.jsonWhisper:
            case TextTypes.json:
            case TextTypes.jsonAnnouncement:
                this.message = this.readStringVarInt();
                break;
            case TextTypes.translation:
            case TextTypes.popup:
            case TextTypes.jukeboxPopup:
                this.message = this.readStringVarInt();
                for (let i = 0; i < this.readVarInt(); ++i) {
                    this.parameters.push(this.readStringVarInt());
                }
                break;
        }
        this.xuid = this.readStringVarInt();
        this.platformChatID = this.readStringVarInt();
    }

    serialize() {
        this.writeUnsignedByte(this.typeID);
        this.writeBool(this.needsTranslation);
        switch (this.typeID) {
            case TextTypes.chat:
            case TextTypes.whisper:
            case TextTypes.announcement:
                this.readStringVarInt(this.sourceName);
            case TextTypes.raw:
            case TextTypes.tip:
            case TextTypes.system:
            case TextTypes.jsonWhisper:
            case TextTypes.json:
            case TextTypes.jsonAnnouncement:
                this.writeStringVarInt(this.message);
                break;
            case TextTypes.translation:
            case TextTypes.popup:
            case TextTypes.jukeboxPopup:
                this.writeStringVarInt(this.message);
                for (let i = 0; i < this.parameters.length; ++i) {
                    this.writeStringVarInt(this.parameters[i]);
                }
                break;
        }
        this.writeStringVarInt(this.xuid);
        this.writeStringVarInt(this.platformChatID);
    }
}

module.exports = TextPacket;
