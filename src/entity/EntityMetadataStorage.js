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

const MetadataListProperties = require("../network/constants/MetadataListProperties");
const MetadataPropertyTypes = require("../network/constants/MetadataPropertyTypes");
const MetadataEntry = require("./MetadataEntry");

class EntityMetadataStorage {
    metadata;

    constructor() {
        this.metadata = {};
    }

    getEntry(key) {
        if (key in this.metadata) {
            return this.metadata[key];
        }
        return null;
    }

    setEntry(key, value, entryType) {
        let entry = new MetadataEntry();
        entry.value = value;
        entry.type = entryType;
        this.metadata[key] = entry;
    }

    getByte(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.byte) {
            return entry.value;
        }
        return null;
    }

    setByte(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.byte);
    }

    getShort(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.short) {
            return entry.value;
        }
        return null;
    }

    setShort(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.short);
    }

    getInt(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.int) {
            return entry.value;
        }
        return null;
    }

    setInt(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.int);
    }

    getFloat(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.float) {
            return entry.value;
        }
        return null;
    }

    setFloat(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.float);
    }

    getString(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.str) {
            return entry.value;
        }
        return null;
    }

    setString(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.str);
    }

    getNBT(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.nbt) {
            return entry.value;
        }
        return null;
    }

    setNBT(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.nbt);
    }

    getVec3i(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.vec3i) {
            return entry.value;
        }
        return null;
    }

    setVec3i(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.vec3i);
    }

    getLong(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.long) {
            return entry.value;
        }
        return null;
    }

    setLong(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.long);
    }

    getVec3f(key) {
        let entry = this.getEntry(key);
        if (entry !== null && entry.type === MetadataPropertyTypes.vec3f) {
            return entry.value;
        }
        return null;
    }

    setVec3f(key, value) {
        this.setEntry(key, value, MetadataPropertyTypes.vec3f);
    }

    getFlag(flag, extended = false) {
        let flags = this.getLong(extended ? MetadataListProperties.flagsExtended : MetadataListProperties.flags);
        if (flags !== null) {
            return (flags & (1n << BigInt(flag))) > 0n;
        }
        return null;
    }

    setFlag(flag, value, extended = false) {
        let currentValue = this.getFlag(flag, extended);
        if (currentValue == null || currentValue != value) {
            let flags = currentValue === null ? 0n : this.getLong(extended ? MetadataListProperties.flagsExtended : MetadataListProperties.flags);
            this.setLong(extended ? MetadataListProperties.flagsExtended : MetadataListProperties.flags, flags ^ (1n << BigInt(flag)));
        }
    }
}

module.exports = EntityMetadataStorage;
