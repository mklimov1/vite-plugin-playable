import { defineConfig } from "vite";
import { resolveNetwork } from "../src/scripts";

export default defineConfig(({ mode }) => ({
  plugins: resolveNetwork(mode).plugins,
}));
