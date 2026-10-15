/* Shared helpers for the /solutions motion panels. Plain script, not a module,
 * so a scene opens straight from file:// with no server.
 *
 * Everything here is a pure function of its arguments — no timers, no rAF — so
 * a scene's render(t) stays deterministic and capture.mjs can seek anywhere. */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lin = (t, [a, b]) => clamp((t - a) / (b - a));
const span = (t, a, b) => clamp((t - a) / (b - a));
// Quint-out: a closed-form stand-in for the house cubic-bezier(.16,1,.3,1).
const out = (p) => 1 - Math.pow(1 - p, 5);
const inOut = (p) => (p < 0.5 ? 16 * p ** 5 : 1 - Math.pow(-2 * p + 2, 5) / 2);
const $ = (id) => document.getElementById(id);

const CHECK =
	'<svg viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" fill="none" stroke="#00a3ff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** The hero's triangles. `x`/`y` in % of the canvas, `s` in px. */
function triangles(host, list) {
	host.innerHTML = list
		.map(
			(t) =>
				`<span style="left:${t.x}%;top:${t.y}%;width:${t.s}px;background:${
					t.tone === "light" ? `rgba(255,255,255,${t.a})` : `rgba(0,10,40,${t.a})`
				}" data-r="${t.r}" data-dx="${t.dx}" data-dy="${t.dy}" data-ph="${t.ph}"></span>`,
		)
		.join("");
}

/** Slow drift, one full sine per loop, so the last frame meets the first. */
function drift(host, t, duration) {
	const w = (2 * Math.PI * t) / duration;
	for (const el of host.children) {
		const ph = +el.dataset.ph;
		const x = +el.dataset.dx * Math.sin(w + ph);
		const y = +el.dataset.dy * Math.cos(w + ph);
		const r = +el.dataset.r + 3 * Math.sin(w + ph);
		el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
	}
}

/** Straight wires between `from:r` and `to:l` ports, measured from the DOM. */
function wires(svg, pairs) {
	const centre = (id, side) => {
		const r = $(id).querySelector(".port." + side).getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	};
	const list = pairs.map(([a, b]) => ({ a: centre(a, "r"), b: centre(b, "l") }));
	svg.innerHTML = list
		.map(
			(w, i) => `
    <line x1="${w.a.x}" y1="${w.a.y}" x2="${w.b.x}" y2="${w.b.y}" stroke="rgba(255,255,255,.3)" stroke-width="5"/>
    <line id="wl${i}" x1="${w.a.x}" y1="${w.a.y}" x2="${w.a.x}" y2="${w.b.y}" stroke="#fff" stroke-width="5"/>
    <circle id="wp${i}" r="11" fill="#fff" cx="${w.a.x}" cy="${w.a.y}" style="filter:drop-shadow(0 0 12px #fff)"/>`,
		)
		.join("");
	return list;
}

/** A packet travels the wire; the wire stays lit behind it. */
function wire(w, i, p, fade) {
	const x = w.a.x + (w.b.x - w.a.x) * p;
	const line = $("wl" + i);
	line.setAttribute("x2", x);
	line.style.opacity = fade;
	const dot = $("wp" + i);
	dot.setAttribute("cx", x);
	dot.style.opacity = p > 0 && p < 1 ? 1 : 0;
}

/** idle → running (spinner, lifted border) → done (check). `reset` 0..1 eases it back to idle. */
function node(el, t, [a, b], reset) {
	const running = t >= a && t < b;
	const done = t >= b;
	el.classList.toggle("on", running && reset === 0);
	el.classList.toggle("done", done && reset < 0.5);
	const badge = el.querySelector(".badge");
	if (running) {
		badge.innerHTML = `<span class="spin" style="transform:rotate(${(t - a) * 540}deg)"></span>`;
		badge.style.borderColor = "#1f2a38";
	} else if (done) {
		badge.innerHTML = CHECK;
		badge.style.borderColor = "#2f78b4";
	} else {
		badge.innerHTML = "";
		badge.style.borderColor = "#2c3a4b";
	}
	badge.style.opacity = 1 - reset;
	// Idle cards sit back on the field; working and finished ones are solid.
	const lit = done || running ? 1 : 0.42;
	el.style.setProperty("--o", lit + (0.42 - lit) * reset);
}

