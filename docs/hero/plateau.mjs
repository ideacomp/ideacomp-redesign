/* Bakes the hero plateau to public/hero/ and writes a proof sheet to review it.
 *
 *   node docs/hero/plateau.mjs            # asset + proof sheet
 *   node docs/hero/plateau.mjs --proof    # proof sheet only, reusing the asset
 *
 * Same shape and the same reasoning as docs/diagrams/render.mjs and
 * docs/portfolio/capture.mjs: Playwright at 2x, downscaled, written into
 * public/. Run by hand, NEVER part of `npm run build` — a build must not depend
 * on a browser binary.
 *
 * Unlike those two this uses `sharp` rather than `sips`, because it also has to
 * flatten to greyscale-plus-alpha and `sips` cannot. That drops the macOS-only
 * constraint as a side effect.
 *
 * Three things here are load-bearing:
 *
 * 1. `omitBackground: true` plus achromatic fills. The asset is grey-and-alpha
 *    on transparency so it TINTS to whatever field sits under it — the same
 *    rule every decorative layer in this hero follows, and the reason
 *    recolouring the site stays a one-token change. A single coloured pixel in
 *    here welds the hero to cyan forever.
 * 2. Every filter sets `filterUnits="userSpaceOnUse"` with a region padded well
 *    past 4x sigma. SVG's default region is -10%/+120% of the object box, which
 *    hard-clips a wide blur into a rectangle — it shows up as a straight edge
 *    running across a soft shadow, and it is the most common way this kind of
 *    render goes wrong.
 * 3. The proof sheet composites the asset over the REAL field colour at the
 *    sizes it will actually be delivered at (27% and 38% of viewport width),
 *    not at 1:1. A detail that carries the form at full size and vanishes at
 *    30% is wasted work — the same lesson docs/diagrams/panel.css records.
 */

import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
	TIERS,
	buildFaces,
	frame,
	groundPolygon,
	pathOf,
	shadowPolygon,
	tierSilhouette,
} from "./scene.mjs";

const repo = fileURLToPath(new URL("../../", import.meta.url));
const scratch =
	"/private/tmp/claude-501/-Users-Radek-ideacomp-ideacomp-redesign-ideacomp-cz/1b7c5b40-ed19-4471-a13e-4da73e9b9506/scratchpad/";

/* ------------------------------------------------------------------- svg -- */

/** Screen-space direction the key light falls away along, for face gradients. */
const AXIS = (() => {
	const [x, y] = [-0.34, -0.42];
	const l = Math.hypot(x, y);
	return [-x / l, -y / l];
})();

const face = (whiteScale) => (f, i) => {
	// Gradient along the light axis, 1.18x to 0.72x the face's own value. A flat
	// `fill` on any face is the failure mode this whole exercise exists to avoid.
	const xs = f.points.map((p) => p[0]);
	const ys = f.points.map((p) => p[1]);
	const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
	const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
	const r = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 || 1;

	const white = f.white * f.t ** 0.9 * whiteScale;
	const black = 0.115 * (1 - f.t) ** 1.15;

	return `
	<linearGradient id="gw${i}" gradientUnits="userSpaceOnUse"
		x1="${(cx - AXIS[0] * r).toFixed(1)}" y1="${(cy - AXIS[1] * r).toFixed(1)}"
		x2="${(cx + AXIS[0] * r).toFixed(1)}" y2="${(cy + AXIS[1] * r).toFixed(1)}">
		<stop offset="0" stop-color="#fff" stop-opacity="${(white * 1.18).toFixed(4)}"/>
		<stop offset="1" stop-color="#fff" stop-opacity="${(white * 0.72).toFixed(4)}"/>
	</linearGradient>
	<linearGradient id="gb${i}" gradientUnits="userSpaceOnUse"
		x1="${(cx - AXIS[0] * r).toFixed(1)}" y1="${(cy - AXIS[1] * r).toFixed(1)}"
		x2="${(cx + AXIS[0] * r).toFixed(1)}" y2="${(cy + AXIS[1] * r).toFixed(1)}">
		<stop offset="0" stop-color="#000" stop-opacity="${(black * 0.72).toFixed(4)}"/>
		<stop offset="1" stop-color="#000" stop-opacity="${(black * 1.18).toFixed(4)}"/>
	</linearGradient>`;
};

