"use client";

import { useEffect, useRef, type FC } from "react";

interface WaveFieldProps {
	/** Ribbon stroke colour. Hex only — it is decomposed to build the gradient. */
	color?: string;
	/** Strands in the ribbon. Affordable at this count because the ribbon paints
	 *  a single static frame by default — see `animated`. */
	lineCount?: number;
	/** Multiplier on the drift rate. 1 is the tuned default. */
	speed?: number;
	/** Overall alpha multiplier, for dialling the whole field back. */
	intensity?: number;
	/**
	 * Set false to paint one frame and stop. Takes the same path reduced motion
	 * does, so the still pose is identical either way.
	 */
	animated?: boolean;
	className?: string;
}

/** Horizontal sample spacing in CSS px — fine enough that a 1px stroke stays
 *  smooth over the crests, coarse enough to keep the per-frame point count in
 *  the low thousands. */
const SAMPLE_STEP = 6;
/** Retina is worth it for hairlines; beyond 2x is not. */
const MAX_DPR = 2;
/** Sparkles riding the flow, as in the reference. */
const SPARKLE_COUNT = 150;
/** Where the stroke gradient reaches full strength, as a fraction of width. */
const RAMP_FULL = 0.9;
/**
 * Past this copy-edge fraction the ribbon is not drawn at all.
 *
 * There is no alpha that rescues it below this: on a phone the copy runs the full
 * width, so the ribbon crosses the paragraph wherever it starts. Bright enough to
 * see measured 1.2:1 over the text; dim enough to be legal is invisible. The
 * facets and the triangles carry the hero at those widths instead.
 */
const MAX_COPY_EDGE = 0.72;

/**
 * Right edge of the hero copy column, as a fraction of the width — where the
 * ribbon is allowed to start.
 *
 * Derived from the layout's own numbers rather than hardcoded, because the
 * fraction is not constant: the paragraph is `max-w-2xl` (42rem) inside
 * `max-w-6xl` (72rem), centred, inside the section's gutter. That lands at 57%
 * of 1440 but 69% of 1024 and 91% of 768 — so the single 0.58 this used to be was
 * only ever correct at one viewport. Includes a small safety margin; without it
 * 1024 landed on 4.45:1, a hair under.
 *
 * Every surface that mounts this ribbon therefore owes it that column: a
 * `w-full max-w-6xl` container with the paragraph capped at `max-w-2xl`. The
 * interior page banners used to float a shrink-to-fit column in the centre
 * instead, which put their copy at 73% of 1440 — right across the ramp — and is
 * why they now share the hero's container rather than this taking a width prop.
 */
const copyEdge = (width: number) => {
	const gutter = width >= 1024 ? 32 : width >= 640 ? 24 : 16;
	const container = Math.min(1152, width - gutter * 2);
	const left = (width - container) / 2;
	const paragraph = Math.min(672, container);
	return (left + paragraph) / width + 0.02;
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
	const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
	return t * t * (3 - 2 * t);
};

/**
 * Remap the canvas-wide `u` (0 … 1) onto the ribbon's own parameter, 0 at the
 * ramp-in point and 1 at the right edge.
 *
 * This exists because the ribbon only ever occupies the width left over past the
 * copy column, and every frequency below is quoted in *crests across that visible
 * band*. Expressed against raw `u` they were fitting barely a quarter of a cycle
 * into that window, which is why the ribbon read as one lazy arc instead of a
 * flowing braid. Left of the ramp `v` clamps to 0 and the strands lie flat —
 * harmless, because the stroke gradient is fully transparent out there.
 */
const vAt = (u: number, rampIn: number) => Math.max(0, (u - rampIn) / (1 - rampIn));

interface Shape {
	spread: number;
	twistFreq: number;
	swellFreq: number;
	swellAmp: number;
}

/**
 * Thickness and crest count at the reference proportion, which is a 3440×1440
 * hero — there the copy column leaves the ribbon a ~1555×1440 window, an aspect
 * of about 1.08, and it draws the long lazy S the client signed off on.
 *
 * The reference used to be the 1440 hero's ~595×828 window (aspect 0.72), and
 * `scale` clamping at 1 meant every window at or above that got the identical
 * crest count. So on an ultrawide the same 1.2 crests spread over 1555px and
 * rolled; on a laptop they were packed into 595px against an unchanged 900px of
 * height and the ribbon reared up as a steep compressed squiggle. Quoting the
 * reference at the widest end instead makes the wave self-similar — see
 * `shapeFor`.
 */
