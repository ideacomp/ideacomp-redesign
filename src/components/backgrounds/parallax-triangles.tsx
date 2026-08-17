"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface Triangle {
	/** Position of the triangle's top-left corner, in % of the hero. */
	x: number;
	y: number;
	scale: "sm" | "md" | "lg";
	rotate: number;
	/** Parallax depth. The reference only ever uses .20 / .30 / .40. */
	depth: number;
	/**
	 * `light` adds white, `dark` subtracts. The reference is all-light, because it
	 * has no body copy under its decoration; see the placement note below for why
	 * ours cannot be.
	 */
	tone: "light" | "dark";
	alpha: number;
}

/**
 * Placement, unlike alpha and depth, is NOT copied from the reference — its
 * triangles sit wherever its own layout left room, and ours has a headline and
 * a paragraph in different places.
 *
 * **The left half is dark shapes, the right half light ones, and that is a
 * contrast requirement rather than a look.** The copy column occupies the left
 * of the hero — x 10–57% at 1440, and x 3–69% at 1024, where it leaves no
 * clear left-hand space at all. Over that column, white does not fit at any
 * useful alpha: measured on the current field, 20% white takes the paragraph to
 * 3.2:1 and even 10% — the same alpha the facet field itself uses — takes it to
 * 4.05:1 and the eyebrow to 4.38:1, because `FacetField` has already spent the
 * headroom underneath. Black has the opposite sign: it lowers the backdrop
 * luminance, so light copy over it can only gain. Every dark shape here is
 * therefore free to cross the copy, and the light ones still must not.
 *
 * It also happens to read correctly — the dark shapes fall on the deep end of
 * the field and the light ones on the open end, so the whole hero looks lit from
 * the right, which is the direction `FacetField`'s seams already imply.
 *
 * NOTE: an earlier revision put a 20% white triangle at (33%, 8%) "above the
 * eyebrow line". It was not above it — at the pointer's top extreme the depth-.3
 * drift carried it 23px down onto that line and took it to 3.26:1. If you add a
 * light shape, check it at BOTH pointer extremes, not just one.
 */
const TRIANGLES: Triangle[] = [
	// Left and centre: shadow slabs. Free to cross the copy column.
	{ x: 0, y: 26, scale: "lg", rotate: -12, depth: 0.2, tone: "dark", alpha: 0.09 },
	{ x: 21, y: 9, scale: "md", rotate: 26, depth: 0.3, tone: "dark", alpha: 0.12 },
	{ x: 9, y: 71, scale: "sm", rotate: -30, depth: 0.4, tone: "dark", alpha: 0.16 },
	{ x: 34, y: 84, scale: "sm", rotate: 14, depth: 0.3, tone: "dark", alpha: 0.13 },
	{ x: 44, y: 62, scale: "md", rotate: -40, depth: 0.2, tone: "dark", alpha: 0.07 },
	// Right: the reference's own white shapes, thinned from six to four so the
	// weight sits nearer the middle of the hero than the edge.
	{ x: 71, y: 34, scale: "lg", rotate: 18, depth: 0.2, tone: "light", alpha: 0.1 },
	{ x: 88, y: 8, scale: "lg", rotate: -30, depth: 0.3, tone: "light", alpha: 0.1 },
	{ x: 83, y: 18, scale: "sm", rotate: -8, depth: 0.4, tone: "light", alpha: 0.2 },
	{ x: 90, y: 60, scale: "sm", rotate: -24, depth: 0.2, tone: "light", alpha: 0.2 },
];

const SIZE = {
	sm: "clamp(1.75rem, 4vw, 4.5rem)",
	md: "clamp(5rem, 11vw, 12rem)",
	lg: "clamp(12rem, 30vw, 35rem)",
} as const;

