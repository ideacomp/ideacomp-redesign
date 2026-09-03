import { chromium } from "playwright";

const PORT = process.env.PORT ?? 3119;
const OUT = process.argv[2] ?? "/tmp/wm";
const WIDTHS = process.argv[3]
	? process.argv[3].split(",").map(Number)
	: [3840, 2560, 1920, 1600, 1512, 1440, 1366, 1280, 1279, 1200, 1152, 1100, 1024, 900, 768, 390];

const browser = await chromium.launch();

for (const w of WIDTHS) {
	const h = w >= 2560 ? 1440 : 900;
	const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
	for (let a = 0; a < 4; a++) {
		await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
		if (await page.$("#capabilities")) break;
		await page.waitForTimeout(1500);
	}
	for (let i = 0; i < 14; i++) {
		await page.mouse.wheel(0, h);
		await page.waitForTimeout(250);
	}
	await page.waitForTimeout(900);
	await page.evaluate(() => window.scrollTo(0, 0));
	await page.waitForTimeout(500);

	const rows = await page.evaluate(() => {
		const charRect = (el, i) => {
			const node = el.firstChild;
			const range = document.createRange();
			range.setStart(node, i < 0 ? node.textContent.length - 1 : i);
			range.setEnd(node, i < 0 ? node.textContent.length : i + 1);
			return range.getBoundingClientRect();
		};
		const visible = (rect, cut) =>
			Math.max(0, Math.min(cut, rect.right) - Math.max(0, rect.left)) / rect.width;

		const out = [];
		for (const el of document.querySelectorAll("span")) {
			const cs = getComputedStyle(el);
			if (parseFloat(cs.fontSize) < 40) continue;
			if (cs.textTransform !== "uppercase") continue;
			const r = el.getBoundingClientRect();
			const section = el.closest("section");
			const sr = section.getBoundingClientRect();
			let cut = Math.min(r.right, window.innerWidth);
			let coveredBy = "viewport";
			for (const b of section.querySelectorAll("[role='list'], img")) {
				const br = b.getBoundingClientRect();
				if (br.top > r.bottom || br.bottom < r.top) continue;
				if (br.left > r.left && br.left < cut) {
					cut = br.left;
					coveredBy = "cards";
				}
			}
			out.push({
				word: el.textContent.trim(),
				fontSize: Math.round(parseFloat(cs.fontSize)),
				lastPct: Math.round(visible(charRect(el, -1), cut) * 100),
				firstPct: Math.round(visible(charRect(el, 0), cut) * 100),
				coveredBy,
				bottomClip: Math.max(0, Math.round(r.bottom - sr.bottom)),
			});
		}
		return out;
	});
	const hScroll = await page.evaluate(
		() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
	);
	const d = rows.find((r) => /disciplin/i.test(r.word));
	console.log(
		`${String(w).padStart(4)}px  h-scroll ${hScroll}  |  DISCIPLINES ${String(d?.fontSize).padStart(3)}px  ` +
			`first ${String(d?.firstPct).padStart(3)}%  last-S ${String(d?.lastPct).padStart(3)}% (cut by ${d?.coveredBy})  ` +
			`|  others bottom-clip ${rows
				.filter((r) => !/disciplin/i.test(r.word))
				.map((r) => r.bottomClip)
				.join("/")}`,
	);

	if (process.argv[4]) await page.screenshot({ path: `${OUT}-${w}.png`, fullPage: true });
	await page.close();
}

await browser.close();
