/* Captures the hero of every shipped site in `references` to public/portfolio/.
 *
 *   node docs/portfolio/capture.mjs                  # all of them
 *   node docs/portfolio/capture.mjs spf-group        # just one, while iterating
 *
 * Same shape and the same reasoning as docs/diagrams/render.mjs: Playwright at
 * 2x, downscaled through `sips`, PNG into public/. Run by hand, never part of
 * `npm run build` — these are third-party sites and a build must not depend on
 * four of them being up.
 *
 * Four things here are load-bearing:
 *
 * 1. `slug` matches `references[].slug` in src/lib/sitemap.ts, so the output
 *    filename and the content slot cannot drift apart — the same rule the
 *    /solutions panels follow.
 * 2. `hide` exists because these are other people's sites: cookie banners,
 *    chat bubbles and newsletter modals sit over the hero and cannot be
 *    guessed ahead of time. The loop is capture -> look at the image -> add
 *    the selector -> capture again.
 * 3. We deliberately do NOT run the context with `reducedMotion: "reduce"`.
 *    It would be the obvious way to freeze entrance animations, but a site
 *    whose reveal sets `opacity: 0` in CSS and clears it in JS keyed off the
 *    motion query will screenshot as a blank hero. Waiting is slower and
 *    correct.
 * 4. 1440x900 is a real MacBook viewport, and the output keeps that 16:10.
 *    An earlier pass shot 2:1 to match the reference site being borrowed
 *    from; every hero here is laid out for a full-height window, and 2:1 cut
 *    the subhead off one of them mid-sentence and left a half-row of the
 *    following band visible on another.
 *
 *    Every card in the row has to share that aspect, so `crop` is always 16:10
 *    and is asserted to be. What varies per site is how you get a hero to fill
 *    it, and there are two cases:
 *
 *      - A full-height (`min-h-screen`-ish) hero grows with the window, so
 *        raise `viewport.height` above the crop and whatever follows the hero
 *        is pushed out of frame. autoskola-necas needs this; at 900 the top
 *        row of its marquee band landed inside the crop, clipped mid-word.
 *      - A fixed-height hero does not grow, so a taller window only reveals
 *        more of the next section. There, shrink the whole window to the hero
 *        instead, keeping it 16:10. acord is 717px of hero at any width, which
 *        left a white band across the bottom fifth of a 900-tall shot.
 *
 *    What does not work is cropping off-aspect and letting `sips -z` fix it:
 *    that flag resamples to exact dimensions without preserving ratio, so it
 *    silently squashes rather than letterboxing.
 *
 * JPEG, not PNG — the opposite of render.mjs, on purpose. Those panels are
 * synthetic line art where JPEG rings on 3px strokes. These are photographs
 * inside a browser window; as PNGs they came out 1.0-1.5 MB each, 3-7x
 * anything else committed to public/. At q90 downscaled from 2x, the UI text
 * still holds up and they land near the GITEX photos.
 *
 * `sips` is macOS-only, as in render.mjs. Accepted for an authoring tool.
 */

import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repo = fileURLToPath(new URL("../../", import.meta.url));

const SITES = [
	{
		slug: "autoskola-necas",
		url: "https://www.autoskolanecas.cz",
		// Full-height hero with a marquee band right after it: give the window
		// 140px more than the crop and the band falls outside the frame.
		viewport: { width: 1440, height: 1040 },
	},
	{
		slug: "spf-group",
		url: "https://www.spfgroup.org",
	},
	{
		slug: "acord",
		url: "https://acord-redesign.vercel.app",
		// Hero is a fixed 699px (header + section) and does not grow with the
		// window, so the window shrinks to it. Still 16:10, still well above
		// the 1024px desktop breakpoint, so nothing in the layout stacks.
		viewport: { width: 1118, height: 699 },
		crop: { width: 1118, height: 699 },
	},
	{
		slug: "artiphy",
		url: "https://artiphy-ai.vercel.app",
	},
];

