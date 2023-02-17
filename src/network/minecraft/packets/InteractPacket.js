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

import InteractActions from "../constants/InteractActions.js";
import Identifiers from "./Identifiers.js";
import PacketsBase from "./PacketsBase.js";

export default class InteractPacket extends PacketsBase {
    static id = Identifiers.interact;

    actionID;
    targetRuntimeEntityID;
    position;

    deserialize() {
        this.actionID = this.readUnsignedByte();
        this.targetRuntimeEntityID = this.readRuntimeEntityID();
        if (this.actionID === InteractActions.mouseOverEntity || this.actionID === InteractActions.leaveVehicle) {
            this.position = this.readVector3F();
        }
    }

    serialize() {
        this.writeUnsignedByte(this.actionID);
        this.writeRuntimeEntityID(this.targetRuntimeEntityID);
        if (this.actionID === InteractActions.mouseOverEntity || this.actionID === InteractActions.leaveVehicle) {
            this.writeVector3F(this.position);
        }
    }
}
