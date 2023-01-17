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

const MetadataListProperties = require("../network/constants/MetadataListProperties");
const MetadataPropertyTypes = require("../network/constants/MetadataPropertyTypes");
const Metadata = require("../network/types/Metadata");
const MetadataEntry = require("../network/types/MetadataEntry");

class EntityMetadataManager {
    #list;

    constructor() {
        this.#list = [];
    }

    setByte(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.byte, value);
    }

    setShort(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.short, value);
    }

    setInt(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.int, value);
    }

    setFloat(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.float, value);
    }

    setStr(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.str, value);
    }

    setNBT(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.nbt, value);
    }

    setVec3i(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.vec3i, value);
    }

    setLong(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.long, value);
    }

    setVec3f(flag, value) {
        this.setFlag(flag, MetadataPropertyTypes.vec3f, value);
    }

    setFlag(flag, propertyTypeID, value) {
        let val = new MetadataEntry();
        val.typeID = flag;
        val.metadata = new Metadata();
        val.metadata.propertyType = propertyTypeID;
        val.metadata.value = value;
        this.#list.push(val);
    }

    #getLong(flag) { // temp until i say so
        let entry = this.#list[flag];
        if (typeof entry !== "undefined") {
            if (entry.metadata.typeID === flag) {
                if (entry.metadata.propertyType !== MetadataPropertyTypes.long) {
                    throw new Error("Recevied unknown typeid of metadata property type. (EntityMetadataManager)");
                } else {
                    return entry.metadata.value;
                }
            }
        }
        return null;
    }

    setEntityFlag(flag, value) {
        let extended = flag < 64 ? false : true;
        let val = this.getEntityFlag(flag, extended);
        if (val === null || val !== value) {
            let flags;
            if (val === null) {
                flags = 0n;
            } else if (extended === false) {
                flags = BigInt(this.#getLong(MetadataListProperties.flags));
            } else {
                flags = BigInt(this.#getLong(MetadataListProperties.flagsExtended));
            }
            if (extended === false) {
                flags ^= (1n << BigInt(flag));
                // console.log(flags);
                this.setLong(MetadataListProperties.flags, flags);
            } else {
                flags ^= (1n << BigInt(flag));
                this.setLong(MetadataListProperties.flagsExtended, flags);
            }
        }
    }

    getEntityFlag(flag, extended = false) {
        let flags;
        if (extended === false) {
            flags = this.#getLong(MetadataListProperties.flags);
        } else {
            flags = this.#getLong(MetadataListProperties.flagsExtended);
        }
        if (flags !== null) {
            return (BigInt(flags) & (1n << BigInt(flag))) > 0;
        }
        return null;
    }

    getAll() {
        // console.log(this.#list);
        return this.#list;
    }
}

module.exports = EntityMetadataManager;
