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

class BitArrayVersion {
    bitsPerBlock;
    blocksPerWord;
    wordsPerChunk;
    paddingSize;
    header;

    constructor(bitsPerBlock, blocksPerWord, wordsPerChunk, paddingSize, header) {
        this.bitsPerBlock = bitsPerBlock;
        this.blocksPerWord = blocksPerWord;
        this.wordsPerChunk = wordsPerChunk;
        this.paddingSize = paddingSize;
        this.header = header;
    }
}

module.exports = BitArrayVersion;
