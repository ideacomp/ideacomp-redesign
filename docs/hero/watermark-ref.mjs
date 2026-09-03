/**
 * Measures how the ConsultBiz reference (templatemonster demo 52524) places its
 * oversized background section words, so ours can be anchored the same way.
 *
 * Cloudflare: headful + a real UA, and wait on a DOM selector, not the title —
 * see the `ideacomp-consultbiz-reference` note. Run: node docs/hero/watermark-ref.mjs
 */
import { chromium } from "playwright";

const OUT = process.argv[2] ?? "/tmp/wm-ref";

const browser = await chromium.launch({
	headless: false,
	args: ["--disable-blink-features=AutomationControlled"],
});
const page = await browser.newPage({
	viewport: { width: 1440, height: 900 },
	userAgent:
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
});

await page.goto("https://livedemo00.template-help.com/wt_52524/", {
	waitUntil: "domcontentloaded",
	timeout: 120000,
});
await page.waitForSelector("[data-depth]", { timeout: 120000 });
await page.waitForTimeout(3000);

// Walk everything and keep elements whose type is enormous — that is what the
// oversized background word is, whatever class it happens to carry.
const found = await page.evaluate(() => {
	const out = [];
	for (const el of document.querySelectorAll("body *")) {
		const cs = getComputedStyle(el);
		const size = parseFloat(cs.fontSize);
		if (!(size >= 60)) continue;
		const text = (el.textContent ?? "").trim();
		if (!text || text.length > 40) continue;
		// Only leaf-ish nodes, so a wrapper does not report its child's word.
		if (el.children.length > 1) continue;
		const r = el.getBoundingClientRect();
		if (r.width === 0) continue;

		let sec = el.closest("section, .section, div[class*='section']") ?? el.parentElement;
		const sr = sec.getBoundingClientRect();

		out.push({
			text: text.slice(0, 40),
			tag: el.tagName,
			cls: el.className?.toString().slice(0, 120),
			fontSize: size,
			fontWeight: cs.fontWeight,
			letterSpacing: cs.letterSpacing,
			textTransform: cs.textTransform,
			color: cs.color,
			opacity: cs.opacity,
			webkitTextStroke: cs.webkitTextStroke,
			position: cs.position,
			left: cs.left,
			right: cs.right,
			top: cs.top,
			bottom: cs.bottom,
			transform: cs.transform,
			zIndex: cs.zIndex,
			// Where the word sits inside its own section, in px and as a fraction.
			box: { w: Math.round(r.width), h: Math.round(r.height) },
			offsetFromSectionLeft: Math.round(r.left - sr.left),
			offsetFromSectionLeftPct: +(((r.left - sr.left) / sr.width) * 100).toFixed(1),
			offsetFromSectionRight: Math.round(sr.right - r.right),
			offsetFromSectionBottom: Math.round(sr.bottom - r.bottom),
			sectionWidth: Math.round(sr.width),
			sectionCls: sec.className?.toString().slice(0, 80),
			viewportLeft: Math.round(r.left),
		});
	}
	return out;
});

console.log(JSON.stringify(found, null, 2));

// Full-page reference shot for the composition itself.
for (let i = 0; i < 20; i++) {
	await page.mouse.wheel(0, 800);
	await page.waitForTimeout(250);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}-full.png`, fullPage: true });

await browser.close();
