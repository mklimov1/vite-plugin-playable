import { ffmpeg } from "@assetpack/core/ffmpeg";
import type { PixiAssetPack } from "@assetpack/core/pixi";

export const defaultPipesConfig: PixiAssetPack = {
  cacheBust: false,
  texturePacker: {
    addFrameNames: false,
    texturePacker: {
      nameStyle: "relative",
      removeFileExtension: true,
      allowTrim: true,
      allowRotation: true,
    },
    resolutionOptions: {
      resolutions: { default: 1 },
      fixedResolution: "default",
    },
  },
  resolutions: { default: 1 },
  manifest: {
    trimExtensions: true,
    nameStyle: "relative",
    createShortcuts: true,
  },
  compression: {
    png: true,
    webp: true,
    avif: true,
    jpg: true,
    bc7: false,
    astc: false,
    basis: false,
    etc: false,
  },
  audio: ffmpeg({
    inputs: [".mp3", ".ogg", ".wav"],
    outputs: [
      {
        formats: [".mp3"],
        recompress: false,
        options: { audioBitrate: 96, audioChannels: 1, audioFrequency: 48000 },
      },
      {
        formats: [".ogg"],
        recompress: false,
        options: { audioBitrate: 32, audioChannels: 1, audioFrequency: 22050 },
      },
    ],
  }),
};
