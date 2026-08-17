"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's faceted slab field: a low-poly relief of large panels meeting at
 * angles, lit by a directional light that follows the pointer.
 *
 * This is our authored stand-in for the reference's `bg-1-1700x803.jpg` — a
 * pre-rendered 3D scene of overlapping lit slabs. We build ours instead of
 * shipping theirs: every fill is a grey at low alpha and never a colour, so the
 * layer tints itself to whatever field sits underneath and recolouring the hero
 * stays a one-token change.
 *
 * **It is real 3D, not a drawing of one.** The mesh below carries a height per
 * vertex; the polygons you see are that mesh run through a pinhole camera, and
 * every panel's brightness is `N · L` against its own face normal. Nothing here
 * is a hand-picked shade any more — see `SHADING`.
 *
 * Three things sell the depth, in descending order of how much work they do:
 *
 *   1. the **light tracks the pointer**, so facets brighten and fall away live.
 *      A static relief reads as a pattern; a relief that relights reads as a
 *      surface.
 *   2. the **camera pans with it too**, which is what turns the relight into
 *      parallax: a vertex 470 units up walks ~26px against one sitting on the
 *      ground plane, so the facets visibly shear past each other rather than
 *      just changing shade. Vertex heights against camera distance are the one
 *      knob for this — see `CAM`.
 *   3. **contact shadows in the valleys only** (`CREASES`) — concave folds
 *      occlude, convex ridges do not, and the difference is computed from the
 *      dihedral rather than authored.
 *
 * Cost: a pointer frame writes three attributes per triangle and one per crease
 * — no layout, no React render. **The blend work, not the attribute writes, is
 * what costs, and two decisions here that look like premature optimisation are
 * not.** Measured on the production build against a control with the layer
 * hidden: an earlier revision was free at 1440 and 1920 but pushed 2560×1440
 * from 16.7ms a frame to 27.5 (p95 53.7), which is where 60fps goes. Both of
 * these bought it back, and both should stay — it now holds 16.7ms flat to 2560
 * and 20ms at 3440 ultrawide:
 *
 *   - The lit and shadowed passes are **composited into one grey fill**, not
 *     stacked (see `greyFill`). Two full-bleed alpha polygons per triangle is
 *     double the blend work over every pixel on screen.
 *   - There is **no CSS 3D tilt on the layer**. A ±2° `rotateX`/`rotateY` was
 *     ~6ms of that 11 on its own, because the SVG's contents change every frame
 *     so the transformed layer re-rasterises rather than composites — and it
 *     was doing a weaker version of the parallax the camera pan already gives.
 */

/* ------------------------------------------------------------------ mesh -- */

type V3 = readonly [number, number, number];

/**
 * Shared vertices, `[x, y, height]` in viewBox units. **Shared is the point**:
 * neighbouring panels quote the same entry, so they project to the same screen
 * point and the field stays a tiling however the camera moves. Overlapping
 * translucent slabs would compound their alpha wherever they crossed, and this
 * layer sits under the headline and paragraph — a tiling means the accumulated
 * white at any pixel is exactly one panel's alpha, which is what makes the field
 * lightness in `.surface-signal` computable. If you add a panel, keep it
 * edge-sharing and reuse these keys.
 *
 * Vertices run well past the viewBox so no panel corner shows up as a floating
 * shard once `preserveAspectRatio="slice"` crops the edges. Heights are all ≥ 0,
 * which keeps every projection scale ≥ 1 — the artwork only ever expands off the
 * canvas, never shrinks inside it and exposes a gap.
 *
 * The heights alternate rather than ramp. A height field that climbs steadily
 * has near-identical normals everywhere, which lights every panel the same and
 * throws the relief away; the earlier draft of this file did exactly that and
 * came out with `nz > 0.99` on all nine faces. Heights on the left (the copy
 * column) are held to a gentler spread than on the right — same reason the
 * alphas are.
 */