const REF_SPREAD = 0.34;
const REF_TWIST = 7.5;
const REF_SWELL = 10;
const REF_ASPECT = 1.08;
/**
 * Thickness as a fraction of the window's *width*, under the `REF_SPREAD` cap.
 * Set so the cap is what binds at the reference aspect and this is what binds
 * below it, which is what keeps the ribbon from fattening up as it shortens.
 * Slightly above the strictly self-similar 0.315 — at 1440 that read elegant but
 * thin, and the extra body is worth the small departure.
 */
const SPREAD_PER_LENGTH = 0.42;

/**
 * Derive the ribbon's geometry from the window it actually gets, rather than
 * from a viewport breakpoint.
 *
 * Whether the ribbon reads as a *horizontal flowing band* depends on its
 * thickness and crest length relative to the width available, and that width is
 * what is left after the copy column — not the viewport. The copy column is a
 * fixed ~672px whatever the screen, so the window grows with the viewport while
 * the height it is measured against does not: 1555px of room at 3440, 595px at
 * 1440, 300px at 1024. Scaling all three quantities with the aspect means the
 * wave keeps one character and a narrower hero simply shows a shorter length of
 * it, instead of the same wave being crushed into the space.
 *
 * **`swellAmp` is the one that was missing**, and it is why the ribbon stood up
 * on every laptop. `spread` and the frequencies already tracked the aspect, but
 * the swell — the up-and-down travel of the centreline, which is most of what
 * reads as the wave's *height* — was a fixed fraction of the hero's height. The
 * hero is as tall on a 1512×982 MacBook as on an ultrawide while the ribbon's
 * window is a third the width, so the same travel had nowhere to run out and
 * simply reared up: measured, the ribbon was 0.46 as tall as it was wide at
 * 3440 and 0.68–0.69 at 1280–1920, i.e. half again as tall for the same shape.
 * Client asked for it shorter on laptops on 2026-08-17.
 *
 * It stays out of the way at the reference proportion — `scale` clamps at 1 —
 * so the ultrawide the client signed off on is untouched.
 */
const shapeFor = (windowWidth: number, height: number): Shape => {
	const aspect = windowWidth / height;
	const scale = Math.min(1, aspect / REF_ASPECT);
	return {
		spread: Math.min(REF_SPREAD, (windowWidth * SPREAD_PER_LENGTH) / height),
		twistFreq: REF_TWIST * scale,
		swellFreq: REF_SWELL * scale,
		swellAmp: scale,
	};
};

/**
 * Vertical position of a strand, in CSS px. `t` picks the strand (0 top … 1
 * bottom), `v` is the ribbon parameter from `vAt`.
 *
 * The ribbon is modelled as an actual twisting surface, not a stack of parallel
 * sines, and that is the whole character of the reference: `halfWidth` runs
 * through *zero*, and where it does the strands converge and cross to the other
 * side. Those crossings are the bright pinch nodes — the thing a parallel hatch
 * cannot produce no matter how it is tuned.
 *
 * The twist phase carries a small `t` term so each strand reaches its own pinch
 * at a slightly different point. Without it every strand collapses through one
 * spot and the crossing reads as a hard mechanical X; with it they stagger into
 * the elongated lens shapes the reference has.
 */
