import type { Plugin } from "vite";
import {
  ctaPlugin,
  scriptsPlugin,
  sizeReportPlugin,
  inlineAssetsPlugin,
} from "./../plugins";
import type { NetworkConfig } from "./../types/networkConfig";
import { viteSingleFile } from "vite-plugin-singlefile";
import zipPack from "vite-plugin-zip-pack";
const MAX_SIZE = 5 * 1024 * 1024;

interface Options extends Omit<NetworkConfig, "plugins"> {
  plugins?: Plugin[];
  inline?: boolean;
  zip?: boolean;
  sizeReport?: boolean;
}

export const createNetworkConfig = (config: Options): NetworkConfig => {
  const plugins = [
    ctaPlugin(config.ctaFunction),
    scriptsPlugin(config.scripts),
    ...(config.plugins ?? []),
  ];

  if (config.inline !== false) {
    plugins.push(viteSingleFile() as Plugin);
    plugins.push(inlineAssetsPlugin() as Plugin);
  }
  if (config.zip !== false) {
    plugins.push(
      zipPack({
        outDir: "zips",
        outFileName: `${config.name}.zip`,
      }) as Plugin,
    );
  }
  if (config.sizeReport !== false) plugins.push(sizeReportPlugin());

  return {
    ...config,
    plugins,
    maxSize: config.maxSize || MAX_SIZE,
  };
};
