/* The hero plateau: geometry, projection and shading for the baked background.
 *
 * Pure — no DOM, no filesystem. Imported by BOTH `plateau.mjs` (which renders it)
 * and `verify.mjs` (which checks the result), so the validator asserts against
 * the same face list that was drawn rather than against a guess. That sharing is
 * the whole reproducibility mechanism; keep this module free of side effects.
 *
 * WHY THIS IS BAKED AT ALL. The design reference (templatemonster 52524) does
 * its hero depth with one pre-rendered raster, not with vector shapes. Four
 * attempts here recreated it live — SVG facets, DOM slabs — and every one read
 * flat, because the thing that makes a render look three-dimensional is large
 * soft shadows and gradient falloff, and those are exactly what you cannot
 * afford per frame (measured: 130ms/frame at 3440x1440 for a translucent DOM
 * pane layer). Offline they are free. If a future revision is tempted back into
 * live vectors, that is the history it is repeating.
 */

/* ------------------------------------------------------------------ space -- */

/**
 * AXONOMETRIC, not pinhole — and this is the projection decision the whole
 * object depends on.
 *
 * A pinhole camera scales a vertex by `z / (z - h)` about a principal point, so
 * the apparent height of a riser depends on how far that riser is from the
 * principal point, and at any camera distance sane enough to keep the tiers from
 * ballooning, every riser comes out a thin sliver against treads ten times their
 * size. Two drafts died that way: the steps read as translucent sheets stacked
 * flat, which is exactly the failure the whole baked-raster exercise exists to
 * escape. `FacetField` could use a pinhole because it was a folded surface with
 * no vertical walls to keep honest.
 *
 * Here height translates by a FIXED screen vector instead, so a riser is the
 * same height everywhere on the object and reads as an architectural terrace.
 * That is what every isometric drawing of a stepped building has always done.
 *
 * The vector points up and to the LEFT, which puts the camera to the right: the
 * faces we see are the right-facing and front-facing walls, which are exactly
 * the two the fill light reaches. Flip its sign and you see the two walls that
 * are in shadow.
 */
export const RISE = { x: -0.28, y: -0.58 };

export const project = ([x, y, h]) => [x + RISE.x * h, y + RISE.y * h];

/** Direction from the object toward the camera, for face-visibility tests. */
export const VIEW = [-RISE.x, -RISE.y, 1];

/* ------------------------------------------------------------------ solid -- */

/**
 * Three stacked slabs. Plan footprints are quads, given outer-first and wound
 * the same way; each tier's top face sits at `top`, its risers run from the tier
 * below's top up to it.
 *
 * **The footprints are deliberately NOT concentric.** Equal insets and parallel
 * edges produce a wedding cake — a bullseye of nested outlines that reads as a
 * diagram, not as a body. Each tier is offset and skewed differently, and each
 * one is offset and skewed differently.
 *
 * Each tier also steps BACK — up-screen — as it rises, not merely inward. A
 * concentric inset shows you only treads; stepping back is what puts each
 * tier's front riser in full view above the tread in front of it, which is the
 * silhouette that reads as a terrace.
 */
export const TIERS = [
	{
		id: "base",
		base: 0,
		top: 190,
		white: 0.16,
		plan: [
			[300, 905],
			[1655, 700],
			[1900, 1080],
			[520, 1325],
		],
	},
	{
		id: "mid",
		base: 190,
		top: 380,
		white: 0.19,
		plan: [
			[425, 735],
			[1570, 552],
			[1785, 892],
			[615, 1085],
		],
	},
	{
		id: "crown",
		base: 380,
		top: 570,
		white: 0.225,
		plan: [
			[548, 566],
			[1478, 418],
			[1662, 706],
			[712, 856],
		],
	},
];

/* --------------------------------------------------------------- lighting -- */

/**
 * TWO lights, and this is the single decision that decides whether the object
 * reads as a solid or as a silhouette.
 *
 * With only the key — the same up-left direction `FacetField` used — EVERY
 * visible riser has `N · L <= 0` and clamps to zero: a right-facing wall gets
 * -0.34, a front-facing wall -0.42. All the risers come out identically black,
 * the steps stop being distinguishable from each other, and the whole thing
 * flattens into a cutout. That is very likely why the live attempts never
 * looked three-dimensional either.
 *
 * The fill is bounce off the bright field the plateau sits on. It comes mostly
 * from the FRONT, and that direction is chosen, not arbitrary: on a terrace that
 * steps back, the front risers are the largest faces you see, so they are what
 * has to separate from both the treads above them and the shadows below. A fill
 * angled to the right instead left them at zero and the whole stack read as flat
 * stacked cards — which was the first draft.
 *
 * The key stays up-left so every cast shadow still falls down-right, AWAY from
 * the copy column — a lighting choice made for the contrast constraint, not for
 * taste.
 *
 * The window below is set so NOTHING clamps. An earlier pass had two of the
 * three visible riser directions land on exactly 0 — they came out identically
 * black, the steps stopped separating from each other, and the solid read as a
 * cutout. Ambient exists to hold the darkest face off the floor, not to
 * brighten the picture. Resulting ladder: treads 1.00, front risers 0.47, left
 * risers 0.19, right risers 0.08.
 */
export const LIGHTS = [
	{ dir: [-0.34, -0.42, 0.84], weight: 1.0 },
	{ dir: [0.3, 0.72, 0.62], weight: 0.7 },
];
export const AMBIENT = 0.22;

/** Window the summed response is mapped through. Re-measured for two lights. */
export const LAM_LO = 0.12;
export const LAM_HI = 1.45;

const norm = (v) => {
	const l = Math.hypot(...v);
	return v.map((c) => c / l);
};

