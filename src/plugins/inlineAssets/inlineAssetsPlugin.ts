import {
  readFileSync,
  writeFileSync,
  readdirSync,
  unlinkSync,
  rmdirSync,
} from "node:fs";
import { join, extname } from "node:path";
import type { Plugin } from "vite";
import { buildRuntimeScript } from "./buildRuntimeScript";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
};

const FONT_EXTS = new Set([".woff2", ".ttf", ".woff"]);

export const inlineAssetsPlugin = (): Plugin => ({
  name: "inline-assets-plugin",
  enforce: "post",
  closeBundle() {
    const outDir = (this as any).config?.build?.outDir ?? "dist";
    const assetsDir = join(outDir, "assets");

    const files = safeGetFiles(assetsDir);
    if (!files.length) return;

    const assetMap: Record<string, string> = {};
    const fonts: { family: string; dataUrl: string }[] = [];

    for (const filePath of files) {
      const relativePath = filePath
        .slice(assetsDir.length + 1)
        .replace(/\\/g, "/");
      const ext = extname(filePath).toLowerCase();
      const mime = MIME[ext];
      if (!mime) continue;

      const dataUrl = `data:${mime};base64,${readFileSync(filePath).toString("base64")}`;

      assetMap[`assets/${relativePath}`] = dataUrl;

      if (FONT_EXTS.has(ext)) {
        const family = relativePath
          .split("/")
          .pop()!
          .replace(/\.[^.]+$/, "");
        fonts.push({ family, dataUrl });
      }

      unlinkSync(filePath);
    }

    cleanEmptyDirs(assetsDir);

    const fontStyles = fonts
      .map(
        (f) => `@font-face{font-family:"${f.family}";src:url("${f.dataUrl}");}`,
      )
      .join("");

    const jsonB64 = Buffer.from(JSON.stringify(assetMap)).toString("base64");
    const runtimeScript = buildRuntimeScript(jsonB64);

    const htmlPath = join(outDir, "index.html");
    let html = readFileSync(htmlPath, "utf-8");
    const injection =
      (fontStyles ? `<style>${fontStyles}</style>` : "") + runtimeScript;
    html = html.replace("<head>", "<head>" + injection);
    writeFileSync(htmlPath, html, "utf-8");
  },
});

function safeGetFiles(dir: string): string[] {
  try {
    return getAllFiles(dir);
  } catch {
    return [];
  }
}

function getAllFiles(dir: string, result: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, result);
    } else {
      result.push(fullPath);
    }
  }
  return result;
}

function cleanEmptyDirs(dir: string) {
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) cleanEmptyDirs(join(dir, entry.name));
    }
    if (readdirSync(dir).length === 0) rmdirSync(dir);
  } catch {}
}
