import { ffmpeg } from "@assetpack/core/ffmpeg";
import type { PixiAssetPack } from "@assetpack/core/pixi";
import { defaultPipesConfig } from "./defaultPipesConfig";

export const playablePipesConfig: PixiAssetPack = {
  ...defaultPipesConfig,
  compression: {
    png: true,
    webp: false,
    avif: false,
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
    ],
  }),
};