/**
 * Pointer travel across the full viewport, in px, at depth 1 — negated, because
 * the reference inverts (mouse right ⇒ layers drift left).
 *
 * Solved from the reference rather than invented. With the pointer at
 * (1350, 800) on a 1440×900 viewport its three depth tiers sat at x =
 * -25.1991 / -37.7986 / -50.3982 and y = -11.9307 / -17.896 / -23.8614; each
 * divided by (fraction-from-centre × depth) gives -287.99 and -153.39, to the
 * second decimal, from all three independently.
 */
const SCALAR_X = -288;
const SCALAR_Y = -153.4;

/**
 * The reference's mouse-parallax triangles: flat white shapes at two depths of
 * translation, drifting against the pointer.
 *
 * Driven by two CSS custom properties on the container rather than by springs.
 * Every triangle wants the identical motion scaled by its own depth, so a
 * `useMotionValue`/`useSpring`/`useTransform` chain would mean one spring plus
 * seven subscriptions to animate what is really a single 2D vector — and Motion
 * springs are otherwise unused in this codebase. Writing `--pt-x`/`--pt-y` once
 * per frame costs no React render at all, and `calc()` does the per-depth
 * multiply on the compositor.
 */
const ParallaxTriangles = ({ className }: { className?: string }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Mouse only, as in the reference — a touch device gets the static
		// composition, and this also covers `prefers-reduced-motion`, where the
		// triangles simply stay at their rest positions rather than disappearing.
		if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		let frame = 0;
		let px = 0;
		let py = 0;

		const apply = () => {
			frame = 0;
			el.style.setProperty("--pt-x", `${px.toFixed(2)}px`);
			el.style.setProperty("--pt-y", `${py.toFixed(2)}px`);
		};

		const onMove = (e: PointerEvent) => {
			if (e.pointerType !== "mouse") return;
			// Viewport-relative only. Nothing is measured per event, so there is no
			// rect to cache and no layout to thrash.
			px = (e.clientX / window.innerWidth - 0.5) * SCALAR_X;
			py = (e.clientY / window.innerHeight - 0.5) * SCALAR_Y;
			if (!frame) frame = requestAnimationFrame(apply);
		};

		// Track the window, like the reference does, so the triangles keep
		// responding while the pointer is anywhere on screen — but only while the
		// hero is actually visible.
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
		io.observe(el);

		return () => {
			detach();
			io.disconnect();
		};
	}, []);

	return (
		// Hidden below `lg`, the whole layer. Under 1024 the copy fills essentially
		// the whole width, so every LIGHT triangle is over text: they took the
		// paragraph to 3.2:1, and the dim large ones to 3.95:1. The dark ones would
		// be safe there, but there is nothing to drive any of this on touch — the
		// parallax is mouse-only — so the layer goes as a unit rather than becoming
		// a static half-composition. Below `lg` the hero is the field plus
		// `FacetField`, and the ribbon bows out too (`MAX_COPY_EDGE` in
		// `wave-field.tsx`).
		<div ref={ref} className={`hidden lg:block ${className ?? ""}`} aria-hidden="true">
			{TRIANGLES.map((t, i) => (
				<span
					key={i}
					className="absolute block"
					style={
						{
							"--depth": t.depth,
							left: `${t.x}%`,
							top: `${t.y}%`,
							width: SIZE[t.scale],
							aspectRatio: "1 / 1.05",
							background:
								t.tone === "light" ? `rgba(255,255,255,${t.alpha})` : `rgba(0,0,0,${t.alpha})`,
							clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
							// One transform, not `transform` + the separate `rotate`
							// property: the two compose in a fixed order that puts the
							// rotation before the translation, which swings the drift
							// direction per triangle.
							transform: `translate3d(calc(var(--pt-x, 0px) * var(--depth)), calc(var(--pt-y, 0px) * var(--depth)), 0) rotate(${t.rotate}deg)`,
							// Smoothing without a spring: the property is rewritten every
							// frame, so the transition never completes and what you see is
							// a continuous ease-out lag behind the pointer.
							transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
							willChange: "transform",
						} as CSSProperties
					}
				/>
			))}
		</div>
	);
};

export default ParallaxTriangles;