const yAt = (t: number, v: number, h: number, time: number, shape: Shape) => {
	// The long rolling swell, plus a shorter one at a non-integer ratio so the two
	// never line up into a repeating pattern.
	//
	// The amplitudes are small relative to the frequency on purpose. What makes
	// the reference's swell read as *rolling* rather than as a zigzag is the ratio
	// of peak-to-trough travel to wavelength — about 0.17 there. Its wave gets the
	// whole page width to breathe in; ours has the right 42%, so asking for the
	// reference's crest count at a visible amplitude produced spikes.
	//
	// Both terms ride `swellAmp`, which is what keeps that ratio — and so the
	// rolling read — constant as the window narrows. Scaling the frequency alone
	// lengthens the crests without flattening them, which is the steep version.
	const centre =
		h *
		(0.5 +
			shape.swellAmp *
				(0.1 * Math.sin(v * shape.swellFreq + time * 0.5) +
					0.035 * Math.sin(v * shape.swellFreq * 1.75 - time * 0.34 + 1.3)));

	// The twist is deliberately a higher frequency than the swell — the braiding
	// is what carries the character, and it survives being squeezed into a narrow
	// band in a way the swell does not.
	const twist = v * shape.twistFreq - time * 0.42 + (t - 0.5) * 0.9;
	// Gamma on the width profile, sign preserved so the strands still cross.
	// A raw cosine spends most of its length part-closed — mean |cos| is only
	// 0.64 — which is what made the ribbon look deflated. The exponent pushes it
	// toward fully open and compresses the pinches into brief waists.
	const c = Math.cos(twist);
	const openness = Math.sign(c) * Math.abs(c) ** 0.45;
	const halfWidth = h * shape.spread * 0.5 * openness;

	// Per-strand ripple, so the surface is not a perfectly ruled one. Rides
	// `swellAmp` with the swell — it is travel across the band like the swell is,
	// not thickness, so leaving it fixed would just put the steepness back at the
	// strand scale.
	const ripple = h * 0.018 * shape.swellAmp * Math.sin(v * 22 + t * 6 + time * 0.55);

	// Envelope only the width, never the centreline: fading the centreline flat
	// would make the ribbon enter the frame as a straight bar.
	const env = smoothstep(0, 0.18, v);

	return centre + (t - 0.5) * 2 * halfWidth * env + ripple * env;
};

/** Deterministic PRNG — sparkle layout must survive a resize unchanged. */
const seeded = (seed: number) => () => {
	seed = (seed * 1664525 + 1013904223) % 4294967296;
	return seed / 4294967296;
};

const hexToRgb = (hex: string) => {
	const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!m) return "255,255,255";
	return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
};

/**
 * The hero's flowing line ribbon: a field of hairline sinusoids that converge at
 * the left, fan out to the right and drift continuously, dusted with sparkles
 * that ride the same curves.
 *
 * Canvas 2D rather than WebGL — it is a few thousand line segments a frame, and
 * this way there is no SSR guard, no context-loss handling and no shader to keep
 * in step with the palette.
 */
