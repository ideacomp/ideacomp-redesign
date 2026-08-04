/* Renders every /solutions panel from docs/diagrams/*.html to public/solutions/.
 *
 *   node docs/diagrams/render.mjs            # all six
 *   node docs/diagrams/render.mjs ai-ml      # just one, while iterating
 *
 * Two things here are load-bearing and should survive any rewrite:
 *
 * 1. Wires are drawn from the MEASURED centre of each `.port` element, never
 *    from hand-authored path data. That is what keeps an edge attached when a
 *    node's label gets longer and changes its box size. Horizontal edges leave
 *    and arrive along x, vertical along y — mixing the two is what once swept a
 *    wire out past the right edge and back.
 * 2. Each panel declares its own edges, inside its own HTML, as
 *    <script type="application/json" id="edges">[["h","n1:r","n2:l"], ...]</script>
 *    so the geometry lives next to the nodes it connects. A panel with no
 *    #edges block is simply screenshotted.
 *
 * Output is PNG, not JPEG: the 2-3px strokes and mono type here pick up visible
 * ringing under JPEG, and next/image still serves AVIF to the browser.
 *
 * `sips` is macOS-only. This is an authoring tool run by hand, not part of
 * `npm run build`, so that is an accepted constraint.
 */

import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repo = fileURLToPath(new URL("../../", import.meta.url));

// slug matches solutionsData[].slug in src/lib/sitemap.ts, so the output
// filename and the content slot can never drift apart.
const PANELS = [
	{ slug: "ai-ml", html: "ai-forecast.html" },
	{ slug: "cybersecurity", html: "security-perimeter.html" },
	{ slug: "web-development", html: "web-viewports.html" },
	{ slug: "outsourcing", html: "ops-board.html" },
	{ slug: "mobile-development", html: "mobile-core.html" },
	{ slug: "cloud-devops", html: "deploy-pipeline.html" },
];

const WIDTH = 1600;
const HEIGHT = 1067;
const WIRE = "#4f8396";

const only = process.argv[2];
const queue = only ? PANELS.filter((p) => p.slug === only) : PANELS;
if (!queue.length) {
	console.error(`no panel named "${only}". known: ${PANELS.map((p) => p.slug).join(", ")}`);
	process.exit(1);
}

const tmp = here + ".tmp/";
const out = repo + "public/solutions/";
mkdirSync(tmp, { recursive: true });
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
	viewport: { width: WIDTH, height: HEIGHT },
	deviceScaleFactor: 2,
});

for (const { slug, html } of queue) {
	const page = await context.newPage();
	await page.goto("file://" + here + html, { waitUntil: "networkidle" });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(400);

	const wires = await page.evaluate((wireColor) => {
		const decl = document.getElementById("edges");
		if (!decl) return 0;

		// "n3:l" -> the measured centre of node n3's left port.
		const centre = (ref) => {
			const [nodeId, side] = ref.split(":");
			const node = document.getElementById(nodeId);
			if (!node) throw new Error(`no node #${nodeId}`);
			const el = node.querySelector(".port." + side);
			if (!el) throw new Error(`node #${nodeId} has no .port.${side}`);
			const r = el.getBoundingClientRect();
			return { x: r.x + r.width / 2 + scrollX, y: r.y + r.height / 2 + scrollY };
		};

		const hEdge = (a, b) => {
			const d = Math.max(70, Math.abs(b.x - a.x) * 0.55);
			return `M${a.x},${a.y} C${a.x + d},${a.y} ${b.x - d},${b.y} ${b.x},${b.y}`;
		};
		const vEdge = (a, b) => {
			const d = Math.max(60, Math.abs(b.y - a.y) * 0.5);
			return `M${a.x},${a.y} C${a.x},${a.y + d} ${b.x},${b.y - d} ${b.x},${b.y}`;
		};

		const edges = JSON.parse(decl.textContent).map(([axis, from, to]) => [
			axis,
			centre(from),
			centre(to),
		]);

		const paths = edges
			.map(([axis, a, b]) => `<path d="${axis === "h" ? hEdge(a, b) : vEdge(a, b)}"/>`)
			.join("");
		// Arrowhead sits 3px short of the port so it meets the ring, not its centre.
		const heads = edges
			.map(([axis, , b]) =>
				axis === "h"
					? `<path d="M${b.x - 3},${b.y} l-17,-8 v16 z"/>`
					: `<path d="M${b.x},${b.y - 3} l-8,-17 h16 z"/>`,
			)
			.join("");

		const svg = document.getElementById("wires");
		if (!svg) throw new Error("#edges declared but there is no <svg id=\"wires\">");
		svg.innerHTML =
			`<g fill="none" stroke="${wireColor}" stroke-width="3.4">${paths}</g>` +
			`<g fill="${wireColor}">${heads}</g>`;
		return edges.length;
	}, WIRE);

	const at2x = `${tmp}${slug}@2x.png`;
	await page.waitForTimeout(150);
	await page.screenshot({ path: at2x });
	await page.close();

	// 3200x2134 -> 1600x1067. Downscaling a 2x render is what keeps the thin
	// strokes and the mono type clean at the 552px the card actually delivers.
	execFileSync("sips", ["-z", String(HEIGHT), String(WIDTH), at2x, "--out", `${out}${slug}.png`], {
		stdio: "ignore",
	});

	console.log(`${slug.padEnd(20)} ${html.padEnd(26)} wires: ${wires}`);
}

await browser.close();
rmSync(tmp, { recursive: true, force: true });
console.log(`\nwrote ${queue.length} panel(s) to public/solutions/`);
