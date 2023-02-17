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

import Identifiers from "./Identifiers.js";
import PacketsBase from "./PacketsBase.js";
import MinecraftBinaryStream from "../../../misc/MinecraftBinaryStream.js";

export default class LoginPacket extends PacketsBase {
    static id = Identifiers.login;

    protocolVersion;
    loginTokens;

    deserialize() {
        this.protocolVersion = this.readIntBE();
        let stream = new MinecraftBinaryStream(this.readByteArrayVarInt());
        this.loginTokens = stream.readLoginTokens();
    }

    serialize() {
        this.writeIntBE(this.protocolVersion);
        let stream = new MinecraftBinaryStream();
        stream.writeLoginTokens(this.loginTokens);
        this.writeByteArrayVarInt(stream.buffer);
    }
}