const V = {
	tl: [-120, -120, 96],
	t1: [520, -120, 240],
	t2: [1010, -120, 150],
	tr: [1560, -120, 430],
	ml: [-120, 270, 0],
	m1: [400, 180, 168],
	m2: [860, 330, 84],
	mr: [1560, 220, 470],
	ll: [-120, 600, 120],
	l1: [330, 520, 36],
	l2: [760, 660, 250],
	l3: [1180, 560, 110],
	lr: [1560, 640, 400],
	bl: [-120, 1020, 48],
	b1: [450, 900, 150],
	b2: [980, 1020, 60],
	br: [1560, 1020, 415],
} satisfies Record<string, V3>;

type VertexKey = keyof typeof V;

/**
 * The nine panels, wound consistently, each with the peak white alpha it is
 * allowed to reach. These are the same nine footprints and the same nine alphas
 * the flat version shipped, and they stay because the contrast harness was run
 * against them: the two panels under the copy column are held at or below 0.06,
 * and that ceiling is what the field lightness is balanced against.
 *
 * Shading can only ever spend *less* than the number here — see `litAlpha`. That
 * is deliberate and is what lets the relief go in without re-running the harness.
 */
const PANELS: { v: VertexKey[]; alpha: number }[] = [
	// Top band.
	{ v: ["tl", "t1", "m1", "ml"], alpha: 0.045 },
	{ v: ["t1", "t2", "m2", "m1"], alpha: 0.07 },
	{ v: ["t2", "tr", "mr", "m2"], alpha: 0.1 },
	// Middle band.
	{ v: ["ml", "m1", "l1", "ll"], alpha: 0.028 },
	{ v: ["m1", "m2", "l2", "l1"], alpha: 0.055 },
	{ v: ["m2", "mr", "lr", "l3", "l2"], alpha: 0.095 },
	// Bottom band.
	{ v: ["ll", "l1", "b1", "bl"], alpha: 0.04 },
	{ v: ["l1", "l2", "b2", "b1"], alpha: 0.06 },
	{ v: ["l2", "l3", "lr", "br", "b2"], alpha: 0.085 },
];

/* ---------------------------------------------------------------- camera -- */

/**
 * Pinhole camera, looking straight down the field. `z` is the distance out; a
 * vertex at height `h` projects at scale `z / (z - h)` about the camera centre,
 * and the centre itself slides `panX`/`panY` with the pointer.
 *
 * `z` is deliberately far. Heights have to be large for the *normals* to differ
 * enough to light interestingly, but the same heights drive the *projection*,
 * and a near camera would throw the panels so far from their measured footprints
 * that the alpha layout stops meaning anything. 4800 against heights ≤ 470 keeps
 * every vertex inside the copy column within ~20 units of where it was drawn
 * flat, while the far right-hand corners — already off-canvas — swing ~105.
 *
 * A vertex moves `pan · (1 − scale)` as the camera pans, so the ground plane is
 * nailed down and the high ground walks ~26px: that *difference* is the parallax,
 * and it is why the pan is worth the per-frame `points` writes. Inside the copy
 * column nothing moves more than ~9px.
 *
 * `x`/`y` sit on the copy column rather than on the artwork, so that is the part
 * of the field that moves least, and the panels the crop carries off to the
 * right are the ones that swing.
 *
 * **Every height is ≥ 0, which keeps every scale ≥ 1.** The artwork can then only
 * expand off the canvas, never contract inside it and expose an unpainted edge —
 * checked at both pan extremes, where the -120 margin still clears.
 */
const CAM = { x: 620, y: 430, z: 4800, panX: 240, panY: 120 } as const;

/** `mx`/`my` are the pointer, −1…1 from the centre of the viewport. */
const project = ([x, y, z]: V3, mx: number, my: number): [number, number] => {
	const cx = CAM.x + mx * CAM.panX;
	const cy = CAM.y + my * CAM.panY;
	const s = CAM.z / (CAM.z - z);
	return [cx + (x - cx) * s, cy + (y - cy) * s];
};

/* --------------------------------------------------------------- shading -- */

