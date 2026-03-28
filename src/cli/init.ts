#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INFRA_DIR = join(__dirname, "..", "..", "infra");
const TARGET_DIR = process.cwd();
const INFRA_TARGET = join(TARGET_DIR, ".infra");
const force = process.argv.includes("--force");
const preset = process.argv.includes("--playable") ? "playable" : "default";

const ROOT_FILES = [
  ".gitignore",
  ".prettierignore",
  ".lintstagedrc",
  ".prettierrc",
];

const REQUIRED_DEPS = [
  "@eslint/js",
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-import",
  "eslint-plugin-prettier",
  "typescript-eslint",
  "prettier",
];

const checkDeps = () => {
  const missing = REQUIRED_DEPS.filter(
    (dep) => !existsSync(join(TARGET_DIR, "node_modules", dep)),
  );

  if (missing.length) {
    console.log(`\n  ⚠️  Missing dependencies:\n`);
    console.log(`  npm i -D ${missing.join(" ")}\n`);
  }
};

const patchTsconfig = () => {
  const tsconfigPath = join(INFRA_TARGET, "tsconfig.json");
  if (!existsSync(tsconfigPath)) return;

  let content = readFileSync(tsconfigPath, "utf-8");

  if (content.includes("globals.d.ts")) return;

  content = content.replace(
    /("include"\s*:\s*\[)(.*?)(\])/s,
    `$1$2, "globals.d.ts"$3`,
  );

  writeFileSync(tsconfigPath, content, "utf-8");
  console.log("  ✅ tsconfig.json — added globals.d.ts to include");
};

const copyDir = (dir: string) => {
  for (const file of readdirSync(dir)) {
    if (ROOT_FILES.includes(file)) {
      copyFile(join(dir, file), join(TARGET_DIR, file));
    } else {
      copyFile(join(dir, file), join(INFRA_TARGET, file));
    }
  }
};

const copyFile = (src: string, dest: string) => {
  const name = dest.replace(TARGET_DIR + sep, "");

  if (!force && existsSync(dest)) {
    console.log(`  ⏭  ${name} — exists, use --force to overwrite`);
    return;
  }

  cpSync(src, dest);
  console.log(`  ✅ ${name}`);
};

mkdirSync(INFRA_TARGET, { recursive: true });

copyDir(join(INFRA_DIR, "shared"));

if (preset === "playable") {
  copyDir(join(INFRA_DIR, "playable"));
  patchTsconfig();
}

checkDeps();

console.log(`\n  Done! (preset: ${preset})\n`);
