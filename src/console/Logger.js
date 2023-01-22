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

const ConsoleColors = require("../color/ConsoleColors");

class Logger {
	options = {};

	constructor(options = {
		Name: "",
		AllowDebugging: false,
		WithColors: false
	}) {
		this.options = options;
	}

	info() {
		this.log(arguments, "Info", ConsoleColors.blue);
	}

	alert() {
		this.log(arguments, "Alert", ConsoleColors.darkAqua);
	}

	error() {
		this.log(arguments, "Error", ConsoleColors.red)
	}

	debug() {
		if (this.options.AllowDebugging === false) {
			return;
		}
		this.log(arguments, "Debug", ConsoleColors.gray);
	}

	log(msg, name, color) {
		const date = new Date();
		let [seconds, minutes, hours] = [date.getSeconds(), date.getMinutes(), date.getHours()];
		if (this.options.WithColors === true) {
			console.log(`${ConsoleColors.bold}${ConsoleColors.gold}[${this.options.Name}][${name}] ${ConsoleColors.gray}${seconds}:${minutes}:${hours} ${ConsoleColors.darkPurple}>${ConsoleColors.reset}${color}`, ...msg, `\u001b[0m`);
		} else {
			console.log(`[${this.options.Name} ${name}] ${seconds}:${minutes}:${hours} >`, ...msg);
		}
	}
}

module.exports = Logger;
