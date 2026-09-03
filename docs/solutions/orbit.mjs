/**
 * Proof harness for the `/solutions` orbit.
 *
 * Asserts that no label escapes the stage into the copy column, that the active
 * one sits level with the copy on the left, that each step slides five labels
 * one 36° slot while exactly one crosses the arc's gap unseen, that the ink
 * clears 4.5:1, that a deep link selects its service, and that the fallbacks
 * fire either side of the `DESKTOP` threshold. Screenshots land in
 * `docs/solutions/shots/`.
 *
 * The widths are chosen around that threshold and are not arbitrary: 1366 is
 * the narrowest that must get the orbit and 1280 the widest that must get the
 * bands. Testing at the threshold itself is what surfaced the scrollbar
 * feedback loop the component's `DESKTOP` comment describes.
 *
 *   node docs/solutions/orbit.mjs           # against a running `npm run dev`
 *   BASE=http://localhost:3001 node docs/solutions/orbit.mjs
 *
 * Contrast is measured from rendered pixels, not from computed `color`: the
 * tokens resolve to `oklab()` and parsing them back is what silently broke the
 * hero harness (see docs/hero/contrast.mjs).
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SHOTS = path.join(import.meta.dirname, "shots");

const STAGE = ".relative.aspect-square";
const CHIP = `${STAGE} button[aria-current]`;

let failures = 0;
const check = (ok, label, detail = "") => {
	console.log(`${ok ? "  ok  " : "  FAIL"} ${label}${detail ? ` — ${detail}` : ""}`);
	if (!ok) failures += 1;
};

/** sRGB relative luminance, per WCAG. */
const luminance = ([r, g, b]) => {
	const f = (c) => {
		const v = c / 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};

const run = async () => {
	await mkdir(SHOTS, { recursive: true });
	const browser = await chromium.launch();

	// ---- desktop geometry -------------------------------------------------
	for (const width of [1600, 1440, 1366]) {
		const page = await browser.newPage({ viewport: { width, height: 1000 } });
		await page.goto(`${BASE}/solutions`, { waitUntil: "networkidle" });
		await page.locator(STAGE).scrollIntoViewIfNeeded();
		await page.waitForTimeout(1200);

		const stage = await page.locator(STAGE).boundingBox();
		const chips = await page.locator(CHIP).all();

		// Labels are allowed over the brand field now — that is what hides the
		// arc's two end slots. Escaping the stage is still a defect: the left
		// edge is the copy column.
		let escapesStage = 0;
		for (const chip of chips) {
			const b = await chip.boundingBox();
			if (!b) continue;
			if (b.x < stage.x - 1 || b.x + b.width > stage.x + stage.width + 1) escapesStage += 1;
		}
		check(escapesStage === 0, `${width}px — no label outside the stage`, `${escapesStage} did`);

		// The active label has to sit level with the copy it unfolds into.
		const active = await page.locator(`${STAGE} button[aria-current="true"]`).boundingBox();
		const dy = Math.abs(active.y + active.height / 2 - (stage.y + stage.height / 2));
		check(dy < 12, `${width}px — active label level with the stage centre`, `${dy.toFixed(0)}px off`);
		check(
			active.x + active.width / 2 < stage.x + stage.width / 2,
			`${width}px — active label on the left of the arc`,
		);

		// Every title has to fit inside its own pill. CYBERSECURITY is the longest
		// unbreakable word and once overflowed its border by 5px.
		const fits = await page.evaluate((sel) => {
			const out = [];
			for (const btn of document.querySelectorAll(`${sel} button[aria-current]`)) {
				const cs = getComputedStyle(btn);
				const interior =
					btn.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
				const range = document.createRange();
				range.selectNodeContents(btn);
				const text = Math.max(0, ...[...range.getClientRects()].map((r) => r.width));
				out.push({ label: btn.textContent.trim(), slack: interior - text });
			}
			return out;
		}, STAGE);
		const tight = fits.filter((f) => f.slack < 8).sort((a, b) => a.slack - b.slack);
		check(
			tight.length === 0,
			`${width}px — every title clears its pill by 8px`,
			tight.map((f) => `${f.label} ${f.slack.toFixed(0)}px`).join(", "),
		);

		// Each label rides its own stage-sized layer and the six are stacked, so a
		// missing `pointer-events-none` leaves the last one covering the scene and
		// swallowing every click meant for the other five.
		const blocked = await page.evaluate((sel) => {
			const out = [];
			for (const btn of document.querySelectorAll(`${sel} button[aria-current]`)) {
				const layer = btn.closest("[style*='opacity']") ?? btn.parentElement;
				if (Number(getComputedStyle(layer).opacity) < 0.9) continue; // parked in the gap
				const r = btn.getBoundingClientRect();
				const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
				if (top !== btn && !btn.contains(top)) out.push(btn.textContent.trim());
			}
			return out;
		}, STAGE);
		check(blocked.length === 0, `${width}px — every visible label is clickable`, blocked.join(", "));
		// Whether the page can actually be scrolled sideways, not whether some
		// absolutely-positioned child reports a box past the edge — the hero's
		// backdrop polygons do the latter by design and are clipped.
		check(
			await page.evaluate(() => {
				window.scrollTo(200, window.scrollY);
				const moved = window.scrollX;
				window.scrollTo(0, window.scrollY);
				return moved === 0;
			}),
			`${width}px — page does not scroll sideways`,
		);

		await page.locator(STAGE).screenshot({ path: path.join(SHOTS, `stage-${width}.png`) });
		await page.close();
	}

	// ---- stepping, wrap, contrast ----------------------------------------
	const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
	await page.goto(`${BASE}/solutions`, { waitUntil: "networkidle" });
	await page.locator(STAGE).scrollIntoViewIfNeeded();
	await page.waitForTimeout(800);

	/** Every label's polar angle about the stage centre, degrees clockwise from
	 *  twelve, keyed by title — plus whether it is currently visible. */
	const arc = () =>
		page.evaluate((sel) => {
			const stage = document.querySelector(sel).getBoundingClientRect();
			const cx = stage.x + stage.width / 2;
			const cy = stage.y + stage.height / 2;
			const out = {};
			for (const btn of document.querySelectorAll(`${sel} button[aria-current]`)) {
				const r = btn.getBoundingClientRect();
				const dx = r.x + r.width / 2 - cx;
				const dy = r.y + r.height / 2 - cy;
				let a = (Math.atan2(dx, -dy) * 180) / Math.PI;
				if (a < 0) a += 360;
				const layer = btn.closest("[style*='opacity']") ?? btn.parentElement;
				out[btn.textContent.trim()] = {
					angle: a,
					visible: Number(getComputedStyle(layer).opacity) > 0.5,
				};
			}
			return out;
		}, STAGE);

	// Exact label, not a regex: Next's dev-tools button also answers to /next/i.
	const next = page.locator('button[aria-label="Next solution"]');
	for (let i = 0; i < 6; i += 1) {
		const before = await arc();
		await next.click();
		await page.waitForTimeout(1100);
		const after = await arc();

		// Every label either steps one 36° slot down the arc, or is the single
		// one crossing the gap between the two ends. Nothing else is legal.
		const moves = Object.keys(after).map((k) => {
			let d = after[k].angle - before[k].angle;
			if (d > 180) d -= 360;
			if (d < -180) d += 360;
			return { k, d, wasVisible: before[k].visible, isVisible: after[k].visible };
		});
		const stepped = moves.filter((m) => Math.abs(m.d + 36) < 3);
		const jumped = moves.filter((m) => Math.abs(m.d + 36) >= 3);
		check(stepped.length === 5, `step ${i + 1} — five labels slide one slot`, `${stepped.length}`);
		check(jumped.length === 1, `step ${i + 1} — exactly one crosses the gap`, `${jumped.length}`);
		check(
			jumped.every((m) => !m.wasVisible && !m.isVisible),
			`step ${i + 1} — the crossing label is hidden at both ends`,
			jumped.map((m) => m.k).join(", "),
		);
		await page.locator(STAGE).screenshot({ path: path.join(SHOTS, `step-${i + 1}.png`) });
	}

	// The arc must be a left half-circle: nothing parked on the right of centre
	// while visible.
	const placed = await arc();
	const strayRight = Object.entries(placed).filter(
		([, v]) => v.visible && v.angle > 5 && v.angle < 175,
	);
	check(strayRight.length === 0, "no visible label on the right of the arc", strayRight.map(([k]) => k).join(", "));

	// Clicking a label has to select that service, not merely be hittable.
	for (const title of ["Cybersecurity", "Outsourcing & Team Augmentation", "Cloud & DevOps"]) {
		const label = page.locator(`${STAGE} button[aria-current]`, { hasText: title }).first();
		if ((await label.evaluate((el) => Number(getComputedStyle(el.closest("[style*='opacity']") ?? el.parentElement).opacity))) < 0.9) {
			// Parked in the gap this turn — step once so it comes round.
			await page.locator('button[aria-label="Next solution"]').click();
			await page.waitForTimeout(1100);
		}
		await label.click();
		await page.waitForTimeout(1100);
		const now = await page.locator(`${STAGE} button[aria-current="true"]`).textContent();
		check(now?.trim() === title, `clicking "${title}" selects it`, now?.trim() ?? "none");
	}

	// Label ink against the ground it actually sits on: 11px is small text, so
	// the bar is 4.5:1. Read from painted pixels — the tokens resolve to
	// `oklab()` and parsing computed `color` is what silently broke the hero
	// harness into passing everything.
	// A *visible* inactive label. The two parked in the arc's gap are at opacity
	// 0, and cropping one of those measures the background against itself.
	const visibleChip = await page.evaluate((sel) => {
		for (const btn of document.querySelectorAll(`${sel} button[aria-current="false"]`)) {
			const layer = btn.closest("[style*='opacity']") ?? btn.parentElement;
			if (Number(getComputedStyle(layer).opacity) > 0.9) {
				const r = btn.getBoundingClientRect();
				return { x: r.x, y: r.y, width: r.width, height: r.height };
			}
		}
		return null;
	}, STAGE);
	check(visibleChip !== null, "a visible inactive label is present to measure");
	const chipBox = visibleChip;
	const crop = await page.screenshot({
		clip: { x: chipBox.x, y: chipBox.y, width: chipBox.width, height: chipBox.height },
	});
	const pixels = await browser.newPage().then(async (p) => {
		await p.setContent(
			`<img id="i" src="data:image/png;base64,${crop.toString("base64")}">`,
		);
		await p.waitForFunction(() => document.getElementById("i").complete);
		const out = await p.evaluate(() => {
			const img = document.getElementById("i");
			const c = document.createElement("canvas");
			c.width = img.naturalWidth;
			c.height = img.naturalHeight;
			const ctx = c.getContext("2d");
			ctx.drawImage(img, 0, 0);
			const d = ctx.getImageData(0, 0, c.width, c.height).data;
			const seen = new Map();
			for (let i = 0; i < d.length; i += 4) {
				const k = `${d[i]},${d[i + 1]},${d[i + 2]}`;
				seen.set(k, (seen.get(k) ?? 0) + 1);
			}
			// Every colour with a real footprint, most common first — not just the
			// top few. At 11px the glyph pixels are a tiny minority: an earlier
			// version took the top 8 by count, which got the pill's ground and its
			// border and never reached the ink, and reported the border's 2.34:1
			// as a contrast failure.
			return [...seen.entries()]
				.filter(([, n]) => n >= 5)
				.sort((a, b) => b[1] - a[1])
				.map(([k]) => k);
		});
		await p.close();
		return out.map((s) => s.split(",").map(Number));
	});
	// Ground is the pill's fill; ink is whatever contrasts with it most, which
	// for light-on-dark is the glyph core.
	const ratio = Math.max(...pixels.slice(1).map((p) => contrast(pixels[0], p)));
	check(ratio >= 4.5, "inactive label ink ≥ 4.5:1 on its ground", `${ratio.toFixed(2)}:1`);

	// ---- deep link --------------------------------------------------------
	await page.goto(`${BASE}/solutions#cybersecurity`, { waitUntil: "networkidle" });
	await page.waitForTimeout(1400);
	const current = await page.locator(`${STAGE} button[aria-current="true"]`).textContent();
	check(/cyber|kyber/i.test(current ?? ""), "#cybersecurity selects its service", current ?? "none");

	// ---- fallbacks --------------------------------------------------------
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto(`${BASE}/solutions`, { waitUntil: "networkidle" });
	await page.waitForTimeout(600);
	check(
		// Not an `h2` count: `<IndustriesGrid>` and `<CtaSection>` add two more.
		(await page.locator(STAGE).count()) === 0 &&
			(await page.locator("section[id]:not(#hero-heading)").count()) === 6,
		"reduced motion falls back to six bands",
	);
	await page.emulateMedia({ reducedMotion: "no-preference" });

	for (const width of [1280, 1024, 768, 390]) {
		await page.setViewportSize({ width, height: 900 });
		await page.goto(`${BASE}/solutions`, { waitUntil: "networkidle" });
		await page.waitForTimeout(600);
		check(
			// Not an `h2` count: `<IndustriesGrid>` and `<CtaSection>` add two more.
		(await page.locator(STAGE).count()) === 0 &&
			(await page.locator("section[id]:not(#hero-heading)").count()) === 6,
			`${width}px falls back to six bands`,
		);
		await page.screenshot({ path: path.join(SHOTS, `bands-${width}.png`), fullPage: false });
	}

	// ---- server markup carries all six ------------------------------------
	const html = await fetch(`${BASE}/solutions`).then((r) => r.text());
	const missing = ["ai-ml", "cybersecurity", "web-development", "outsourcing", "mobile-development", "cloud-devops"]
		.filter((slug) => !html.includes(`id="${slug}"`));
	check(missing.length === 0, "server HTML carries all six services", missing.join(", "));

	await browser.close();
	console.log(failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`);
	process.exit(failures === 0 ? 0 : 1);
};

run();
