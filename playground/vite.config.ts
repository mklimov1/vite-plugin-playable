import { playableConfig } from "../src";
import { NetworkName } from "../src/networkConfigs";

export default ({ mode }: { mode: string }) =>
  playableConfig({
    network: mode as NetworkName,
  });
