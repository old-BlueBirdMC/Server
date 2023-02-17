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

export default class SetLocalPlayerAsInitalizedPacket extends PacketsBase {
    static id = Identifiers.setLocalPlayerAsInitalized;

    runtimeEntityID;

    deserialize() {
        this.runtimeEntityID = this.readRuntimeEntityID();
    }

    serialize() {
        this.writeRuntimeEntityID(this.runtimeEntityID);
    }
}
