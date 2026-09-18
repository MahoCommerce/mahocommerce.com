// Renders the theme stage to PNG frames. Playwright comes from the maho repo:
//   cd /path/to/maho && node /path/to/maho-home/tools/theme-stage/render.mjs OUT_DIR
// SPDX-FileCopyrightText: 2026 Maho <https://mahocommerce.com>
// SPDX-License-Identifier: OSL-3.0
import { createRequire } from "node:module";
const { chromium } = createRequire(process.cwd() + "/")("playwright");
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(process.argv[2] ?? "frames");
mkdirSync(out, { recursive: true });
const here = dirname(fileURLToPath(import.meta.url));

const themes = [
  ["default", "Default"], ["fashion", "Fashion"], ["beauty", "Beauty"], ["sports", "Sports"],
  ["kids", "Kids"], ["electronics", "Electronics"], ["food", "Food"], ["books", "Books"],
  ["jewelry", "Jewelry"], ["home", "Home"], ["garden", "Garden"],
];
const lightOnly = new Set(["food", "kids"]);
const FPS = 10, HOLD_LIGHT = 1.3, HOLD_DARK = 0.9, FADE = 0.45;

// One entry per shown state: light, then dark when it exists.
const states = [];
themes.forEach(([theme, name], i) => {
  states.push({ theme, mode: "light", name, index: i + 1, total: themes.length, hold: lightOnly.has(theme) ? HOLD_LIGHT + HOLD_DARK : HOLD_LIGHT });
  if (!lightOnly.has(theme)) states.push({ theme, mode: "dark", name, index: i + 1, total: themes.length, hold: HOLD_DARK });
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await page.goto("file://" + resolve(here, "stage.html"));
await page.evaluate(() => document.fonts.ready);

let n = 0;
const shoot = async (state, next, t) => {
  await page.evaluate(s => window.setFrame(s), { ...state, next, t });
  await page.screenshot({ path: `${out}/${String(n++).padStart(4, "0")}.png` });
};
for (let i = 0; i < states.length; i++) {
  const s = states[i], next = states[(i + 1) % states.length];
  for (let k = 0; k < Math.round(s.hold * FPS); k++) await shoot(s, null, 0);
  const steps = Math.round(FADE * FPS);
  for (let k = 1; k < steps; k++) await shoot(s, next, k / steps);
}
await browser.close();
console.log(`${n} frames at ${FPS} fps -> ${out}`);
