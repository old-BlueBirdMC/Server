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

const MetadataPropertyTypes = require("../network/constants/MetadataPropertyTypes");
const Metadata = require("../network/types/Metadata");

class EntityMetadataManager {
    #list = {};

    setByte(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.byte, value);
    }

    getByte(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.byte);
    }

    setShort(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.short, value);
    }

    getShort(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.short);
    }

    setInt(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.int, value);
    }

    getInt(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.int);
    }

    setFloat(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.float, value);
    }

    getFloat(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.float);
    }

    setStr(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.str, value);
    }

    getStr(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.str);
    }

    setNBT(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.nbt, value);
    }

    getNBT(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.nbt);
    }

    setVec3i(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.vec3i, value);
    }

    getVec3i(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.vec3i);
    }

    setLong(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.long, value);
    }

    getLong(flag) {
        return this.getFlag(flag, MetadataPropertyTypes.long);
    }

    setVec3f(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.vec3f, value);
    }

    setFlag(flag, propertyTypeID, value) {
        this.#list[flag + ":" + propertyTypeID] = new Metadata();
        this.#list[flag + ":" + propertyTypeID].propertyType = propertyTypeID;
        this.#list[flag + ":" + propertyTypeID].value = value;
    }

    getFlag(flag, propertyTypeID) {
        if (!(flag + ":" + propertyTypeID in this.#list)) {
            return null;
        }
        if (!(this.#list[flag + ":" + propertyTypeID].propertyType === propertyTypeID)) {
            return null;
        }
        return this.#list[flag + ":" + propertyTypeID].value;
    }

    // long extended, long
    setEntityFlag(flag, value, extended = false) {
        let val = this.getEntityFlag(flag, extended);
        if (val === undefined || val === null || val !== value) {
            let flags;
            if ( val === undefined || val === null) {
                flags = 0n;
            } else if (extended === false) {
                flags = BigInt(this.getLong(0));
            } else {
                flags = BigInt(this.getLong(92));
            }
            if (extended === false) {
                flags ^= (1n << BigInt(flag));
                this.setLong(0, flags);
            } else {
                flags ^= (1n << BigInt(flag));
                this.setLong(92, flags);
            }
        }
    }

    getEntityFlag(flag, extended = false) {
        let flags;
        if (extended === false) {
            flags = this.getLong(0);
        } else {
            flags = this.getLong(92);
        }
        if (flags !== undefined && flags !== null) {
            return (flags & (1n << BigInt(flag))) > 0;
        }
    }

    getAllWithoutEditing() {
        return this.#list;
    }

    getAllObjectEntries() {
        return Object.entries(this.#list);
    }

    getLength() {
        return this.getAllObjectEntries().length;
    }
}

module.exports = EntityMetadataManager;