const SHADING = {
	/**
	 * Resting light direction, pointing *at* the light: from the upper left and
	 * well in front. Grazing rather than head-on — a light near the surface normal
	 * flattens everything to the same value, which is the failure mode this whole
	 * layer exists to avoid.
	 */
	light: [-0.34, -0.42, 0.84] as V3,
	/** How far the pointer swings it, at the viewport edges. */
	swingX: 0.45,
	swingY: 0.3,
	/**
	 * The `N · L` window mapped onto the tonal range. Measured, not guessed: the
	 * twenty triangles span 0.32–0.94 at rest and 0.00–0.98 across the pointer
	 * extremes, so this window uses nearly all of the spread without clipping the
	 * common case flat.
	 */
	lamLo: 0.28,
	lamHi: 0.95,
	/**
	 * The lit end of the ramp. A fully lit facet reaches its panel's authored
	 * alpha exactly; an unlit one keeps 35% of it.
	 *
	 * **The ceiling is the contract.** Every white value this layer can produce is
	 * ≤ the flat version's, at every pointer position, so the measured contrast of
	 * the copy over it can only improve. That is also why the tonal range is won
	 * by pushing the dark end down rather than the bright end up: raise this past
	 * 1 and the contract breaks and the harness has to be re-run — see the notes
	 * in `hero.tsx`.
	 */
	floor: 0.35,
	/**
	 * Shadow on the turned-away faces, as black. Black has the opposite sign to
	 * white over light copy — it lowers the backdrop luminance, so it is always
	 * free — which is why the dark end of the ramp is the end with room to move,
	 * and why this is what carries the relief. Scaled partly by the panel's own
	 * alpha so a dim panel does not acquire a deeper shadow than the bright one
	 * beside it.
	 */
	shadeBase: 0.045,
	shadeGain: 0.55,
	/** Bias: shadow stays out of the way until a face is genuinely turned off. */
	shadeCurve: 1.35,
} as const;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Unit normal, flipped to face the camera. */
const faceNormal = (keys: VertexKey[]): V3 => {
	const [a, b, c] = keys.map((k) => V[k]);
	const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
	const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
	const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
	const len = Math.hypot(n[0], n[1], n[2]) * (n[2] < 0 ? -1 : 1);
	return [n[0] / len, n[1] / len, n[2] / len];
};

/**
 * Lit fraction of a face, 0…1, with the pointer at (`mx`, `my`) — each in −1…1
 * from the centre of the viewport.
 */
const litFraction = (n: V3, mx: number, my: number) => {
	const lx = SHADING.light[0] + mx * SHADING.swingX;
	const ly = SHADING.light[1] + my * SHADING.swingY;
	const lz = SHADING.light[2];
	const lam = Math.max(0, (n[0] * lx + n[1] * ly + n[2] * lz) / Math.hypot(lx, ly, lz));
	return clamp01((lam - SHADING.lamLo) / (SHADING.lamHi - SHADING.lamLo));
};

const litAlpha = (base: number, t: number, intensity: number) =>
	base * (SHADING.floor + (1 - SHADING.floor) * t) * intensity;

const shadeAlpha = (base: number, t: number, intensity: number) =>
	(SHADING.shadeBase + SHADING.shadeGain * base) * (1 - t) ** SHADING.shadeCurve * intensity;

/**
 * The lit pass and the shadow pass, folded into the one grey fill that paints
 * identically — not approximately, exactly.
 *
 * White at `a` over black at `b` over a backdrop `F` leaves `F(1−a)(1−b) + 255a`,
 * and both passes are linear in `F`, so a single source-over of grey `g` at
 * alpha `α` matches it wherever `1 − α = (1−a)(1−b)` and `gα = 255a`. Solve, and
 * every pixel on screen is blended once instead of twice.
 *
 * `α` is never 0: the lit pass keeps `SHADING.floor` of the panel's alpha even
 * on a facet turned fully away.
 */
const greyFill = (base: number, t: number, intensity: number) => {
	const a = litAlpha(base, t, intensity);
	const b = shadeAlpha(base, t, intensity);
	const alpha = a + b - a * b;
	return { grey: Math.round((255 * a) / alpha), alpha };
};

/* ----------------------------------------------------------------- build -- */

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * Panels are fan-triangulated before anything is computed with them. A quad with
 * four independent heights is not planar, so it has no single normal — Newell's
 * average over one gives back something close to flat, which is how the first
 * draft of this managed to light nine wildly different panels almost identically.
 * Triangles are planar by construction, and splitting nine panels into twenty
 * facets is also just the low-poly look the reference has.
 */
