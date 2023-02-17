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

import GameMode from "../../constants/GameMode.js";
import InteractActions from "../../constants/InteractActions.js";
import WindowIDS from "../../constants/WindowIDS.js";
import WindowTypes from "../../constants/WindowTypes.js";
import BlockCoordinates from "../../types/BlockCoordinates.js";
import ContainerOpenPacket from "../ContainerOpenPacket.js";
import HandlersBase from "./HandlersBase.js";

export default class InteractPacketHandler extends HandlersBase {
    async startHandling(packet) {
        await super.startHandling(packet);
        if (packet.actionID === InteractActions.openInventory) {
            const containerOpen = new ContainerOpenPacket();
            switch (this.player.gamemode) {
                case GameMode.survival:
                case GameMode.adventure:
                case GameMode.spectatorSurvival:
                case GameMode.fallback:
                    containerOpen.windowID = WindowIDS.inventory;
                    break;
                case GameMode.creative:
                case GameMode.spectatorCreative:
                    containerOpen.windowID = WindowIDS.creative;
                    break;
            }
            containerOpen.type = WindowTypes.inventory;
            containerOpen.coordinates = new BlockCoordinates();
            containerOpen.coordinates.x = Math.floor(this.player.position.x);
            containerOpen.coordinates.y = Math.floor(this.player.position.y);
            containerOpen.coordinates.z = Math.floor(this.player.position.z);
            containerOpen.runtimeEntityID = this.player.id;
            containerOpen.sendTo(this.player);
        }
    }
}
