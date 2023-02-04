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

const path = require("path");

(() => {
    global.bbmcPath = path.normalize(__dirname);
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
