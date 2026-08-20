/* Bakes the raster logos from src/components/logo.tsx and writes a proof sheet.
 *
 *   node docs/logo/render.mjs            # assets + proof sheet
 *   node docs/logo/render.mjs --proof    # proof sheet only, reusing the assets
 *
 * Same shape and the same reasoning as docs/hero/plateau.mjs,
 * docs/diagrams/render.mjs and docs/portfolio/capture.mjs: Playwright at 2x,
 * downscaled with sharp, written into public/. Run by hand, NEVER part of
 * `npm run build` — a build must not depend on a browser binary.
 *
 * WHY THIS EXISTS. There is no .svg source in the repo: the Illustrator file the
 * component's docblock cites was never checked in, so the two PNGs could not be
 * regenerated from anything, and they drifted. Before the #00a3ff rebrand the
 * mark existed in three places at TWO different values — logo.tsx and
 * landscape_logo.png at #37c4e8, and logo.png at a brightened #46d7ff, which is
 * the file serving the favicon, the apple-touch-icon and both manifest icons. So
 * the browser tab was off-brand and nothing could tell you.
 *
 * Three things here are load-bearing:
 *
 * 1. THE PATHS ARE PARSED OUT OF logo.tsx, never copied. That component is the
 *    single source for the geometry, and a duplicate of ~4 KB of path data in a
 *    generator is exactly how the two PNGs drifted from it in the first place.
 *    If the regexes below stop matching, the run fails loudly rather than
 *    silently baking a stale shape.
 *
 * 2. `fill="var(--brand, #00a3ff)"` in the component resolves to the FALLBACK
 *    here, because this renders outside the app and globals.css does not exist
 *    in this document. That is deliberate and it is why the literal in logo.tsx
 *    must stay in step with `--brand`. This script asserts they agree.
 *
 * 3. The wordmark is #4d4d4e grey, not the near-white it renders as in the
 *    site's dark header. landscape_logo.png is the OG/Twitter image and lands on
 *    light social cards; near-white on white is invisible. That is also the
 *    colour the outgoing file used, so social previews do not visibly change
 *    apart from the mark's hue.
 *
 * KNOWN, ACCEPTED DIFFERENCE from the outgoing PNGs: the component deliberately
 * drops the Illustrator source's `mix-blend-mode: multiply` overlap shadow under
 * the crossing arcs (see the logo.tsx docblock — do not "restore" it), so the
 * mark here is flat where the old raster had a faint smudge. At favicon sizes it
 * was sub-pixel anyway.
 */

import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const scratch =
	"/private/tmp/claude-501/-Users-Radek-ideacomp-ideacomp-redesign-ideacomp-cz/189c1ea4-3934-4036-b41b-1fc92caa2901/scratchpad/";

/** Keep in step with `--brand` in src/app/globals.css. Asserted against the
 *  component's own fallback below, so a rebrand cannot half-land. */
const BRAND = "#00a3ff";
/** Wordmark on the light social card — see note 3 above. */
const WORDMARK = "#4d4d4e";

/* --------------------------------------------------------------- source -- */

const source = readFileSync(repo + "src/components/logo.tsx", "utf8");

const grab = (re, what) => {
	const m = source.match(re);
	if (!m) {
		throw new Error(
			`logo.tsx no longer matches the ${what} pattern — the generator cannot ` +
				`parse it. Fix the regex in docs/logo/render.mjs rather than copying ` +
				`the path data here.`,
		);
	}
	return m;
};

const viewBox = grab(/viewBox="([^"]+)"/, "viewBox")[1];
const markGroup = grab(/<g\s+fill="var\(--brand,\s*([^)]+)\)"([\s\S]*?)<\/g>/, "mark group");
const wordGroup = grab(/<g\s+fill="currentColor"([\s\S]*?)<\/g>/, "wordmark group");

if (markGroup[1].trim().toLowerCase() !== BRAND) {
	throw new Error(
		`logo.tsx's fallback is ${markGroup[1].trim()} but this generator bakes ` +
			`${BRAND}. They must agree — see note 2 in the header.`,
	);
}

