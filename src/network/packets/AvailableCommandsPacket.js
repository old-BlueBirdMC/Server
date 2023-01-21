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

class AvailableCommandsPacket extends PacketsBase {
	static id = Identifiers.availableCommands;

	enumValues = [];
	suffixes = [];
	enums = [];
	commandData = [];
	dynamicEnums = [];
	enumConstraints = [];

	deserialize() {
		for (let i = 0; i < this.readVarInt(); ++i) {
			this.enumValues.push(this.readStringVarInt());
		}
		for (let i = 0; i < this.readVarInt(); ++i) {
			this.suffixes.push(this.readStringVarInt());
		}
		for (let i = 0; i < this.readVarInt(); ++i) {
			this.enums.push(this.readCommandEnum(this.enumValues));
		}
		for (let i = 0; i < this.readVarInt(); ++i) {
			this.commandData.push(this.readCommandData(this.enums, this.dynamicEnums, this.suffixes));
		}
		for (let i = 0; i < this.readVarInt(); ++i) {
			this.dynamicEnums.push(this.readDynamicCommandEnum());
		}
		for (let i = 0; i < this.readVarInt(); ++i) {
			this.enumConstraints.push(this.readCommandEnumConstraint());
		}
	}

	serialize() {
		this.writeVarInt(this.enumValues.length);
		this.enumValues.forEach(value => {
			this.writeStringVarInt(value);
		});
		this.writeVarInt(this.suffixes.length);
		this.suffixes.forEach(value => {
			this.writeStringVarInt(value);
		});
		this.writeVarInt(this.enums.length);
		this.enums.forEach(value => {
			this.writeCommandEnum(value, this.enumValues);			
		});
		this.writeVarInt(this.commandData.length);
		this.commandData.forEach(value => {
			this.writeCommandData(value, this.enums, this.dynamicEnums, this.suffixes);
		});
		this.writeVarInt(this.dynamicEnums.length);
		this.dynamicEnums.forEach(value => {
			this.writeDynamicCommandEnum(value);
		});
		this.writeVarInt(this.enumConstraints.length);
		this.enumConstraints.forEach(value => {
			this.writeCommandEnumConstraint(value);
		});
	}
}

module.exports = AvailableCommandsPacket;