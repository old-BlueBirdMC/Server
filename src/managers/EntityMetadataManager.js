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
    createFlag(flag, propertyTypeID, value) {
        let val = new MetadataEntry();
        val.typeID = flag;
        val.metadata = new Metadata();
        val.metadata.propertyType = propertyTypeID;
        val.metadata.value = value;
        return val;
    }

    getLong(flag, list) { // temp until i say so
        let entry = typeof list !== "undefined" ? (value.length > 0 ? list[flag] : undefined) : undefined;
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

    createEntityFlag(list, flag, value) {
        let listGT;
        let extended = flag < 64 ? false : true;
        let val = this.getEntityFlag(flag, extended);
        if (val === null || val !== value) {
            let flags;
            if (val === null) {
                flags = 0n;
            } else if (extended === false) {
                flags = BigInt(this.getLong(MetadataListProperties.flags, list));
            } else {
                flags = BigInt(this.getLong(MetadataListProperties.flagsExtended, list));
            }
            if (extended === false) {
                flags ^= (1n << BigInt(flag));
                // console.log(flags);
                listGT = this.createFlag(MetadataListProperties.flags, MetadataPropertyTypes.long, flags);
            } else {
                flags ^= (1n << BigInt(flag));
                listGT = this.createFlag(MetadataListProperties.flagsExtended, MetadataPropertyTypes.long, flags);
            }
        }
        return listGT !== undefined ? listGT : null;
    }

    getEntityFlag(flag, extended = false) {
        let flags;
        if (extended === false) {
            flags = this.getLong(MetadataListProperties.flags);
        } else {
            flags = this.getLong(MetadataListProperties.flagsExtended);
        }
        if (flags !== null) {
            return (BigInt(flags) & (1n << BigInt(flag))) > 0;
        }
        return null;
    }
}

module.exports = EntityMetadataManager;