const buildSvg = (whiteScale = 1) => {
	const faces = buildFaces();
	const sil = TIERS.map(tierSilhouette);
	const f = frame();
	const region = `x="${f.x - 600}" y="${f.y - 600}" width="${f.w + 1200}" height="${f.h + 1200}"`;

	// One mask per tier: everything the tiers ABOVE it occlude is cut away, so no
	// two faces ever paint the same pixel. Overlapping alpha compounds, which
	// would make the tonal ladder unpredictable and the contrast unprovable.
	const masks = TIERS.map(
		(_, i) => `
	<mask id="occ${i}" maskUnits="userSpaceOnUse" ${region}>
		<rect ${region} fill="#fff"/>
		${sil
			.slice(i + 1)
			.map((s) => `<path d="${pathOf(s)}" fill="#000"/>`)
			.join("")}
	</mask>`,
	);

	const blur = (id, sd) =>
		`<filter id="${id}" filterUnits="userSpaceOnUse" ${region}><feGaussianBlur stdDeviation="${sd}"/></filter>`;

	const ground = pathOf(groundPolygon());
	const shadow = pathOf(shadowPolygon());

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${f.w}" height="${f.h}" viewBox="${f.x} ${f.y} ${f.w} ${f.h}">
<defs>
	${blur("bPen", 46)}${blur("bMid", 14)}${blur("bTight", 5)}${blur("bAo", 22)}${blur("bAoTight", 6)}${blur("bSheen", 140)}
	${faces.map(face(whiteScale)).join("")}
	${masks.join("")}
</defs>

<!-- Ground: a wide penumbra, a mid term and a tight contact term. The pairing of
     a tight dark term with a wide faint one at every contact is what reads as
     "sitting on something" rather than "floating over it". -->
<path d="${shadow}" fill="#000" fill-opacity="0.13" filter="url(#bPen)"/>
<path d="${shadow}" fill="#000" fill-opacity="0.16" filter="url(#bMid)"/>
<path d="${ground}" fill="#000" fill-opacity="0.2" filter="url(#bTight)"/>

${TIERS.map((tier, i) => {
	const own = faces.filter((f) => f.tier === tier.id);
	const above = TIERS[i + 1];
	const ao = above
		? `
	<g mask="url(#occ${i})">
		<path d="${pathOf(tierSilhouette(above))}" fill="#000" fill-opacity="0.2" filter="url(#bAo)"/>
		<path d="${pathOf(tierSilhouette(above))}" fill="#000" fill-opacity="0.24" filter="url(#bAoTight)"/>
	</g>`
		: "";

	return `<g mask="url(#occ${i})">
	${own
		.map((f) => {
			const j = faces.indexOf(f);
			return `<path d="${pathOf(f.points)}" fill="url(#gw${j})"/><path d="${pathOf(f.points)}" fill="url(#gb${j})"/>`;
		})
		.join("\n\t")}
</g>${ao}`;
}).join("\n")}

<!-- One very wide wash on the lit side. Costs nothing baked, and it is what
     stops the upper treads reading as flat cut paper. -->
<path d="${pathOf(tierSilhouette(TIERS[2]))}" fill="#fff" fill-opacity="${(0.045 * whiteScale).toFixed(4)}" filter="url(#bSheen)"/>
</svg>`;
};

/* ---------------------------------------------------------------- render -- */

/**
 * Two cuts of the same solid.
 *
 * `wide` is the full tonal range, used from 1024 up where the artwork sits in
 * the free column right of the copy.
 *
 * `compact` is the SAME geometry with the lit passes scaled almost out and the
 * shadows untouched — a dark relief rather than a lit one. Below 1024 the copy
 * runs to 93% of the width and there is nowhere to put a lit object: the
 * contrast harness caught the lit version reaching the paragraph at 768 and 390
 * and failing at 3.7:1. Black over light copy only ever improves the ratio,
 * which is what makes a dark cut legal where a bright one is not, and it is why
 * small viewports still get decoration rather than a bare gradient.
 */
const CUTS = [
	{ name: "plateau-wide", whiteScale: 1 },
	{ name: "plateau-compact", whiteScale: 0.16 },
];

mkdirSync(repo + "public/hero/", { recursive: true });
writeFileSync(scratch + "plateau.svg", buildSvg());

const browser = await chromium.launch({ args: ["--force-color-profile=srgb"] });

if (!process.argv.includes("--proof")) {
	const f = frame();
	const sharp = (await import("sharp")).default;

	for (const cut of CUTS) {
		const page = await browser.newPage({
			viewport: { width: f.w, height: f.h },
			deviceScaleFactor: 2,
		});
		await page.setContent(
			`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${buildSvg(cut.whiteScale)}`,
		);
		const raw = await page.screenshot({ omitBackground: true });
		await page.close();

		// Greyscale + alpha: two channels instead of four, losslessly. The 2x
		// render downsampled with lanczos is also the primary defence against
		// banding — big soft 8-bit gradients over a saturated field band badly.
		const base = sharp(raw).resize(f.w, f.h, { kernel: "lanczos3" }).toColourspace("b-w");

	// Delivered as AVIF with a WebP fallback and no PNG: this is a CSS
	// background, so `next/image` never sees it and cannot convert it for us.
		// No PNG in public/: nothing would ever serve it, and the lossless master
		// is this script — re-run it rather than commit 280 KB nobody downloads.
		for (const [ext, out] of [
			["webp", base.clone().webp({ quality: 82, alphaQuality: 90, effort: 6 })],
			["avif", base.clone().avif({ quality: 58, effort: 7 })],
		]) {
			const info = await out.toFile(`${repo}public/hero/${cut.name}.${ext}`);
			console.log(`${cut.name.padEnd(16)}.${ext.padEnd(4)} ${f.w}x${f.h}  ${(info.size / 1024).toFixed(1)} KB`);
		}
	}
}

/* ----------------------------------------------------------- proof sheet -- */

// Composited over the REAL field, at the widths and the delivered sizes it will
// be seen at. Judging the asset at 1:1 on white is how you ship something that
// disappears at 30%.
// Inlined as a data URI, not linked: a `setContent` document has an about:blank
// base URL and Chromium refuses file:// subresources from it, which silently
// produces a proof sheet showing nothing but the field.
const asset = `data:image/webp;base64,${readFileSync(repo + "public/hero/plateau-wide.webp").toString("base64")}`;

const proof = await browser.newPage({ viewport: { width: 1500, height: 1500 } });
await proof.setContent(`<style>
	body{margin:0;background:#0b0f14;font:12px/1.4 system-ui;color:#93a0ad}
	figure{margin:0 0 2px}
	figcaption{padding:6px 10px}
	/* A copy of the live field, and it had drifted: this said 0.38 long after
	   globals.css settled on 0.36, and pinned one 58% stop after --field-hold
	   became per-breakpoint. Now on the brand hue (--brand-h: 245), opening out
	   to --brand itself. Keep in step with .surface-signal by hand. */
	.hero{position:relative;height:380px;overflow:hidden;
		background:linear-gradient(100deg, oklch(0.36 0.14 245) 0%, oklch(0.36 0.14 245) 58%, oklch(0.691 0.174 245) 100%)}
	.hero i{position:absolute;inset:0;background-image:url("${asset}");
		background-repeat:no-repeat;background-position:right center}
	.s27 i{background-size:27% auto} .s38 i{background-size:38% auto} .s100 i{background-size:100% auto}
</style>
<figure class="s38"><div class="hero"><i></i></div><figcaption>38% auto · right center — the >=1280 case</figcaption></figure>
<figure class="s27"><div class="hero"><i></i></div><figcaption>27% auto · right center — the 1024-1279 case</figcaption></figure>
<figure class="s100"><div class="hero" style="height:300px"><i></i></div><figcaption>100% auto — full bleed, to read the form</figcaption></figure>`);
await proof.waitForTimeout(400);
await proof.screenshot({ path: scratch + "plateau-proof.png", fullPage: true });
console.log("proof sheet -> plateau-proof.png");

await browser.close();
