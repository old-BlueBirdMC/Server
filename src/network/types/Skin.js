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

class Skin {
	skinID;
	playFabID;
	skinResourcePatch;
	skinImage;
	animations;
	capeImage;
	skinGeometry;
	animationData;
	geometryDataEngineVersion;
	permiumSkin;
	personaSkin;
	personaCapeOnClassic;
	primaryUser;
	capeID;
	fullID;
	skinColor;
	armSize;
	personaPieces;
	pieceTintColors;
	trusted;
	verified;

	validate() {
		let maxSkinImageWidth = 32;
		let maxSkinImageHeight = 64;
		if (this.skinImage.width == 64) {
			maxSkinImageWidth = 64 * 8;
		} else if (this.skinImage.width == 32) {
			maxSkinImageWidth = 32 * 16;
		}
		if (this.skinImage.height == 64) {
			maxSkinImageHeight = 64 * 8;
		} else if (this.skinImage.height == 32) {
			maxSkinImageHeight = 32 * 16;
		}
		if (this.skinImage.data.length < this.skinImageHeight * this.skinImageWidth * 4 || this.skinImage.data.length > maxSkinImageHeight * maxSkinImageWidth * 4) {
			throw new Error("Invalid skinData size");
		}
	}

	skinResourcePatchFix(patch) {
		let parseRP = JSON.parse(Buffer.from(patch, "base64").toString());
		if (typeof parseRP !== "object" || typeof parseRP["geometry"] !== "object") {
			patch = this.genSkinRP();
		}
		return JSON.stringify(patch);
	}

	genSkinRP() {
		return {
			geometry: {
				default: "geometry.humanoid.customSlim"
			}
		};
	}
}

module.exports = Skin;
