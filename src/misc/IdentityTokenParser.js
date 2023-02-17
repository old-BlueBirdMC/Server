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

export default class IdentityTokenParser {
    token;
    usingAccount;
    fixatedData;
    fixatedExtraData;
    xuid;
    realName;
    identity;

    constructor(token) {
        this.token = token;
        this.fixatedData = [];
        const parsedToken = JSON.parse(this.token.toString("binary"));
        const mappedIdentityData = parsedToken["chain"].map((receivedData) => {
            const [, splittedData] = receivedData.split(".");
            return JSON.parse(Buffer.from(splittedData, "base64").toString("binary"));
        });
        this.fixatedData = mappedIdentityData;
        if (typeof mappedIdentityData[2] !== "undefined") {
            this.fixatedExtraData = mappedIdentityData[2].extraData;
            this.usingAccount = true;
        } else {
            this.fixatedExtraData = mappedIdentityData[0].extraData;
            this.usingAccount = false;
        }
        this.xuid = this.fixatedExtraData.XUID;
        this.realName = this.fixatedExtraData.displayName;
        this.identity = this.fixatedExtraData.identity;
    }
}
