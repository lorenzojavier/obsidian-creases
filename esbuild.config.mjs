import { config } from "dotenv";
import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

import manifest from "./manifest.json" assert { type: "json" };

config();

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";
let outdir = "./";
if (!prod) {
  const vaultDir =
    process.env.REAL === "1" ? process.env.REAL_VAULT : process.env.TEST_VAULT;
  outdir = `${vaultDir}.obsidian/plugins/${manifest.id}`;
}

console.info(`\nSaving plugin to ${outdir}\n`);

esbuild
  .build({
    banner: {
      js: banner,
    },
    minify: prod ? true : false,
    entryPoints: ["src/main.ts", "src/styles.css"],
    bundle: true,
    external: [
      "obsidian",
      "electron",
      "codemirror",
      "@codemirror/closebrackets",
      "@codemirror/commands",
      "@codemirror/fold",
      "@codemirror/gutter",
      "@codemirror/history",
      "@codemirror/language",
      "@codemirror/rangeset",
      "@codemirror/rectangular-selection",
      "@codemirror/search",
      "@codemirror/state",
      "@codemirror/stream-parser",
      "@codemirror/text",
      "@codemirror/view",
      ...builtins,
    ],
    format: "cjs",
    watch: !prod,
    target: "es2016",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    outdir: outdir,
  })
  .catch(() => process.exit(1));
