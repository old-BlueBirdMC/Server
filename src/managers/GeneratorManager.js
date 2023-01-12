/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

class GeneratorManager {
    blockStatesMap;
    generators;

    constructor(blockStatesMap) {
        this.blockStatesMap = blockStatesMap;
        this.generators = {};
    }

    getGenerator(name) {
        if (name in this.generators) {
            return this.generators[name];
        }
        return null;
    }

    registerGenerator(generator) {
        if (generator.generatorName in this.generators) {
            return null;
        }
        this.generators[generator.generatorName] = new generator(this.blockStatesMap);
    }

    unregisterGenerator(name) {
        if (name in this.generators) {
            delete this.generators[name];
        }
    }
}

module.exports = GeneratorManager;