const TRIANGLES = PANELS.flatMap(({ v, alpha }) =>
	Array.from({ length: v.length - 2 }, (_, i) => {
		const keys = [v[0], v[i + 1], v[i + 2]];
		return { keys, alpha, normal: faceNormal(keys) };
	}),
);

const pointsAt = (keys: VertexKey[], mx: number, my: number) =>
	keys
		.map((k) => {
			const [x, y] = project(V[k], mx, my);
			return `${round(x)},${round(y)}`;
		})
		.join(" ");

/**
 * Contact shadows along the shared edges — the thing that makes a seam read as
 * one slab sitting against another rather than as a colour change.
 *
 * **Valleys only.** An edge where the surface folds toward the camera is a ridge
 * and catches light; one that folds away is a valley and occludes. Which is
 * which comes out of the geometry: if the neighbouring triangle's far vertex
 * sits in front of this triangle's plane, the fold is concave. Roughly half the
 * twenty-four shared edges qualify, and putting a shadow on the other half was
 * what made an earlier pass look like a wireframe.
 *
 * Strength tracks the dihedral, so a nearly flat join contributes nothing.
 *
 * The stroke straddles the edge instead of hugging its low side, which a real
 * contact shadow would not; at these widths it reads as a soft crease either
 * way, and being black it can only help the copy above it.
 */
const CREASES = (() => {
	const shared = new Map<string, number[]>();
	TRIANGLES.forEach((t, i) => {
		for (let e = 0; e < 3; e++) {
			const key = [t.keys[e], t.keys[(e + 1) % 3]].sort().join("|");
			shared.set(key, [...(shared.get(key) ?? []), i]);
		}
	});

	const out: { keys: VertexKey[]; alpha: number }[] = [];
	for (const [key, tris] of shared) {
		if (tris.length !== 2) continue;
		const [a, b] = tris.map((i) => TRIANGLES[i]);
		const [ka, kb] = key.split("|") as VertexKey[];

		// Concave? Test the far vertex of B against A's plane, at the edge midpoint.
		const far = V[b.keys.find((k) => k !== ka && k !== kb) as VertexKey];
		const depth = [0, 1, 2].reduce(
			(sum, c) => sum + a.normal[c] * (far[c] - (V[ka][c] + V[kb][c]) / 2),
			0,
		);
		if (depth <= 0) continue;

		const bend = 1 - [0, 1, 2].reduce((sum, c) => sum + a.normal[c] * b.normal[c], 0);
		const alpha = 0.075 * clamp01(bend / 0.6);
		if (alpha < 0.005) continue;

		out.push({ keys: [ka, kb], alpha });
	}
	return out;
})();

const creaseAt = (keys: VertexKey[], mx: number, my: number) => {
	const [x1, y1] = project(V[keys[0]], mx, my);
	const [x2, y2] = project(V[keys[1]], mx, my);
	return `M${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}`;
};

/* ------------------------------------------------------------- component -- */

/** Per-frame approach to the pointer target. No spring; this is a plain lag. */
const EASE = 0.09;

interface FacetFieldProps {
	className?: string;
	/**
	 * Multiplier on every alpha, for surfaces where the copy cannot be kept off
	 * the bright right-hand panels.
	 *
	 * The 6% ceiling above is only ever met in the *tall* home hero, where the
	 * height drives `slice` and the horizontal crop carries the bright panels off
	 * to the right of the copy — see the `xMin` note. In a short banner the width
	 * drives instead, so the brightest panel sits at a fixed 60% of the width
	 * whatever the viewport, which on the cyan field put 9.5% white under the tail
	 * of the paragraph and took it to 3.9:1. Dialling the whole field back is what
	 * buys that back (0.6 → 5.7% worst case → 4.8:1); shifting the artwork instead
	 * would just move the problem to another panel.
	 */
	intensity?: number;
}