function status(led, label, running, complete, t) {
	label.textContent = running ? "running" : complete ? "completed" : "idle";
	led.style.background = running ? "#00a3ff" : complete ? "#fff" : "rgba(255,255,255,.3)";
	led.style.boxShadow = running ? `0 0 ${10 + 6 * Math.sin(t * 9)}px #00a3ff` : "none";
}

/* ---------- story helpers, shared by every multi-scene panel ---------- */

/** Overshooting ease for things that spring into place. */
const back = (p) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2);

/** Masked line: rises in on `pin` 0→1, leaves upward on `pout` 0→1. */
function mask(el, pin, pout) {
	el.style.transform = `translateY(${(1 - out(pin)) * 110 - inOut(pout) * 110}%)`;
}

/** Camera from keyframes [t, x, y, scale]. Consecutive keys ease into each
 *  other; a repeated key is a hold. Returns t → [x, y, scale]. */
function camera(keys) {
	return (t) => {
		for (let i = 0; i < keys.length - 1; i++) {
			const [a, ...A] = keys[i];
			const [b, ...B] = keys[i + 1];
			if (t >= a && t <= b) {
				const p = inOut(span(t, a, b));
				return A.map((v, j) => v + (B[j] - v) * p);
			}
		}
		return keys[keys.length - 1].slice(1);
	};
}

/** Chapter ticks fill per scene; the bar clears in the last half-second so
 *  the final frame matches frame 0. */
function chapters(host, scenes, t, duration) {
	const ticks = host.querySelectorAll("b");
	scenes.forEach(([a, b], i) => {
		ticks[i].style.width = lin(t, [a, b]) * 100 + "%";
	});
	host.style.opacity = 1 - inOut(span(t, duration - 0.5, duration - 0.05));
}

/** One caption per window [in, out]: rises in over 0.6s, leaves over 0.45s. */
function captions(spans, windows, t) {
	windows.forEach(([a, b], i) => mask(spans[i], span(t, a, a + 0.6), span(t, b, b + 0.45)));
}

/** Packet easing. A gentle sine rather than the quint used for layout moves:
 *  quint peaks at ~2.5x its average speed, which at 30fps made packets jump
 *  across the wire in a few frames. Sine peaks at ~1.6x. */
const glide = (p) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(p));

/** Straight wires with a lit overlay and a packet that drags a fading tail.
 *  Returns a setter: set(i, base, lit, pkt, dir) — base opacity, lit
 *  fraction 0..1, packet position 0..1 (or null), dir +1 travelling a→b,
 *  -1 travelling back. `list` is [[{x,y},{x,y}], …]. */
function makeLines(svg, list, prefix) {
	const TAIL = 0.16; // tail length as a fraction of the wire
	svg.insertAdjacentHTML("beforeend", list.map(([a, b], i) => `
		<defs><linearGradient id="${prefix}g${i}" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/>
		</linearGradient></defs>
		<line id="${prefix}b${i}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="rgba(255,255,255,.3)" stroke-width="5"/>
		<line id="${prefix}l${i}" x1="${a.x}" y1="${a.y}" x2="${a.x}" y2="${a.y}" stroke="#fff" stroke-width="5"/>
		<line id="${prefix}t${i}" stroke="url(#${prefix}g${i})" stroke-width="12" stroke-linecap="round"/>
		<circle id="${prefix}p${i}" r="12" fill="#fff" style="filter:drop-shadow(0 0 14px #fff)"/>`).join(""));
	return (i, base, lit, pkt, dir = 1) => {
		const [a, b] = list[i];
		const at = (q) => ({ x: a.x + (b.x - a.x) * q, y: a.y + (b.y - a.y) * q });
		$(prefix + "b" + i).style.opacity = base;
		const l = $(prefix + "l" + i);
		const e = at(lit);
		l.setAttribute("x2", e.x);
		l.setAttribute("y2", e.y);
		l.style.opacity = base;
		const p = $(prefix + "p" + i), tl = $(prefix + "t" + i);
		if (pkt === null || pkt <= 0 || pkt >= 1) { p.style.opacity = 0; tl.style.opacity = 0; return; }
		const h = at(pkt), s = at(clamp(pkt - dir * TAIL));
		p.setAttribute("cx", h.x);
		p.setAttribute("cy", h.y);
		p.style.opacity = base;
		for (const [k, v] of [["x1", s.x], ["y1", s.y], ["x2", h.x], ["y2", h.y]]) {
			tl.setAttribute(k, v);
			$(prefix + "g" + i).setAttribute(k, v);
		}
		tl.style.opacity = base;
	};
}

