import fs from "fs/promises";
import path from "path";

import { AssetPack, type AssetPackConfig } from "@assetpack/core";
import { pixiPipes, type PixiAssetPack } from "@assetpack/core/pixi";
import type { Plugin, ResolvedConfig } from "vite";
import { defaultPipesConfig } from "./defaultPipesConfig";
import { generateAssetTypesPipe } from "./generateAssetTypesPipe";

export interface AssetpackOptions {
  entry?: string;
  output?: string;
  generatedDir?: string;
  pixiPipes?: Partial<PixiAssetPack>;
  generateTypes?: boolean;
}

export const assetpackPlugin = (options: AssetpackOptions = {}): Plugin => {
  const {
    entry = "./raw-assets",
    output = "./public/assets",
    generatedDir = "./src/shared/generated",
    generateTypes = true,
  } = options;

  const resolvedGeneratedDir = path.resolve(generatedDir);

  const pipesConfig: PixiAssetPack = {
    ...defaultPipesConfig,
    ...options.pixiPipes,
    manifest: {
      ...defaultPipesConfig.manifest,
      ...options.pixiPipes?.manifest,
      output: path.join(generatedDir, "manifest.json"),
    },
  };

  const apConfig: AssetPackConfig = {
    entry,
    output,
    logLevel: "warn",
    pipes: [
      ...pixiPipes(pipesConfig),
      ...(generateTypes ? [generateAssetTypesPipe()] : []),
    ],
  };

  let mode: ResolvedConfig["command"];
  let ap: AssetPack | undefined;

  return {
    name: "assetpack-plugin",
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
      if (!resolvedConfig.publicDir || apConfig.output !== output) return;
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), "");
      apConfig.output = `.${publicDir}/assets/`;
    },
    buildStart: async () => {
      await fs.mkdir(resolvedGeneratedDir, { recursive: true });

      if (mode === "serve") {
        if (ap) return;
        ap = new AssetPack(apConfig);
        void ap.watch();
      } else {
        await new AssetPack(apConfig).run();
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop();
        ap = undefined;
      }
    },
  };
};
