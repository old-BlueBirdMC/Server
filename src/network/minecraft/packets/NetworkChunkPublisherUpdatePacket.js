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

export default class NetworkChunkPublisherUpdatePacket extends PacketsBase {
    static id = Identifiers.networkChunkPublisherUpdate;

    position;
    radius;
    savedChunks;

    deserialize() {
        this.position = this.readBlockCoordinates();
        this.radius = this.readVarInt();
        this.savedChunks = [];
        let count = this.readIntLE();
        for (let i = 0; i < count; i++) {
            this.savedChunks.push(this.readVarInt());
            this.savedChunks.push(this.readVarInt());
        }
    }

    serialize() {
        this.writeBlockCoordinates(this.position);
        this.writeVarInt(this.radius);
        this.writeIntLE(this.savedChunks.length);
        for (let i = 0; i < this.savedChunks.length; ++i) {
            this.writeVarInt(this.savedChunks[i]);
            this.writeVarInt(this.savedChunks[i]);
        }
    }
}
