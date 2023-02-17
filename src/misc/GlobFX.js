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

import * as path from "path";
import { fileURLToPath } from "url";

(() => {
    global.__dirname = (dir) => path.dirname(fileURLToPath(dir));
    global.bbmcPath = path.normalize(__dirname(import.meta.url + path.sep + "../"));
    // global.es6Require = (value) => {let x; let z = import(`..${path.sep}${value}`); z.catch((value) => {throw value;}); z.then((value) => x = value.default); return x;};
    Math.ffmd = (x, z) => {
        let retVal = 0;
        if (x < 0) {
            retVal = ~Math.abs(x);
        } else {
            retVal += x % z;
        }
        return retVal;
    };

    if (process.pkg) {
        global.__dirname = path.dirname(process.execPath);
    }
})();
