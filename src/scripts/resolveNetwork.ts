import { networkConfigMap, type NetworkName } from "../networkConfigs";

export const resolveNetwork = (name: NetworkName = "develop") => {
  return networkConfigMap[name] ?? networkConfigMap.develop;
};