/** Packet out on [a,b] then back on [c,d]: [position 0..1 or null, dir]. */
function roundTrip(t, a, b, c, d) {
	const o = glide(span(t, a, b));
	const r = glide(span(t, c, d));
	if (o > 0 && o < 1) return [o, 1];
	if (r > 0 && r < 1) return [1 - r, -1];
	return [null, 1];
}

/** A scene authored at one pace and played slower: wraps draw(t) so the
 *  exported render/DURATION are in real seconds. */
function paced(draw, duration, pace) {
	window.DURATION = duration * pace;
	window.render = (t) => draw((((t / pace) % duration) + duration) % duration);
	window.render(0);
}

/** Typewriter: the first n characters of `text` at progress p. */
const typed = (text, p) => text.slice(0, Math.round(text.length * clamp(p)));

/** Shared triangle set, so the six pieces share one field. */
const TRIS = [
	{ x: -4, y: 52, s: 520, r: -12, tone: "dark", a: 0.10, dx: 22, dy: 12, ph: 0.0 },
	{ x: 30, y: -14, s: 300, r: 26, tone: "dark", a: 0.10, dx: 16, dy: 14, ph: 1.3 },
	{ x: 60, y: 70, s: 220, r: -34, tone: "dark", a: 0.12, dx: 18, dy: 10, ph: 2.1 },
	{ x: 74, y: 8, s: 560, r: 18, tone: "light", a: 0.08, dx: 24, dy: 16, ph: 0.7 },
	{ x: 90, y: 64, s: 160, r: -24, tone: "light", a: 0.16, dx: 14, dy: 12, ph: 3.4 },
	{ x: 46, y: 84, s: 130, r: -8, tone: "light", a: 0.12, dx: 12, dy: 10, ph: 4.2 },
];

/** Rect-to-rect morph for an absolutely positioned element with
 *  transform-origin 0 0: it sits at `to` and is transformed back to `from`. */
function morph(el, from, to, p) {
	const x = from.x + (to.x - from.x) * p, y = from.y + (to.y - from.y) * p;
	const sx = (from.w + (to.w - from.w) * p) / to.w, sy = (from.h + (to.h - from.h) * p) / to.h;
	el.style.left = to.x + "px";
	el.style.top = to.y + "px";
	el.style.transform = `translate(${x - to.x}px, ${y - to.y}px) scale(${sx}, ${sy})`;
}

/** Camera focus: keyframe that puts canvas point P at screen point Q at zoom S. */
const focus = (Q, P, S) => [Q.x - 800 - S * (P.x - 800), Q.y - 545 - S * (P.y - 545), S];

/** morph()'s mirror, for an element whose own CSS size is `from`: it sits at
 *  `from` and is transformed out to `to`. Use this when the element shrinks
 *  away into something else, so its contents lay out at full size. */
function morphFrom(el, from, to, p) {
	const x = from.x + (to.x - from.x) * p, y = from.y + (to.y - from.y) * p;
	const sx = (from.w + (to.w - from.w) * p) / from.w, sy = (from.h + (to.h - from.h) * p) / from.h;
	el.style.left = from.x + "px";
	el.style.top = from.y + "px";
	el.style.transform = `translate(${x - from.x}px, ${y - from.y}px) scale(${sx}, ${sy})`;
}

/* ---------- language ----------
   Scenes are authored in English with Czech alongside: an element with
   data-cs gets that markup when the page is opened with ?lang=cs, and tr()
   picks between two strings in script. capture.mjs renders both. */
const LANG = new URLSearchParams(location.search).get("lang") === "cs" ? "cs" : "en";
const tr = (en, cs) => (LANG === "cs" ? cs : en);
if (LANG === "cs") {
	document.documentElement.lang = "cs";
	document.querySelectorAll("[data-cs]").forEach((el) => { el.innerHTML = el.dataset.cs; });
}
