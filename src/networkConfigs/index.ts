import { develop } from "./develop";
import { developInline } from "./develop";
import { ironsource } from "./ironsource";

export const networkConfigMap = {
  develop,
  "develop-inline": developInline,
  ironsource,
} as const;

export type NetworkName = keyof typeof networkConfigMap;
