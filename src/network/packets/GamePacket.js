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

const PacketsBase = require("./PacketsBase");
const BinaryStream = require("bbmc-binarystream");
const Identifiers = require("./Identifiers");
const zlib = require("zlib");

class GamePacket extends PacketsBase {
    static id = Identifiers.game;

    useCompression = false;
    streams = [];

    async decompress(buffer) {
        return new Promise((resolve) => {
            resolve(zlib.inflateRawSync(buffer));
        });
    }

    async compress(buffer) {
        return new Promise((resolve) => {
            resolve(zlib.deflateRawSync(buffer));
        });
    }

    async deserialize() {
        try {
            let remaining = this.readRemaining();
            let data;
            if (this.useCompression) {
                data = new BinaryStream(await this.decompress(remaining));
            } else {
                data = new BinaryStream(remaining);
            }
            while (data.feos() === false) {
                this.streams.push(new BinaryStream(data.read(data.readVarInt())));
            }
        } catch (e) {
            console.log(e);
            throw new Error("Error while decompressing zlib");
        }
    }

    async deserializeA() {
        this.offset = 1;
        await this.deserialize();
    }

    async serialize() {
        let stream = new BinaryStream();
        for (let i = 0; i < this.streams.length; ++i) {
            stream.writeVarInt(this.streams[i].buffer.length);
            stream.write(this.streams[i].buffer);
        }
        this.write(this.useCompression ? (await this.compress(stream.buffer)) : stream.buffer);
    }

    async serializeA() {
        this.reset();
        this.writeUnsignedByte(this.getID());
        await this.serialize();
        this.serialized = true;
    }
}

module.exports = GamePacket;
