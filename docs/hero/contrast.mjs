/* Contrast harness for the four .surface-signal surfaces.
 *
 *   npm run build && npm run start -- -p 3111
 *   node docs/hero/contrast.mjs
 *
 * Run it after ANY change to the hero field, --field-hold, the platform cut, the
 * triangle alphas, or the brand colour. The field's open end is `--brand`, which
 * is far too light for copy (70%-opacity white over it is 2.22:1), so the only
 * thing keeping the hero legal is --field-hold clearing the copy column at every
 * width. That is a contract, and this is what checks it.
 *
 * Existed as ad-hoc scratch code for months and was re-derived from scratch more
 * than once, each time re-learning the same traps — hence checking it in.
 *
 * ALWAYS CONFIRM IT CAN FAIL BEFORE TRUSTING A PASS:
 *
 *   CONTROL_CSS='.surface-signal{--background:oklch(0.691 0.174 245)!important}' \
 *     PAGES=/ WIDTHS=1440,1024,768 node docs/hero/contrast.mjs
 *
 * That floods the copy column with the bright end and must report failures. An
 * earlier cut of this file passed everything because it mis-parsed the glyph
 * colours (see below) — a green run proves nothing on its own.
 *
 * Six traps, each of which produced a wrong verdict here at least once:
 *
 *  1. `getComputedStyle().color` for a colour that came from an oklch() token
 *     SERIALIZES AS oklch(), not rgb(). Scraping three numbers out of it and
 *     calling them RGB turns near-white into near-black; that reported the whole
 *     run as ~1.2:1 failures. Resolve via canvas, which yields sRGB bytes.
 *  2. A glyph on its own opaque fill is measured against THAT fill. The CTA is a
 *     near-white <a> with a dark label — 13.4:1 on screen, but comparing that
 *     label to the field behind the button reports 1.3:1.
 *  3. Hide the hero's CONTENT and keep its BACKDROP. Hiding "each text node's
 *     parent" takes the CTA's fill down with its label and re-creates trap 2.
 *  4. Hide with `visibility`, never `display:none` — the latter reflows the page
 *     and invalidates every glyph rect already measured.
 *  5. Sample under GLYPH rects (Range.getClientRects()), not element boxes: the
 *     h1 and <p> are full-width blocks whose text fills a fraction of them. Take
 *     each glyph's own colour and opacity; the two headline lines differ.
 *  6. Sample at BOTH pointer extremes — the triangles drift ~50px, and testing
 *     only the corner that moves a shape away from the text hid a real 3.26:1
 *     collision for several rounds.
 *
 * Plus: run against `next start`, never `next dev` (the dev badge is a dark disc
 * over the spec row and reads as a 1.06:1 failure that does not exist), and
 * screenshot the hero ELEMENT with animations disabled, not the viewport.
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3111";
const WIDTHS = process.env.WIDTHS
	? process.env.WIDTHS.split(",").map(Number)
	: [2560, 1920, 1728, 1512, 1440, 1280, 1180, 1024, 900, 834, 768, 500, 390, 360];
const PAGES = process.env.PAGES ? process.env.PAGES.split(",") : ["/", "/about", "/solutions", "/contact"];

const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const lum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const fails = [];
let worst = { ratio: 99 };
let samples = 0;

for (const path of PAGES) {
	for (const width of WIDTHS) {
		const page = await browser.newPage({ viewport: { width, height: 900 } });
		await page.goto(BASE + path, { waitUntil: "networkidle" });
		// Negative control: CONTROL_CSS=".surface-signal{--field-hold:0%!important}"
		// drags the bright end under the copy. If a run with that set still reports
		// ALL PASS, the harness is blind and its verdict is worthless.
		if (process.env.CONTROL_CSS) {
			await page.addStyleTag({ content: process.env.CONTROL_CSS });
			await page.waitForTimeout(200);
		}

		const hero = await page.$(".surface-signal");
		if (!hero) { await page.close(); continue; }

		for (const [px, py] of [[0, 0], [width, 900]]) {
			await page.mouse.move(px, py);
			await page.waitForTimeout(120);

			// Glyph rects + each glyph's own colour, measured BEFORE hiding the copy.
			const glyphs = await page.evaluate(() => {
				const host = document.querySelector(".surface-signal");
				const out = [];

				// Chrome serializes a computed `color` that came from an oklch() token
				// AS oklch(), not rgb(). Scraping three numbers out of that string and
				// calling them RGB turns near-white into near-black and reports the
				// entire run as ~1.2:1 failures. Canvas resolves any CSS colour to
				// straight sRGB bytes, which is what the comparison needs.
				const cv = document.createElement("canvas");
				cv.width = cv.height = 1;
				const ctx = cv.getContext("2d", { willReadFrequently: true });
				const toRgba = (css) => {
					ctx.clearRect(0, 0, 1, 1);
					ctx.fillStyle = "#000";
					ctx.fillStyle = css; // ignored if unparseable, leaving #000
					ctx.fillRect(0, 0, 1, 1);
					const d = ctx.getImageData(0, 0, 1, 1).data;
					return [d[0], d[1], d[2], d[3] / 255];
				};

				const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
				let n;
				while ((n = walk.nextNode())) {
					if (!n.textContent.trim()) continue;
					const el = n.parentElement;
					if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
					const cs = getComputedStyle(el);
					const m = toRgba(cs.color);
					const op = Number(cs.opacity);
					const r = document.createRange();
					r.selectNodeContents(n);
					for (const b of r.getClientRects()) {
						if (b.width < 2 || b.height < 2) continue;
						// Nearest opaque ancestor background inside the hero. If a glyph
						// has one — the CTA's near-white fill — THAT is its backdrop and
						// the hero field behind it is irrelevant. Without this the dark
						// button label gets compared to the dark field and reports ~1.3:1
						// for a pairing that measures 13.4:1 on screen.
						let ownBg = null;
						for (let a = el; a && a !== host.parentElement; a = a.parentElement) {
							const c = toRgba(getComputedStyle(a).backgroundColor);
							if (c[3] >= 0.99) { ownBg = [c[0], c[1], c[2]]; break; }
						}

						out.push({
							x: b.x, y: b.y, w: b.width, h: b.height,
							ownBg,
							rgb: [m[0], m[1], m[2]],
							alpha: m[3] * op,
							size: parseFloat(cs.fontSize),
							weight: cs.fontWeight,
							text: n.textContent.trim().slice(0, 28),
						});
					}
				}
				return out;
			});

			// Box measured BEFORE hiding anything, and everything is hidden with
			// visibility rather than display: `display:none` reflows the page, which
			// invalidates every glyph rect captured above and reports the whole run
			// as ~1.2:1 failures. visibility keeps layout byte-identical.
			const box = await hero.boundingBox();

			// Hide the CONTENT, keep the BACKDROP — not "hide each text node's
			// parent". The CTA is an <a> with a near-white fill and dark label
			// (13.4:1 on screen); hiding it as a text parent takes its fill away
			// with it and then measures that dark label against the dark field, a
			// pairing that never occurs. Anything that paints over the backdrop and
			// under the copy has to stay.
			await page.evaluate(() => {
				const host = document.querySelector(".surface-signal");
				const backdrop = host.querySelector('[aria-hidden="true"]');
				for (const el of host.querySelectorAll(":scope > *")) {
					if (el !== backdrop && !el.contains(backdrop)) {
						el.style.setProperty("visibility", "hidden", "important");
					}
				}
				for (const el of document.querySelectorAll("*")) {
					const p = getComputedStyle(el).position;
					if (p === "fixed" || p === "sticky") el.style.setProperty("visibility", "hidden", "important");
				}
			});
			await page.waitForTimeout(400); // Button's transition-all duration-200

			// animations:"disabled" finishes transitions instead of waiting for the
			// element to go stable — Button's `transition-all` otherwise keeps the
			// near-white fill repainting, and under an injected control style it
			// never settles at all and the shot times out.
			const shot = await hero.screenshot({ animations: "disabled", timeout: 15000 });
			const sharp = (await import("sharp")).default;
			const { data, info } = await sharp(shot).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
			const scale = info.width / box.width;

			for (const g of glyphs) {
				// A glyph sitting on its own opaque fill is measured against that fill.
				if (g.ownBg) {
					const bgL = lum(g.ownBg);
					const fg = g.rgb.map((c, k) => g.alpha * c + (1 - g.alpha) * g.ownBg[k]);
					const ratio = cr(lum(fg), bgL);
					const large = g.size >= 24 || (g.size >= 18.66 && Number(g.weight) >= 700);
					const need = large ? 3 : 4.5;
					samples++;
					if (ratio < worst.ratio) worst = { ratio, path, width, text: g.text, need, size: g.size };
					if (ratio < need) fails.push(`${path} @${width} [${px},${py}]  ${ratio.toFixed(2)}:1 < ${need}  "${g.text}" ${g.size}px (on own fill)`);
					continue;
				}

				// Lightest backdrop pixel under this glyph's rect.
				const x0 = Math.max(0, Math.round((g.x - box.x) * scale));
				const y0 = Math.max(0, Math.round((g.y - box.y) * scale));
				const x1 = Math.min(info.width - 1, Math.round((g.x - box.x + g.w) * scale));
				const y1 = Math.min(info.height - 1, Math.round((g.y - box.y + g.h) * scale));
				if (x1 <= x0 || y1 <= y0) continue;

				let hi = -1, hiPx = null;
				for (let y = y0; y <= y1; y += 2) {
					for (let x = x0; x <= x1; x += 2) {
						const i = (y * info.width + x) * info.channels;
						const L = lum([data[i], data[i + 1], data[i + 2]]);
						if (L > hi) { hi = L; hiPx = [data[i], data[i + 1], data[i + 2]]; }
					}
				}
				if (hi < 0) continue;

				// Composite the glyph's own colour at its own alpha over that pixel.
				const fg = g.rgb.map((c, k) => g.alpha * c + (1 - g.alpha) * hiPx[k]);
				const ratio = cr(lum(fg), hi);
				const large = g.size >= 24 || (g.size >= 18.66 && Number(g.weight) >= 700);
				const need = large ? 3 : 4.5;
				samples++;

				if (ratio < worst.ratio) worst = { ratio, path, width, text: g.text, need, size: g.size };
				if (ratio < need) {
					fails.push(`${path} @${width} [${px},${py}]  ${ratio.toFixed(2)}:1 < ${need}  "${g.text}" ${g.size}px`);
				}
			}
		}
		await page.close();
	}
}

await browser.close();
console.log(`\n${samples} glyph samples across ${PAGES.length} pages x ${WIDTHS.length} widths x 2 pointer extremes`);
if (fails.length) {
	console.log(`\nFAIL (${fails.length}):`);
	for (const f of [...new Set(fails)]) console.log("  " + f);
} else {
	console.log("\nALL PASS");
}
console.log(`\nworst: ${worst.ratio.toFixed(2)}:1 (needed ${worst.need}) — ${worst.path} @${worst.width} "${worst.text}" ${worst.size}px`);
