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

class Command {
	name;
	description;
	aliases;
	overloads;

	constructor(name, description, aliases = [], overloads = []) {
		this.name = name;
		this.description = description;
		this.aliases = aliases;
		this.overloads = overloads;
	}

	async run(sender, writtenCommand, args) {}

	getAliases(){
        return this.aliases;
    }
}

module.exports = Command;