const WaveField: FC<WaveFieldProps> = ({
	color = "#37c4e8",
	lineCount = 100,
	speed = 1,
	intensity = 1,
	animated = true,
	className,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		const rgb = hexToRgb(color);
		// One flag for both reasons to hold still: the caller asked for a static
		// ribbon, or the reader did. Below this point they are the same thing.
		const still = !animated || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		let width = 0;
		let height = 0;
		// All recomputed on every resize; these are placeholders until the first one.
		let rampIn = 0.5;
		let shape: Shape = shapeFor(600, 830);
		// False where the copy leaves the ribbon no room — see `MAX_COPY_EDGE`.
		let fits = false;
		let gradient: CanvasGradient | null = null;
		let frame = 0;
		let visible = true;
		// Seconds of animation consumed. Accumulated rather than derived from a
		// start timestamp so pausing does not fast-forward the field.
		// The initial value is a fixed offset, not 0: at t=0 every harmonic is in
		// phase and the ribbon collapses to a flat stack.
		let elapsed = 4.2;
		let last = 0;

		const sparkles = (() => {
			const rand = seeded(20260814);
			return Array.from({ length: SPARKLE_COUNT }, () => ({
				t: rand(),
				// Position along the ribbon, not across the canvas — mapped through
				// `rampIn` at draw time. Stored this way so the whole set follows the
				// ribbon when the ramp moves on resize instead of most of them
				// stranding in the transparent left half.
				pos: rand(),
				size: 0.7 + rand() * 1.6,
				phase: rand() * Math.PI * 2,
				twinkle: 0.4 + rand() * 1.2,
			}));
		})();

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			if (!rect.width || !rect.height) return;
			const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
			width = rect.width;
			height = rect.height;
			rampIn = copyEdge(width);
			fits = rampIn <= MAX_COPY_EDGE;
			shape = shapeFor((1 - rampIn) * width, height);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			// One gradient reused by every line; per-line brightness rides on
			// globalAlpha instead. Holds the ribbon off the headline on the left.
			gradient = ctx.createLinearGradient(0, 0, width, 0);
			gradient.addColorStop(0, `rgba(${rgb},0)`);
			gradient.addColorStop(rampIn, `rgba(${rgb},0)`);
			gradient.addColorStop((rampIn + RAMP_FULL) / 2, `rgba(${rgb},0.5)`);
			gradient.addColorStop(RAMP_FULL, `rgba(${rgb},1)`);
			gradient.addColorStop(1, `rgba(${rgb},0.95)`);
		};

		const draw = (time: number) => {
			if (!gradient) return;
			ctx.clearRect(0, 0, width, height);
			if (!fits) return;
			ctx.lineCap = "round";
			ctx.strokeStyle = gradient;

			for (let i = 0; i < lineCount; i++) {
				const t = lineCount === 1 ? 0.5 : i / (lineCount - 1);
				// Edge fade keeps the band from ending on a hard top and bottom line,
				// the slow term makes individual strands surface and recede.
				const edge = Math.sin(t * Math.PI) ** 0.55;
				const pulse = 0.6 + 0.4 * Math.sin(time * 0.3 + t * 7.3);
				// A regular scatter of brighter strands. Without them the ribbon is a
				// uniform hatch; these are what give it a grain and a direction.
				const lead = i % 7 === 3 ? 1.7 : 1;
				const alpha = Math.min(1, 0.55 * edge * pulse * lead * intensity);

				const path = new Path2D();
				for (let x = 0; x <= width + SAMPLE_STEP; x += SAMPLE_STEP) {
					const u = Math.min(1, x / width);
					const y = yAt(t, vAt(u, rampIn), height, time, shape);
					if (x === 0) path.moveTo(x, y);
					else path.lineTo(x, y);
				}

				// Two strokes off one path: a wide soft pass for bloom, then the
				// hairline. Cheaper and more controllable than shadowBlur.
				ctx.globalAlpha = alpha * 0.16;
				ctx.lineWidth = 3.5;
				ctx.stroke(path);
				ctx.globalAlpha = alpha;
				ctx.lineWidth = lead > 1 ? 1.3 : 1;
				ctx.stroke(path);
			}

			ctx.fillStyle = `rgb(${rgb})`;
			for (const s of sparkles) {
				const u = rampIn + (1 - rampIn) * s.pos;
				const y = yAt(s.t, s.pos, height, time, shape);
				const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time * s.twinkle + s.phase));
				// Same ramp as the stroke gradient — a sparkle never outlives its line.
				const ramp = smoothstep(rampIn, RAMP_FULL, u);
				ctx.globalAlpha = Math.min(1, twinkle * ramp * 0.9 * intensity);
				ctx.beginPath();
				ctx.arc(u * width, y, s.size, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.globalAlpha = 1;
		};

		const loop = (now: number) => {
			// Clamped so a dropped frame or a backgrounded tab cannot jolt the field.
			elapsed += Math.min((now - last) / 1000, 0.1) * speed;
			last = now;
			draw(elapsed);
			frame = requestAnimationFrame(loop);
		};

		const play = () => {
			if (frame || still) return;
			last = performance.now();
			frame = requestAnimationFrame(loop);
		};

		const pause = () => {
			if (!frame) return;
			cancelAnimationFrame(frame);
			frame = 0;
		};

		const observer = new ResizeObserver(() => {
			resize();
			// Repaint immediately so a resize is never a blank frame, and so the
			// reduced-motion still frame follows the new size.
			draw(elapsed);
		});
		observer.observe(canvas);

		// Skip the work entirely once the hero is scrolled past.
		const inView = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible && !document.hidden) play();
				else pause();
			},
			{ threshold: 0 },
		);
		inView.observe(canvas);

		const onVisibility = () => {
			if (document.hidden) pause();
			else if (visible) play();
		};
		document.addEventListener("visibilitychange", onVisibility);

		resize();
		draw(elapsed);
		if (!still) play();

		return () => {
			pause();
			observer.disconnect();
			inView.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [color, lineCount, speed, intensity, animated]);

	return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default WaveField;
