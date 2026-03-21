import type { UserConfig } from "vite";
import { createConfig, type ConfigOptions } from "./createConfig";
import { resolveNetwork } from "../scripts/resolveNetwork";
import type { NetworkName } from "@/networkConfigs";

export interface PlayableConfigOptions extends ConfigOptions {
  network?: NetworkName;
}

export const playableConfig = (
  options: PlayableConfigOptions = {},
): UserConfig => {
  const { network = "develop", plugins = [], ...rest } = options;
  const resolved = resolveNetwork(network);

  return createConfig({
    ...rest,
    plugins: [...plugins, ...resolved.plugins],
  });
};
