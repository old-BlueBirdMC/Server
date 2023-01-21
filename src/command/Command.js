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

class Command {
	name;
	description;
	aliases;
	overloads;
	enums;

	constructor(name, description, aliases = [], overloads = [], enums = []) {
		this.name = name;
		this.description = description;
		this.aliases = aliases;
		this.overloads = overloads;
		this.enums = enums;
	}

	async run(sender, writtenCommand, args) {}

	setPerm(value) {}

	getPerm() {}

	getAliases(){
        return this.aliases;
    }
}

module.exports = Command;