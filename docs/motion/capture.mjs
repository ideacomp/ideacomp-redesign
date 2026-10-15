/* Renders the /solutions motion panels from docs/motion/*.html to
 * public/solutions/<slug>.mp4 plus a poster frame.
 *
 *   node docs/motion/capture.mjs ai-ml                # full render
 *   node docs/motion/capture.mjs ai-ml --stills 1,3.5,6.2,8.6
 *                                                     # PNGs only, for checking
 *
 * Technique borrowed from latent-spaces/brag (brag-slim): each scene exposes
 * `window.render(t)` and `window.DURATION`, every frame is a pure function of
 * `t`, and frames are captured one by one rather than screen-recorded. That is
 * what makes the output deterministic and the loop point exact — the scene at
 * t = DURATION is the scene at t = 0.
 *
 * Silent on purpose: these autoplay muted in a card, so there is no audio track.
 *
 * Authored at 1600×1067 (the panel.css canvas), encoded at 1200×800. The orbit
 * card is 408 CSS px, 816 device px at 2x, so 1200 has headroom without
 * shipping the full canvas.
 */

import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const repo = fileURLToPath(new URL("../../", import.meta.url));

const SCENES = {
	"ai-ml": { html: "ai-agent.html", poster: 20.8 },
	cybersecurity: { html: "cyber-soc.html", poster: 21.6 },
	"web-development": { html: "web-clinic.html", poster: 15.6 },
	outsourcing: { html: "outsourcing-board.html", poster: 21.2 },
	"mobile-development": { html: "mobile-field.html", poster: 16.6 },
	"cloud-devops": { html: "cloud-friday.html", poster: 22.6 },
};

const FPS = 60;
const W = 1600;
const H = 1067;
const OUT_W = 1200;
const OUT_H = 800;

// `--lang cs` renders the Czech cut to <slug>-cs.mp4; English is the default.
const argv = process.argv.slice(2);
const li = argv.indexOf("--lang");
const lang = li >= 0 ? argv.splice(li, 2)[1] : "en";
const suffix = lang === "en" ? "" : `-${lang}`;
const [slug, flag, list] = argv;
const scene = SCENES[slug];
if (!scene) {
	console.error(`usage: capture.mjs <${Object.keys(SCENES).join("|")}> [--stills t1,t2,…]`);
	process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
// A scene that throws still renders *something*, so fail loudly instead.
page.on("pageerror", (err) => {
	console.error(`${scene.html}: ${err.message}`);
	process.exit(1);
});
await page.goto(`file://${here}${scene.html}?lang=${lang}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const duration = await page.evaluate(() => window.DURATION);

const shoot = async (t, path) => {
	await page.evaluate((t) => window.render(t), t);
	await page.screenshot({ path });
};

if (flag === "--stills") {
	const dir = here + ".stills/";
	mkdirSync(dir, { recursive: true });
	for (const t of list.split(",").map(Number)) {
		await shoot(t, `${dir}${slug}${suffix}-${t.toFixed(2)}.png`);
		console.log(`${dir}${slug}${suffix}-${t.toFixed(2)}.png`);
	}
	await browser.close();
	process.exit(0);
}

const frames = here + `.frames-${slug}${suffix}/`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const total = Math.round(duration * FPS);
for (let i = 0; i < total; i++) {
	await shoot(i / FPS, `${frames}${String(i).padStart(4, "0")}.png`);
	if (i % 60 === 0) process.stdout.write(`frame ${i}/${total}\r`);
}
await shoot(scene.poster, `${frames}poster.png`);
await browser.close();

const out = repo + "public/solutions/";
const scale = `scale=${OUT_W}:${OUT_H}:flags=lanczos`;

execFileSync("ffmpeg", [
	"-y", "-loglevel", "error",
	"-framerate", String(FPS), "-i", `${frames}%04d.png`,
	"-vf", scale,
	"-c:v", "libx264", "-preset", "slow", "-crf", "22", "-tune", "animation",
	"-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
	`${out}${slug}${suffix}.mp4`,
]);
execFileSync("ffmpeg", [
	"-y", "-loglevel", "error",
	"-i", `${frames}poster.png`, "-vf", scale, "-q:v", "3",
	`${out}${slug}${suffix}-poster.jpg`,
]);

// Frame 0 as a still: the autoplaying player shows it until the video starts,
// so playback begins on the same picture instead of cutting from the settled
// poster (the end of the story) back to an empty opening frame.
execFileSync("ffmpeg", [
	"-y", "-loglevel", "error",
	"-i", `${frames}0000.png`, "-vf", scale, "-q:v", "3",
	`${out}${slug}${suffix}-start.jpg`,
]);

rmSync(frames, { recursive: true, force: true });
console.log(`\nwrote public/solutions/${slug}${suffix}.mp4 and ${slug}${suffix}-poster.jpg (${total} frames, ${duration}s)`);
