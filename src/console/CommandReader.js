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

import readline from "readline";
import ConsoleCommandSender from "./ConsoleCommandSender.js";

export default class CommandReader {
    server;
    rl;
    consoleCommandSender;

    constructor(server) {
        this.server = server;
        this.rl = readline.createInterface({ input: process.stdin });
        this.consoleCommandSender = new ConsoleCommandSender(this.server);
    }

    handle() {
        this.rl.on("line", async (input) => {
            this.server.commandsList.dispatch(this.consoleCommandSender, input);
        });
    }
}
