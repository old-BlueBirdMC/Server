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

const PlayStatus = require("../../constants/PlayStatus");
const ResourcePacksInfoPacket = require("../ResourcePacksInfoPacket");
const HandlersBase = require("./HandlersBase");
const canceller = require("../../../event/canceller");
const Skin = require("../../types/Skin");
const crypto = require("crypto");
const SkinImage = require("../../types/SkinImage");

class LoginPacketHandler extends HandlersBase {
	async startHandling(packet) {
		await super.startHandling(packet);
		this.player.checkProtocol(packet.protocolVersion);

		const [,lClient,] = packet.loginTokens.client.split(".");
		const loginClient = JSON.parse(Buffer.from(lClient, "base64").toString("binary"));
		const lIdentity = JSON.parse(packet.loginTokens.identity.toString('binary'));
		const loginIdentity = lIdentity["chain"].map(data => {
			const [,ldata,] = data.split(".");
			return JSON.parse(Buffer.from(ldata, "base64").toString("binary"));
		});
		this.player.loginClient = loginClient;
		this.player.loginIdentity = loginIdentity;

		this.checkAuth();

		const skin = new Skin();
		skin.skinID = this.player.loginClient.SkinId;
		skin.playFabID = this.player.loginClient.PlayFabId;
		skin.skinResourcePatch = skin.skinResourcePatchFix(this.player.loginClient.SkinResourcePatch)
		skin.skinImage = new SkinImage();
		skin.skinImage.height = this.player.loginClient.SkinImageHeight;
		skin.skinImage.width = this.player.loginClient.SkinImageWidth;
		skin.skinImage.data = Buffer.from(this.player.loginClient.SkinData, "base64");
		skin.animations = []; //arr: handle
		skin.capeImage = new SkinImage();
		skin.capeImage.height = this.player.loginClient.CapeImageHeight;
		skin.capeImage.width = this.player.loginClient.CapeImageWidth;
		skin.capeImage.data = Buffer.from(this.player.loginClient.CapeData, "base64");
		skin.skinGeometry = JSON.stringify(JSON.parse(Buffer.from(this.player.loginClient.SkinGeometryData, "base64").toString()));
		try {
			skin.animationData = JSON.stringify(JSON.parse(Buffer.from(this.player.loginClient.SkinAnimationData, "base64").toString()));
		} catch {
			skin.animationData = "";
		}
		skin.geometryDataEngineVersion = this.player.loginClient.SkinGeometryDataEngineVersion;
		skin.permiumSkin = typeof this.player.loginClient.PermiumSkin !== "undefined" ? this.player.loginClient.PermiumSkin : false;;
		skin.personaSkin = this.player.loginClient.PersonaSkin;
		skin.personaCapeOnClassic = typeof this.player.loginClient.CapeOnClassic !== "undefined" ? this.player.loginClient.CapeOnClassic : false;
		skin.primaryUser = true;
		skin.capeID = this.player.loginClient.CapeId;
		skin.fullID = crypto.randomUUID(); //todo: ??? this.player.loginClient[];
		skin.skinColor = this.player.loginClient.SkinColor;
		skin.armSize = this.player.loginClient.ArmSize;
		skin.personaPieces = this.player.loginClient.PersonaPieces; // array: handle
		skin.pieceTintColors = this.player.loginClient.PieceTintColors; // array: handle
		skin.trusted = this.player.loginClient.TrustedSkin;
		skin.verified = false;
		this.player.skin = skin;

		this.player.updateName(true);

		let ev = {
			player: this.player,
			canceller: new canceller()
		};
		this.server.addEvent(ev, "login");
		if (ev.canceller.isCancelled()) {
			return;
		}

		this.player.sendPlayStatus(PlayStatus.loginSuccess);

		const resourcePacksInfo = new ResourcePacksInfoPacket();
		resourcePacksInfo.mustAccept = false;
		resourcePacksInfo.hasScripts = false;
		resourcePacksInfo.forceServerPacks = false; 
		resourcePacksInfo.behaviorPacks = [];
		resourcePacksInfo.texturePacks = [];
		resourcePacksInfo.sendTo(this.player);
	}

	checkAuth() {//todo
		this.player.xuid = typeof this.player.loginIdentity[2]["extraData"]["XUID"] !== "undefined" ? this.player.loginIdentity[2]["extraData"]["XUID"] : "0".repeat(16);
		this.player.identity = typeof this.player.loginIdentity[2]["extraData"]["identity"] !== "undefined" ? this.player.loginIdentity[2]["extraData"]["identity"] : crypto.randomUUID();
	}
}

module.exports = LoginPacketHandler;