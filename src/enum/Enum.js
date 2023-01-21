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

class Enum {
	constructor(list, values = []) {
		if (values.length !== 0) {
			let i = 0;
			if (this.#hasDuplicatedMember(list)) {
				list = new Set(list);
				list.forEach(element => {
					this[element] = values[i];
					i++;
				});
			} else {
				list.forEach(element => {
					this[element] = values[i];
					i++;
				});
			}
		} else {
			let i = 0;
			if (this.#hasDuplicatedMember(list)) {
				list = new Set(list);
				list.forEach(element => {
					this[element] = i;
					i++;
				});
			} else {
				list.forEach(element => {
					this[element] = i;
					i++;
				});
			}
		}
	}

	#hasDuplicatedMember(list) {
		if (list.length !== new Set(list).size) {
			return true;
		}
		return false;
	}
}

module.exports = Enum;
