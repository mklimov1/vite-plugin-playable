import { develop } from "./develop";
import { developInline } from "./develop";

export const networkConfigMap = {
  develop,
  "develop-inline": developInline,
} as const;

export type NetworkName = keyof typeof networkConfigMap;
