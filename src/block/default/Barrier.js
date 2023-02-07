const Block = require("../Block");
const Tool = require("../Tool");

class Barrier extends Block {
    maxStack = 64;
    tool = Tool.none;
    blastResistance = 0;
    hardness = 0;
    isLuminant = false;
    isTransparrent = true;
    isFlammable = false;
    catchesFireFromLava = false;

    constructor() {
        super("minecraft:barrier", 0);
    }
}

module.exports = Barrier;
