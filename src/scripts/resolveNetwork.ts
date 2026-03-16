import * as networkConfigs from "../networkConfigs";

export const resolveNetwork = (name = "develop") =>
  networkConfigs[name as keyof typeof networkConfigs];
