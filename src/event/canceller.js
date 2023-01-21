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

class canceller {
	#cancel = false;

	cancel() {
		this.#cancel = true;
	}

	uncancel() {
		this.#cancel = false;
	}

	isCancelled() {
		if (this.#cancel === true) {
			return true;
		}
		return false;
	}
}

module.exports = canceller;