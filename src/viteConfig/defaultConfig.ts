import type { UserConfig } from "vite";
import { createConfig, type ConfigOptions } from "./createConfig";

export const defaultConfig = (options: ConfigOptions = {}): UserConfig =>
  createConfig(options);
