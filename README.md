# @mklimov1/vite-game-forge

## Install

```bash
npm ci
```

## Usage

```ts
// vite.config.ts
import { playableConfig } from "@mklimov1/vite-game-forge";

export default ({ mode }) => playableConfig({ network: mode });
```

## With Assetpack

```bash
npm i -D @assetpack/core
```

```ts
import { playableConfig } from "@mklimov1/vite-game-forge";
import {
  assetpackPlugin,
  playablePipesConfig,
} from "@mklimov1/vite-game-forge/assetpack";

export default ({ mode }) =>
  playableConfig({
    network: mode,
    plugins: [assetpackPlugin({ pixiPipes: playablePipesConfig })],
  });
```

## Build

```bash
vite build --mode develop
vite build --mode develop-inline
```

## Infra CLI

```bash
npx infra-init              # default configs
npx infra-init --playable   # playable ad configs
npx infra-init --force      # overwrite existing
```
