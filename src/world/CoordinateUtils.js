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

export default class CoordinateUtils {
    static hashXZ(x, z) {
        return (BigInt(x & 0xffffffff) << 16n) | BigInt(z & 0xffffffff);
    }

    static unhashXZ(xz) {
        return [BigInt.asIntN(32, xz << 16n), BigInt.asIntN(32, xz & 0xffffffff)];
    }
}
