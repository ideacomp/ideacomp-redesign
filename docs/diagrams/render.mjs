import { chromium } from 'playwright';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1600,height:1067},deviceScaleFactor:2})).newPage();
const here = new URL('.', import.meta.url).pathname;
await p.goto('file://'+here+'ai-pipeline.html',{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(500);

// Measure real port centres, then draw the wires from those coordinates so the
// geometry can never drift out of sync with the node boxes.
const built = await p.evaluate(() => {
  const centre = (nodeId, side) => {
    const n = document.getElementById(nodeId);
    const el = n.querySelector('.port.' + side);
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width/2 + scrollX, y: r.y + r.height/2 + scrollY };
  };
  // Node-editor edges: leave and arrive along the port's own axis.
  const hEdge = (a, b) => {
    const d = Math.max(70, Math.abs(b.x - a.x) * 0.55);
    return `M${a.x},${a.y} C${a.x+d},${a.y} ${b.x-d},${b.y} ${b.x},${b.y}`;
  };
  const vEdge = (a, b) => {
    const d = Math.max(60, Math.abs(b.y - a.y) * 0.5);
    return `M${a.x},${a.y} C${a.x},${a.y+d} ${b.x},${b.y-d} ${b.x},${b.y}`;
  };
  const E = [
    ['h', centre('n1','r'), centre('n2','l')],
    ['h', centre('n2','r'), centre('n3','l')],
    ['v', centre('n2','b'), centre('n4','t')],
    ['v', centre('n3','b'), centre('n5','t')],
    ['h', centre('n4','r'), centre('n5','l')],
  ];
  const paths = E.map(([k,a,b]) => `<path d="${k==='h'?hEdge(a,b):vEdge(a,b)}"/>`).join('');
  const heads = E.map(([k,,b]) => k==='h'
    ? `<path d="M${b.x-3},${b.y} l-17,-8 v16 z"/>`
    : `<path d="M${b.x},${b.y-3} l-8,-17 h16 z"/>`).join('');
  const svg = document.getElementById('wires');
  svg.innerHTML =
    `<g fill="none" stroke="#4f8persist" stroke-width="3.4">${paths}</g>` +
    `<g fill="#4f8396">${heads}</g>`;
  svg.innerHTML = svg.innerHTML.replace('#4f8persist','#4f8396');
  return E.length;
});
console.log('wires drawn:', built);
await p.waitForTimeout(200);
await p.screenshot({path: here+'../../public/ai-solution@2x.png'});
await b.close();
console.log('Wrote public/ai-solution@2x.png — downscale it to 1600x1067 and save as public/ai-solution.png');
