/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const PacketsBase = require("./PacketsBase");
const BinaryStream = require("bbmc-binarystream");
const Identifiers = require("./Identifiers");
const zlib = require("zlib");
const { default: TPromise } = require("thread-promises");

class GamePacket extends PacketsBase {
	static id = Identifiers.game;

	compression = true;
	streams = [];

	async decompress(buffer) {
		return new TPromise(resolve => {
			resolve(this.compression ? zlib.inflateRawSync(buffer) : buffer);
		});
	}

	async compress(buffer) {
		return new TPromise(resolve => {
			resolve(this.compression ? zlib.deflateRawSync(buffer) : buffer);
		});
	}

	async deserialize() {
		let remaining = this.readRemaining();
		let data;

		try {
			data = new BinaryStream(await this.decompress(remaining));
		} catch (e) {
			if (this.compression) {
				this.compression = false;

				data = new BinaryStream(remaining);
			} else {
				console.log(e);
				throw new Error("Error while decompressing zlib");
			}
		} finally {
			this.compression = true;
		}

		while (data.feos() === false) {
			this.streams.push(new BinaryStream(data.read(data.readVarInt())));
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
		this.write(await this.compress(stream.buffer));
	}

	async serializeA() {
		this.reset();
		this.writeUnsignedByte(this.getID());
		await this.serialize();
		this.serialized = true;
	}
}

module.exports = GamePacket;
