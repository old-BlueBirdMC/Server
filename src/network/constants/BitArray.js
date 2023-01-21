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

class BitArray {
	static v1  =  [1, 32, 128, 0];
	static v2  =  [2, 16, 256, 0];
	static v3  =  [3, 10, 410, 2];
	static v4  =  [4, 8, 512, 0];
	static v5  =  [5, 6, 683, 2];
	static v6  =  [6, 5, 820, 2];
	static v8  =  [8, 4, 1024, 0];
	static v16 =  [16, 2, 2048, 0];
}

module.exports = BitArray;