const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Lit fraction, 0…1, of a face with unit normal `n`. */
export const litFraction = (n) => {
	let sum = AMBIENT;
	for (const { dir, weight } of LIGHTS) {
		const l = norm(dir);
		sum += weight * Math.max(0, n[0] * l[0] + n[1] * l[1] + n[2] * l[2]);
	}
	return clamp01((sum - LAM_LO) / (LAM_HI - LAM_LO));
};

/* ------------------------------------------------------------------ faces -- */

const centroid = (pts) => {
	const n = pts.length;
	return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
};

/**
 * Build every face of the solid, back to front, each with its projected
 * polygon, its unit normal and its lit fraction.
 *
 * Riser visibility is COMPUTED, not authored: a wall is visible when its
 * outward normal points away from the principal point in 2D, which is the same
 * test as "its projected quad is wound the right way". Authoring which walls to
 * draw is how you end up with a wall drawn on the far side of the solid.
 */
export const buildFaces = () => {
	const faces = [];

	for (const tier of TIERS) {
		const c = centroid(tier.plan);

		// Risers first, then the tread on top of them — painter's order within a
		// tier. Across tiers the array order already runs bottom to top.
		for (let i = 0; i < tier.plan.length; i++) {
			const a = tier.plan[i];
			const b = tier.plan[(i + 1) % tier.plan.length];
			const dx = b[0] - a[0];
			const dy = b[1] - a[1];

			// Outward horizontal normal: perpendicular to the edge, pointing away
			// from the tier's centroid.
			let n = norm([dy, -dx, 0]);
			const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
			if ((mid[0] - c[0]) * n[0] + (mid[1] - c[1]) * n[1] < 0) n = n.map((v) => -v);

			// Visible when the wall faces the camera. Under an axonometric this is a
			// property of the normal alone — no position term — which is why a
			// terrace drawn this way never sprouts a wall on its far side.
			if (n[0] * VIEW[0] + n[1] * VIEW[1] <= 0.02) continue;

			faces.push({
				tier: tier.id,
				kind: "riser",
				normal: n,
				t: litFraction(n),
				white: tier.white,
				points: [
					project([a[0], a[1], tier.base]),
					project([b[0], b[1], tier.base]),
					project([b[0], b[1], tier.top]),
					project([a[0], a[1], tier.top]),
				],
			});
		}

		faces.push({
			tier: tier.id,
			kind: "tread",
			normal: [0, 0, 1],
			t: litFraction([0, 0, 1]),
			white: tier.white,
			points: tier.plan.map((p) => project([p[0], p[1], tier.top])),
		});
	}

	return faces;
};

/**
 * Convex hull of a tier's whole solid in screen space — its base quad and its
 * top quad together. Used as the occluder mask for everything below it, so a
 * lower tread is never painted through the tier standing on it. Alpha over alpha
 * compounds, so overlapping faces would make the tonal values unpredictable.
 */
export const tierSilhouette = (tier) => {
	const pts = [
		...tier.plan.map((p) => project([p[0], p[1], tier.base])),
		...tier.plan.map((p) => project([p[0], p[1], tier.top])),
	];

	// Andrew's monotone chain.
	pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
	const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const half = (src) => {
		const out = [];
		for (const p of src) {
			while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
			out.push(p);
		}
		out.pop();
		return out;
	};
	return [...half(pts), ...half([...pts].reverse())];
};

/** Ground contact: the base tier's footprint at h=0, where the solid meets the field. */
export const groundPolygon = () => TIERS[0].plan.map((p) => project([p[0], p[1], 0]));

/**
 * True projective shadow of the solid: every vertex offset by an amount
 * proportional to ITS OWN height, not the whole silhouette translated. A
 * translated copy is the tell-tale of a fake shadow — it stays the same shape as
 * the object, where a real one shears.
 */
export const shadowPolygon = (spread = 1) => {
	const cast = ([x, y, h]) => [x + 0.405 * h * spread, y + 0.5 * h * spread];
	const pts = [];
	for (const tier of TIERS) {
		for (const p of tier.plan) pts.push([...cast([p[0], p[1], tier.top]), 0]);
	}
	for (const p of TIERS[0].plan) pts.push([p[0], p[1], 0]);

	const flat = pts.map(([x, y]) => project([x, y, 0]));
	flat.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
	const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const half = (src) => {
		const out = [];
		for (const p of src) {
			while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
			out.push(p);
		}
		out.pop();
		return out;
	};
	return [...half(flat), ...half([...flat].reverse())];
};

export const pathOf = (pts) => `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}Z`;

/* ------------------------------------------------------------------ frame -- */

/**
 * The canvas is DERIVED from the solid, not authored — a tight box around
 * everything that gets drawn, plus room for the widest blur to fall off in.
 *
 * This is not tidiness. The asset is placed with `background-size: N% auto`, so
 * N scales the whole canvas: any empty margin baked into the image shrinks the
 * plateau by exactly that fraction. The first pass authored a 2560x1440 field
 * with the solid in one corner and delivered a sliver. Frame tight, and let
 * `background-position` do the placing.
 *
 * Padding is 4x the widest sigma (46) plus a little — under that, the penumbra
 * gets cut by the canvas edge and reads as a straight crease.
 */
export const PAD = 210;

export const frame = () => {
	const pts = [...buildFaces().flatMap((f) => f.points), ...shadowPolygon(), ...groundPolygon()];
	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const x = Math.floor(Math.min(...xs) - PAD);
	const y = Math.floor(Math.min(...ys) - PAD);
	return {
		x,
		y,
		w: Math.ceil(Math.max(...xs) + PAD) - x,
		h: Math.ceil(Math.max(...ys) + PAD) - y,
	};
};
