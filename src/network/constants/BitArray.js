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

const BitArrayVersion = require("./BitArrayVersion");

class BitArray {
	static v1 = new BitArrayVersion(1, 32, 128, 0, 3);
	static v2 = new BitArrayVersion(2, 16, 256, 0, 5);
	static v3 = new BitArrayVersion(3, 10, 410, 2, 7);
	static v4 = new BitArrayVersion(4, 8, 512, 0, 9);
	static v5 = new BitArrayVersion(5, 6, 683, 2, 11);
	static v6 = new BitArrayVersion(6, 5, 820, 2, 13);
	static v8 = new BitArrayVersion(8, 4, 1024, 0, 17);
	static v16 = new BitArrayVersion(16, 2, 2048, 0, 33);
}

module.exports = BitArray;