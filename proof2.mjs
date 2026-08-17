import pw from "/Users/Radek/ideacomp/ideacomp_redesign/ideacomp.cz/node_modules/playwright/index.js";
const { chromium } = pw;
const OUT = "/private/tmp/claude-501/-Users-Radek-ideacomp-ideacomp-redesign-ideacomp-cz/3e5dac43-b1ce-4287-a275-e730931ca578/scratchpad";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
p.on("console", (m) => m.type() === "error" && errs.push("CONSOLE " + m.text()));
await p.goto("file://" + OUT + "/vlnovky.html", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);

await p.click('button[data-size="ultra"]');
await p.waitForTimeout(800);
const arts = await p.locator("article.concept").all();
for (const i of [2, 4, 5]) {
  await arts[i].scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  await arts[i].locator(".mock").screenshot({ path: `${OUT}/ultra-${i}.png` });
}
await p.click('button[data-motion="on"]');
await p.waitForTimeout(2500);
await p.click('button[data-motion="off"]');
await p.waitForTimeout(500);
console.log(errs.length ? errs : "motion + ultrawide: no errors");
await b.close();