/** `<g>` innards verbatim, minus the JSX self-closing whitespace. */
const mark = `<g fill="${BRAND}"${markGroup[2]}</g>`;
const word = `<g fill="${WORDMARK}"${wordGroup[1]}</g>`;

/* ------------------------------------------------------------------ svg -- */

/** A standalone document. `preserveAspectRatio` meets rather than slices, so a
 *  target whose aspect differs from the artwork's gets padding, never a crop —
 *  which is what the outgoing landscape file did too. */
const doc = (body, box, w, h) =>
	`<style>html,body{margin:0;background:transparent}svg{display:block}</style>` +
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
	`viewBox="${box}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });

/** Measure the artwork's real extent so a cut is padded on purpose rather than
 *  inheriting whatever slack the authored viewBox happens to carry.
 *
 *  Measured on the ROOT <svg>, never on the <g>. `getBBox()` reports an
 *  element's box in its own local space, excluding that element's own
 *  `transform` — and both groups here carry a large `translate`, so measuring
 *  the group returns coordinates ~442 units away from where it paints and every
 *  cut comes out blank. The root's box includes its children's transforms. */
const bboxOf = async (body) => {
	const page = await browser.newPage({ viewport: { width: 800, height: 400 } });
	await page.setContent(doc(body, viewBox, 800, 400));
	const b = await page.evaluate(() => {
		const { x, y, width, height } = document.querySelector("svg").getBBox();
		return { x, y, width, height };
	});
	await page.close();
	if (!b.width || !b.height) throw new Error("measured an empty bbox — nothing painted");
	return b;
};

/** A little air so the mark does not touch the canvas edge — a favicon rendered
 *  edge-to-edge reads as clipped, and the manifest declares these maskable. */
const pad = (b, f) => {
	const p = Math.max(b.width, b.height) * f;
	return `${b.x - p} ${b.y - p} ${b.width + p * 2} ${b.height + p * 2}`;
};

const markBox = pad(await bboxOf(mark), 0.06);
const lockBox = pad(await bboxOf(mark + word), 0.04);

/* --------------------------------------------------------------- render -- */

/** 2x then lanczos down, the same anti-banding/anti-aliasing route plateau.mjs
 *  takes. `omitBackground` keeps the transparency both files rely on. */
const shoot = async (body, box, w, h) => {
	const page = await browser.newPage({
		viewport: { width: w, height: h },
		deviceScaleFactor: 2,
	});
	await page.setContent(doc(body, box, w, h));
	const raw = await page.screenshot({ omitBackground: true });
	await page.close();
	return raw;
};

if (!process.argv.includes("--proof")) {
	const sharp = (await import("sharp")).default;
	mkdirSync(repo + "public", { recursive: true });

	// Dimensions match the outgoing files so nothing downstream has to move:
	// layout.tsx's <link> tags, manifest.json's icons, the four OG/Twitter
	// declarations and structured-data.tsx all keep pointing at the same paths.
	const cuts = [
		{ name: "logo", body: mark, box: markBox, w: 636, h: 592 },
		{ name: "landscape_logo", body: mark + word, box: lockBox, w: 1996, h: 968 },
	];

	for (const c of cuts) {
		const raw = await shoot(c.body, c.box, c.w, c.h);
		const info = await sharp(raw)
			.resize(c.w, c.h, { kernel: "lanczos3" })
			.png({ compressionLevel: 9, palette: false })
			.toFile(`${repo}public/${c.name}.png`);
		console.log(`${c.name.padEnd(16)}.png  ${c.w}x${c.h}  ${(info.size / 1024).toFixed(1)} KB`);
	}

	/* ------------------------------------------------------------- favicon -- */

	// sharp cannot write ICO, and the container is trivial: a 6-byte header, a
	// 16-byte directory entry per image, then the payloads. PNG-in-ICO is valid
	// per the format and read by every browser still shipping — which is why
	// there is no BMP/AND-mask path here.
	const sizes = [16, 32, 48];
	const pngs = [];
	for (const s of sizes) {
		pngs.push(await sharp(await shoot(mark, markBox, s, s)).resize(s, s, { kernel: "lanczos3" }).png().toBuffer());
	}

	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // 1 = icon
	header.writeUInt16LE(sizes.length, 4);

	let offset = 6 + 16 * sizes.length;
	const dir = sizes.map((s, i) => {
		const e = Buffer.alloc(16);
		e.writeUInt8(s === 256 ? 0 : s, 0); // width  (0 means 256)
		e.writeUInt8(s === 256 ? 0 : s, 1); // height
		e.writeUInt8(0, 2); // palette size, 0 for truecolour
		e.writeUInt8(0, 3); // reserved
		e.writeUInt16LE(1, 4); // colour planes
		e.writeUInt16LE(32, 6); // bits per pixel
		e.writeUInt32LE(pngs[i].length, 8);
		e.writeUInt32LE(offset, 12);
		offset += pngs[i].length;
		return e;
	});

	const ico = Buffer.concat([header, ...dir, ...pngs]);
	writeFileSync(repo + "public/favicon.ico", ico);
	console.log(`favicon        .ico  ${sizes.join("/")}px  ${(ico.length / 1024).toFixed(1)} KB`);
}

/* ----------------------------------------------------------- proof sheet -- */

// Judged on the surfaces they actually land on, at the sizes they actually
// render at — the same rule plateau.mjs states. A favicon reviewed at 1:1 on
// white is how you ship a mark that dissolves in the tab strip.
const b64 = (p) => readFileSync(repo + p).toString("base64");
const markPng = `data:image/png;base64,${b64("public/logo.png")}`;
const landPng = `data:image/png;base64,${b64("public/landscape_logo.png")}`;

const proof = await browser.newPage({ viewport: { width: 1200, height: 1100 } });
await proof.setContent(`<style>
	body{margin:0;background:#0b0f14;font:12px/1.4 system-ui;color:#93a0ad;padding:20px}
	figure{margin:0 0 18px}
	figcaption{padding:6px 2px}
	.row{display:flex;align-items:center;gap:22px;padding:16px;border-radius:8px}
	.graphite{background:#24252b}
	.field{background:linear-gradient(100deg,oklch(0.36 0.14 245),oklch(0.691 0.174 245))}
	.light{background:#f9f9fb}
	.tab{background:#35363a;display:inline-flex;align-items:center;gap:6px;
		padding:6px 14px;border-radius:8px 8px 0 0;color:#c8ccd2;font-size:12px}
	img{display:block}
</style>
<figure><div class="row graphite">
	<img src="${markPng}" style="height:32px"><img src="${markPng}" style="height:48px">
	<img src="${landPng}" style="height:28px"><img src="${landPng}" style="height:56px">
</div><figcaption>graphite #24252b — the header and footer. Mark measures 5.59:1 here.</figcaption></figure>

<figure><div class="row field">
	<img src="${markPng}" style="height:32px"><img src="${landPng}" style="height:28px">
</div><figcaption>the hero field — the header is transparent until scroll on Home. 3.84:1.</figcaption></figure>

<figure><div class="row light">
	<img src="${landPng}" style="height:56px"><img src="${landPng}" style="height:120px">
</div><figcaption>light — the OG/Twitter card. This is why the wordmark is ${WORDMARK} grey and not near-white.</figcaption></figure>

<figure><div class="row graphite" style="gap:10px">
	<span class="tab"><img src="${markPng}" style="height:16px">Ideacomp</span>
	<span class="tab"><img src="${markPng}" style="height:16px">Ideacomp — Custom Software</span>
	<img src="${markPng}" style="height:16px"><img src="${markPng}" style="height:32px"><img src="${markPng}" style="height:48px">
</div><figcaption>favicon at its real sizes: 16 / 32 / 48. The one that used to be off-brand #46d7ff.</figcaption></figure>`);
await proof.waitForTimeout(300);
mkdirSync(scratch, { recursive: true });
await proof.screenshot({ path: scratch + "logo-proof.png", fullPage: true });
console.log("proof sheet -> logo-proof.png");

await browser.close();
