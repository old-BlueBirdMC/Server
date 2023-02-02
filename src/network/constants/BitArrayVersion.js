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