// A real MacBook viewport. The pane these land in is `aspect-[16/10]`, so what
// is captured is what is shown — no second crop in CSS.
const VIEWPORT = { width: 1440, height: 900 };
const CROP = { width: 1440, height: 900 };
// Downscale target. 1600 is the long edge the /solutions panels already use.
const OUT_WIDTH = 1600;
const OUT_HEIGHT = 1000;
const ASPECT = OUT_WIDTH / OUT_HEIGHT;

/** Default settle time after networkidle + fonts, for hero entrance animations. */
const SETTLE_MS = 2500;

const JPEG_QUALITY = 90;

/** Roughly the weight of the heaviest GITEX photo. Past it, say so. */
const SIZE_WARN_BYTES = 450 * 1024;

const only = process.argv[2];
const queue = only ? SITES.filter((s) => s.slug === only) : SITES;
if (!queue.length) {
	console.error(`no site named "${only}". known: ${SITES.map((s) => s.slug).join(", ")}`);
	process.exit(1);
}

const tmp = here + ".tmp/";
const out = repo + "public/portfolio/";
mkdirSync(tmp, { recursive: true });
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
	viewport: VIEWPORT,
	deviceScaleFactor: 2,
	// Some hosts serve a different hero to an unknown UA; ask for the Czech
	// locale too, since two of these sites negotiate content on it.
	locale: "cs-CZ",
});

for (const {
	slug,
	url,
	wait = SETTLE_MS,
	hide = [],
	viewport = VIEWPORT,
	crop = CROP,
} of queue) {
	// Off-aspect here would be squashed by `sips -z` rather than letterboxed,
	// and the drift is small enough to miss by eye in the output.
	const drift = Math.abs(crop.width / crop.height - ASPECT);
	if (drift > 0.01) {
		console.error(
			`${slug}: crop ${crop.width}x${crop.height} is ${(crop.width / crop.height).toFixed(3)}:1, not ${ASPECT}:1`,
		);
		process.exit(1);
	}
	if (crop.width > viewport.width || crop.height > viewport.height) {
		console.error(`${slug}: crop ${crop.width}x${crop.height} exceeds viewport`);
		process.exit(1);
	}

	const page = await context.newPage();
	await page.setViewportSize(viewport);

	try {
		await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
	} catch {
		// networkidle never settles on sites with a polling widget or an open
		// socket. The DOM is usually long since ready by then, so fall through
		// to the settle wait rather than losing the shot.
		console.warn(`${slug.padEnd(18)} networkidle timed out, continuing`);
	}

	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(wait);

	if (hide.length) {
		const hidden = await page.evaluate((selectors) => {
			let n = 0;
			for (const selector of selectors) {
				for (const el of document.querySelectorAll(selector)) {
					el.style.setProperty("display", "none", "important");
					n++;
				}
			}
			// Overlays routinely lock the page; unlock so the hero sits at the top.
			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
			window.scrollTo(0, 0);
			return n;
		}, hide);
		if (hidden !== hide.length) {
			console.warn(
				`${slug.padEnd(18)} hid ${hidden} element(s) from ${hide.length} selector(s) — check for a stale selector`,
			);
		}
		await page.waitForTimeout(250);
	}

	const at2x = `${tmp}${slug}@2x.png`;
	// Always the top-left 16:10 of whatever window this site needed, so the
	// per-site layout tuning above never changes the output aspect.
	await page.screenshot({ path: at2x, clip: { x: 0, y: 0, ...crop } });
	await page.close();

	execFileSync(
		"sips",
		[
			"-s", "format", "jpeg",
			"-s", "formatOptions", String(JPEG_QUALITY),
			"-z", String(OUT_HEIGHT), String(OUT_WIDTH),
			at2x, "--out", `${out}${slug}.jpg`,
		],
		{ stdio: "ignore" },
	);

	const bytes = statSync(`${out}${slug}.jpg`).size;
	const kb = `${Math.round(bytes / 1024)} KB`;
	console.log(
		`${slug.padEnd(18)} ${`${crop.width}x${crop.height}`.padStart(9)}  ${kb.padStart(8)}  ${url}${bytes > SIZE_WARN_BYTES ? "   <- heavy" : ""}`,
	);
}

await browser.close();
rmSync(tmp, { recursive: true, force: true });
console.log(`\nwrote ${queue.length} capture(s) to public/portfolio/`);
