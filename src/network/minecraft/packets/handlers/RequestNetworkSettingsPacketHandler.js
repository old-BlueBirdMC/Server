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

import CompressionAlgorithmTypes from "../../constants/CompressionAlgorithmTypes.js";
import CompressionThresholdTypes from "../../constants/CompressionThresholdTypes.js";
import NetworkSettingsPacket from "../NetworkSettingsPacket.js";
import HandlersBase from "./HandlersBase.js";

export default class RequestNetworkSettingsPacketHandler extends HandlersBase {
    async startHandling(packet) {
        await super.startHandling(packet);
        let player = this.player;

        player.checkProtocol(packet.protocolVersion);

        let networkSettings = new NetworkSettingsPacket();
        networkSettings.threshold = CompressionThresholdTypes.all;
        networkSettings.algorithm = CompressionAlgorithmTypes.zlib;
        networkSettings.clientThrottling = false;
        networkSettings.throttleThreshold = 0;
        networkSettings.throttleScalar = 0.0;
        await networkSettings.sendTo(player);
        player.useCompression = true;
    }
}
