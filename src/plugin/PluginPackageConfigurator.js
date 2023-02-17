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

import ServerInfo from "../ServerInfo.js";

export default class PluginPackageConfigurator {
    content;
    name;
    main;
    author;
    description;
    version;
    apiVersion;

    constructor(content) {
        this.content = content;
        this.name = typeof this.content["name"] !== "undefined" ? this.content["name"] : "";
        this.main = typeof this.content["main"] !== "undefined" ? this.content["main"] : "";
        this.author = typeof this.content["author"] !== "undefined" ? this.content["author"] : "";
        this.description = typeof this.content["description"] !== "undefined" ? this.content["description"] : "";
        this.version = typeof this.content["version"] !== "undefined" ? this.content["version"] : "";
        this.apiVersion = typeof this.content["api"] !== "undefined" ? this.content["api"] : "";
    }

    validate() {
        if (this.name.length <= 0) {
            throw `Cant load a plugin with no name, there is no name inside of it`;
        }
        if (this.name.length <= 0) {
            throw `Cant load plugin ${this.name}, there is no main inside of it`;
        }
        if (this.description.length <= 0) {
            throw `Cant load plugin ${this.name}, due to incompatible api version (${apiVersion})`;
        }
        if (this.version.length <= 0) {
            throw `Cant load plugin ${this.name}, due to incompatible api version (${apiVersion})`;
        }
        if (this.apiVersion.length <= 0) {
            throw `Cant load plugin ${this.name}, there is no api version inside \"package.json\"`;
        }
        if (this.apiVersion !== ServerInfo.apiVersion) {
            throw `Cant load plugin ${this.name}, due to incompatible api version (${this.apiVersion})`;
        }
    }
}