const FacetField = ({ className, intensity = 1 }: FacetFieldProps) => {
	const hostRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		// Mouse only, as in the reference — a touch device gets the resting pose,
		// which also covers `prefers-reduced-motion`: the relief is still there and
		// still lit, it simply stops answering the pointer.
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const facets = host.querySelectorAll<SVGElement>("[data-facet]");
		const creases = host.querySelectorAll<SVGElement>("[data-crease]");

		let frame = 0;
		let targetX = 0;
		let targetY = 0;
		let x = 0;
		let y = 0;

		const paint = () => {
			TRIANGLES.forEach((t, i) => {
				const facet = facets[i];
				if (!facet) return;
				const { grey, alpha } = greyFill(t.alpha, litFraction(t.normal, x, y), intensity);
				facet.setAttribute("points", pointsAt(t.keys, x, y));
				facet.setAttribute("fill", `rgb(${grey},${grey},${grey})`);
				facet.setAttribute("fill-opacity", alpha.toFixed(4));
			});
			// Occlusion, so it does not care where the light is — only where the
			// geometry went.
			CREASES.forEach((c, i) => creases[i]?.setAttribute("d", creaseAt(c.keys, x, y)));
		};

		const tick = () => {
			x += (targetX - x) * EASE;
			y += (targetY - y) * EASE;
			paint();
			frame =
				Math.abs(targetX - x) > 0.002 || Math.abs(targetY - y) > 0.002
					? requestAnimationFrame(tick)
					: 0;
		};

		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== "mouse") return;
			// Viewport-relative only. Nothing is measured per event, so there is no
			// rect to cache and no layout to thrash.
			targetX = (e.clientX / window.innerWidth - 0.5) * 2;
			targetY = (e.clientY / window.innerHeight - 0.5) * 2;
			if (!frame) frame = requestAnimationFrame(tick);
		};

		// Track the window, like the reference does, so the field keeps answering
		// while the pointer is anywhere on screen — but only while it is in view.
		let attached = false;
		const attach = () => {
			if (attached) return;
			window.addEventListener("pointermove", onMove, { passive: true });
			attached = true;
		};
		const detach = () => {
			if (attached) {
				window.removeEventListener("pointermove", onMove);
				attached = false;
			}
			if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		};

		const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? attach() : detach()), {
			threshold: 0,
		});
		io.observe(host);

		return () => {
			detach();
			io.disconnect();
		};
	}, [intensity]);

	return (
		<svg
			ref={hostRef}
			className={className}
			viewBox="0 0 1440 900"
			// Cover, don't letterbox — the same job `background-size: cover` does for
			// the reference's baked render.
			//
			// `xMin`, not `xMid`, and that is load-bearing. The panel alphas are laid
			// out so the copy column gets the dim ones, and that only holds if the
			// artwork's left edge stays pinned to the viewport's. Centring the crop
			// slides the bright right-hand panels leftward as the viewport narrows: at
			// 1024 it put the 0.095 panel under the paragraph and took it to 4.45:1.
			// Anchored left, the crop eats the bright end instead.
			preserveAspectRatio="xMinYMid slice"
			aria-hidden="true"
			focusable="false"
		>
			{TRIANGLES.map((t, i) => {
				const { grey, alpha } = greyFill(t.alpha, litFraction(t.normal, 0, 0), intensity);
				return (
					<polygon
						key={i}
						data-facet=""
						points={pointsAt(t.keys, 0, 0)}
						fill={`rgb(${grey},${grey},${grey})`}
						fillOpacity={alpha.toFixed(4)}
					/>
				);
			})}

			{/* A wide faint stroke under a narrow firm one is a soft shadow for the
			    price of a stroke — and the two are `<use>` of one path, so a frame
			    moves the crease once and they cannot fall out of step. A real
			    `feGaussianBlur` here would be the only filter in the hero and would
			    re-rasterise the whole layer every frame.

			    The opacities are fixed: occlusion does not move with the light. */}
			<defs>
				{CREASES.map((c, i) => (
					<path key={i} data-crease="" id={`ff-c${i}`} d={creaseAt(c.keys, 0, 0)} />
				))}
			</defs>
			<g fill="none" stroke="#000" strokeLinecap="round">
				{CREASES.map((c, i) => (
					<use
						key={i}
						href={`#ff-c${i}`}
						strokeWidth={16}
						strokeOpacity={(c.alpha * 0.28 * intensity).toFixed(4)}
					/>
				))}
				{CREASES.map((c, i) => (
					<use
						key={i}
						href={`#ff-c${i}`}
						strokeWidth={4}
						strokeOpacity={(c.alpha * intensity).toFixed(4)}
					/>
				))}
			</g>
		</svg>
	);
};

export default FacetField;
