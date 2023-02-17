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

export default class ContainerOpenPacket extends PacketsBase {
    static id = Identifiers.containerOpen;

    windowID;
    type;
    coordinates;
    runtimeEntityID;

    deserialize() {
        this.windowID = this.readByte();
        this.type = this.readByte();
        this.coordinates = this.readBlockCoordinates();
        this.runtimeEntityID = this.readRuntimeEntityID();
    }

    serialize() {
        this.writeByte(this.windowID);
        this.writeByte(this.type);
        this.writeBlockCoordinates(this.coordinates);
        this.writeRuntimeEntityID(this.runtimeEntityID);
    }
}
