import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { buildAll, loadTokens } from "./build.mjs";

const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const HEX_COLOR = /^#[0-9A-F]{6}([0-9A-F]{2})?$/i;
const MODES = ["light", "dark"];
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3;

const TEXT_PAIRS = [
  ["content", "page"],
  ["content", "surface"],
  ["content-muted", "page"],
  ["content-muted", "surface"],
  ["on-primary", "primary"],
  ["on-accent", "accent"],
  ["on-control", "control"],
  ["on-action-neutral", "action-neutral"],
  ["on-error", "error"],
  ["on-success", "success"],
  ["on-warning", "warning"],
];

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test("every semantic color has a valid light and dark value and an origin", () => {
  const { semantic } = loadTokens().color;
  for (const [name, entry] of Object.entries(semantic)) {
    for (const mode of MODES) {
      assert.match(entry[mode], HEX_COLOR, `${name}.${mode} is not a hex color`);
    }
    assert.ok(["figma", "sampled", "proposed"].includes(entry.origin), `${name} has no valid origin`);
  }
});

test("committed dist matches a fresh build", () => {
  for (const [file, expected] of Object.entries(buildAll(loadTokens()))) {
    const actual = readFileSync(join(distDir, file), "utf8");
    assert.equal(actual, expected, `dist/${file} is stale, run npm run build`);
  }
});

test("generated theme.css defines every semantic color for both modes", () => {
  const css = readFileSync(join(distDir, "theme.css"), "utf8");
  for (const name of Object.keys(loadTokens().color.semantic)) {
    assert.ok(css.includes(`--color-${name}: var(--ds-${name});`), `missing utility color ${name}`);
    const declarations = css.split(`--ds-${name}:`).length - 1;
    assert.equal(declarations, 3, `--ds-${name} must be declared in light, media dark and data-theme dark`);
  }
});

test("proposed state colors meet WCAG AA for normal text in both modes", () => {
  const { semantic } = loadTokens().color;
  for (const [text, background] of TEXT_PAIRS) {
    if (semantic[background].origin !== "proposed") continue;
    for (const mode of MODES) {
      const ratio = contrast(semantic[text][mode], semantic[background][mode]);
      assert.ok(ratio >= WCAG_AA_NORMAL, `${text} on ${background} (${mode}) is ${ratio.toFixed(2)}:1`);
    }
  }
});

test("Figma-defined pairs meet at least WCAG AA large text; sub-4.5 pairs are reported", (t) => {
  const { semantic } = loadTokens().color;
  const belowNormal = [];
  for (const [text, background] of TEXT_PAIRS) {
    if (semantic[background].origin === "proposed") continue;
    for (const mode of MODES) {
      const ratio = contrast(semantic[text][mode], semantic[background][mode]);
      assert.ok(ratio >= WCAG_AA_LARGE, `${text} on ${background} (${mode}) is ${ratio.toFixed(2)}:1`);
      if (ratio < WCAG_AA_NORMAL) belowNormal.push(`${text} on ${background} (${mode}) ${ratio.toFixed(2)}:1`);
    }
  }
  t.diagnostic(`below AA normal text (design-defined): ${belowNormal.join("; ") || "none"}`);
});
