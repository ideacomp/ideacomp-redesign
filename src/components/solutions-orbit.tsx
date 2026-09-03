"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { IMAGE_FRAME } from "@/components/framed-image";
import { CAROUSEL_CONTROL } from "@/components/photo-carousel";
import SolutionBands from "@/components/solution-bands";
import { CheckCircle, type Solution } from "@/lib/sitemap";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

/** The orbit needs a 680px stage beside a column of prose. At 1024 that leaves
 *  the copy 312px — around 39 characters, well under the 45 a paragraph needs —
 *  so the handover to `<SolutionBands>` is well above `lg`.
 *
 *  1336 and not the round 1280 on purpose. The two layouts are very different
 *  heights — the orbit is one screen, the bands are six — so which one renders
 *  decides whether there is a vertical scrollbar, and the scrollbar decides the
 *  width the media query sees. Put the threshold on a common viewport width and
 *  that closes into a loop: at a 1280 viewport the orbit renders, the page gets
 *  short, the scrollbar goes away, the width reads 1280, which still matches…
 *  while the bands at the same viewport read 1265 and don't. It flaps.
 *
 *  1336 sits in the gap between the 1280 and 1366 laptop classes, so neither can
 *  straddle it however the scrollbar falls: 1280 − 15 = 1265 is always below,
 *  1366 − 15 = 1351 is always above. */
const DESKTOP = "(min-width: 1336px)";

/** Longer than the photo carousel's 6s: a panel here is a heading, a paragraph
 *  and three features, not a picture. */
const AUTOPLAY_MS = 7000;

/** The arc is a left half-circle: the active slot sits at nine o'clock, level
 *  with the copy it unfolds into, and the six labels spread 36° apart either
 *  side of it. Slots run `SLOT_MIN`..`SLOT_MAX`, which is six positions
 *  spanning 180° — six o'clock at one end, twelve at the other.
 *
 *  The two end slots are the gap. A label there is at opacity 0, and it is
 *  between them that the one label per step that has to get from the bottom of
 *  the arc back to the top makes its jump — invisibly, because both ends are
 *  already faded out. That gap is why each label rotates on its own layer
 *  instead of the whole ring turning as one piece. */
const SLOT_DEG = 36;
const SLOT_MIN = -2;
const SLOT_MAX = 3;

/** Stage side in pixels, then the arc radius, the panel and the label width as
 *  percentages of it — so the geometry is pure CSS and needs no measurement.
 *
 *  The constraint that binds is the outside: a label is half `CHIP_PCT` wide
 *  either side of its arc point, so `ORBIT_PCT + CHIP_PCT/2 ≤ 50` or the label
 *  at nine o'clock escapes the stage into the copy column. At these numbers
 *  that margin is 1.44 units — 10px.
 *
 *  `CHIP_PCT` has a floor set by the longest word that cannot be broken across
 *  lines. That word is CYBERSECURITY, not DEVELOPMENT: measured from the
 *  rendered text it is 95px at 11px mono with 0.12em tracking, and an earlier
 *  116px pill with `px-3` left it 90px of interior — the label overflowed its
 *  own border by 5px. At 130px with `px-2.5` the interior is 110px, so the
 *  tightest label clears by 15px. `docs/solutions/orbit.mjs` measures every
 *  label against its pill; re-run it if a title ever changes.
 *
 *  The inside is no longer a clearance — labels are allowed to cross the panel,
 *  which is what hides the arc's two end slots — so `IMAGE_PCT` is free to be
 *  tuned by eye.
 *
 *  `docs/solutions/orbit.mjs` asserts the outside clearance from the rendered
 *  boxes. Run it after touching any of these. */
const STAGE_PX = 680;
const ORBIT_PCT = 39;
const IMAGE_PCT = 60;
const CHIP_PCT = 19.12;

/** The house easing, and the same 0.9s the photo carousel crossfades in. */
const TRANSITION = { duration: 0.9, ease: [0.16, 1, 0.3, 1] } as const;

/**
 * The six solutions as one scene: the active service unfolded as full copy on
 * the left, its generated panel crossfading on the right, and the six labels
 * riding a half-circle arc around that panel.
 *
 * **Direction.** Advancing sinks the outgoing service from nine o'clock down
 * the arc; the incoming one drops into the active slot from above. That is
 * anticlockwise, which contradicts the brief's word "clockwise" — the two can't
 * both hold with the active slot on the left, and the client picked the
 * movement over the word. Flipping it means negating `angle`.
 *
 * **Why a monotonic `step` and not an index.** `step` only ever moves by the
 * shortest signed delta, so it drifts past ±360° and never wraps. An
 * index-derived angle would send every label the long way round on the
 * 06 → 01 transition.
 *
 * **Why each label rotates on its own layer.** Animating a label's `x`/`y`
 * would walk it along the chord between two slots, cutting across the panel;
 * rotating a full-size layer pinned to the stage centre gives true arc motion
 * instead. They are separate layers rather than one shared ring because the arc
 * is open: per step, exactly one label has to leave the bottom end and reappear
 * at the top, and a rigid ring can only turn as one piece. Each label
 * counter-rotates by the same value on the same curve so its text stays level.
 *
 * **Why every panel is in the DOM.** `<AnimatePresence mode="wait">` would keep
 * only the active service mounted, and five of the six would vanish from the
 * markup a crawler sees — on the page whose whole job is to list them. Instead
 * all six stack in one grid cell (the reserve-layer idiom from
 * `<AccentHeading>`), which also means the column is as tall as the longest
 * panel and never reflows between services. Inactive ones are `inert`, not just
 * transparent, so their content is out of the tab order and off the a11y tree.
 *
 * **Why the active label stays visible.** Fading it to nothing reads better —
 * the label looks like it unfolded into the panel — but it leaves a focusable
 * control with no visible focus state. It stays, filled in `signal`, as the
 * "you are here" marker. The two labels parked in the arc's gap are the one
 * case where a label does go to zero, and those are taken out of the tab order
 * to match.
 *
 * Autoplay stops when the user pauses it, when focus or the pointer is inside
 * the group, when the tab is hidden, when the scene scrolls out of view, and
 * under reduced motion — the same six conditions as `<PhotoCarousel>`, and the
 * explicit pause control PRODUCT.md requires.
 */
const SolutionsOrbit = ({ solutions }: { solutions: Solution[] }) => {
	const { dict } = useLocale();
	const shouldReduceMotion = useReducedMotion();
	const count = solutions.length;

	const [step, setStep] = useState(0);
	const [userPaused, setUserPaused] = useState(false);
	const [held, setHeld] = useState(false);
	const [onScreen, setOnScreen] = useState(true);
	const [tabVisible, setTabVisible] = useState(true);
	const [isDesktop, setIsDesktop] = useState(false);
	// `useReducedMotion` is null during SSR and `matchMedia` can't run there at
	// all, so both branches wait for mount or the markup disagrees on hydration.
	const [mounted, setMounted] = useState(false);
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => setMounted(true), []);

	const index = ((step % count) + count) % count;

	/** Moves `step` by the shortest signed distance to `target`, so jumping from
	 *  the last service to the first turns one slot back rather than five
	 *  forward. Functional so it composes with autoplay's own updates. */
	const goTo = useCallback(
		(target: number) => {
			setStep((s) => {
				const current = ((s % count) + count) % count;
				let delta = (((target - current) % count) + count) % count;
				if (delta * 2 > count) delta -= count;
				return s + delta;
			});
		},
		[count],
	);

	useEffect(() => {
		const query = window.matchMedia(DESKTOP);
		const sync = () => setIsDesktop(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	// Don't run a timer for a scene nobody is looking at.
	useEffect(() => {
		const el = hostRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
			threshold: 0.15,
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const onVisibility = () => setTabVisible(!document.hidden);
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	// `/solutions#cybersecurity` has to select the service, not just scroll to
	// it. The browser scrolls to the panel's `id` on its own; this picks it up.
	//
	// The turn on a deep-link load is deliberate rather than snapped: it arrives
	// after the scroll, and seeing the ring settle is what tells a first-time
	// visitor the scene is steppable at all. Snapping it would need the hash
	// read before the first paint, which desynchronises hydration.
	useEffect(() => {
		const applyHash = () => {
			const slug = decodeURIComponent(window.location.hash.slice(1));
			const target = solutions.findIndex((s) => s.slug === slug);
			if (target >= 0) goTo(target);
		};
		applyHash();
		window.addEventListener("hashchange", applyHash);
		return () => window.removeEventListener("hashchange", applyHash);
	}, [solutions, goTo]);

	const running =
		!shouldReduceMotion && !userPaused && !held && onScreen && tabVisible && count > 1;

	useEffect(() => {
		if (!running) return;
		const timer = window.setInterval(() => setStep((s) => s + 1), AUTOPLAY_MS);
		return () => window.clearInterval(timer);
	}, [running]);

	/** Only user-driven moves rewrite the hash — autoplay doing it every seven
	 *  seconds would leave whatever service happened to be up when the visitor
	 *  copied the URL. `replaceState` keeps it out of history and, unlike
	 *  assigning `location.hash`, doesn't scroll or re-fire `hashchange`. */
	const select = useCallback(
		(target: number) => {
			goTo(target);
			const slug = solutions[((target % count) + count) % count]?.slug;
			if (slug) window.history.replaceState(null, "", `#${slug}`);
		},
		[goTo, solutions, count],
	);

	const move = useCallback(
		(direction: 1 | -1) => select(index + direction),
		[select, index],
	);

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowRight") {
			event.preventDefault();
			move(1);
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			move(-1);
		}
	};

	/** Which arc slot a service currently occupies, signed against the active
	 *  one: positive is still to come (above it), negative has already been
	 *  shown (below it). The copy panels use the sign to decide which way they
	 *  leave, so the text always travels with the arc. */
	const slotOf = (i: number) => {
		const raw = (((i - index) % count) + count) % count;
		return raw > SLOT_MAX ? raw - count : raw;
	};

	/** Which labels are jumping the gap on this render, so their layers can snap
	 *  instead of sweeping. A ref, not state: it is derived from the slot each
	 *  label just left, and writing it during render would loop. */
	const previousSlots = useRef<Map<string, number>>(new Map());
	const wrappedRef = useRef<Set<string>>(new Set());
	wrappedRef.current = new Set();
	solutions.forEach((solution, i) => {
		const slot = slotOf(i);
		const before = previousSlots.current.get(solution.slug);
		// Adjacent slots sweep; anything else is the crossing between the two
		// ends, which is the only non-adjacent move the arc can produce.
		if (before !== undefined && Math.abs(slot - before) > 1) {
			wrappedRef.current.add(solution.slug);
		}
		previousSlots.current.set(solution.slug, slot);
	});

	// Anything narrower than two columns, and anyone who asked for reduced
	// motion, gets the bands — for the second group an auto-advancing ring is
	// the wrong mechanism, not a mechanism that needs slowing down. Rendered
	// before mount too, so the server sends the full six-service page.
	if (!mounted || shouldReduceMotion || !isDesktop) {
		return <SolutionBands solutions={solutions} />;
	}

	return (
		<section
			// `overflow-hidden` matches every other section on the site, and here it
			// is load-bearing rather than tidy: each label rides a stage-sized layer
			// that gets rotated, and a 680px square turned 36° has a ~940px bounding
			// box. Nothing visible sits out there, but the boxes still widened the
			// document and gave /solutions — and only /solutions — a horizontal
			// scrollbar at 1366.
			className="dark relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8"
			aria-label={dict.common.jumpToSolutionLabel}
		>
			<div
				ref={hostRef}
				className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto]"
				role="group"
				aria-roledescription={dict.common.solutionsRoleDescription}
				aria-label={dict.common.solutionsRoleDescription}
				onMouseEnter={() => setHeld(true)}
				onMouseLeave={() => setHeld(false)}
				onFocusCapture={() => setHeld(true)}
				onBlurCapture={() => setHeld(false)}
				onKeyDown={onKeyDown}
			>
				{/* Copy column. All six panels share one grid cell, so the column is
				    as tall as the longest of them and nothing below it moves when the
				    service changes. */}
				<div>
					<div className="grid">
						{solutions.map((solution, i) => {
							const active = i === index;
							const slot = slotOf(i);
							return (
								<motion.div
									key={solution.slug}
									id={solution.slug}
									className="[grid-area:1/1] scroll-mt-28"
									initial={false}
									animate={{ opacity: active ? 1 : 0, y: active ? 0 : slot > 0 ? -24 : 24 }}
									transition={TRANSITION}
									aria-hidden={!active}
									inert={!active}
								>
									<solution.icon className="size-8 text-signal" aria-hidden="true" />
									<h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
										{solution.title}
									</h2>
									<p className="mt-4 text-base leading-relaxed text-muted-foreground">
										{solution.detailedDescription}
									</p>
									<ul className="mt-6 space-y-3">
										{solution.features.map((feature) => (
											<li key={feature.name} className="flex gap-3">
												<CheckCircle
													size={18}
													className="mt-0.5 shrink-0 text-signal"
													aria-hidden="true"
												/>
												<span className="text-sm leading-relaxed text-foreground/80">
													<span className="font-medium text-foreground">{feature.name}.</span>{" "}
													{feature.description}
												</span>
											</li>
										))}
									</ul>
								</motion.div>
							);
						})}
					</div>

					{/* Arrows, an explicit count and the pause control, in the copy
					    column rather than over the image: the ring already carries the
					    per-service targets, so this row only has to answer "how do I
					    step, where am I, how do I stop it". */}
					<div className="mt-10 flex items-center gap-2.5">
						<button
							type="button"
							onClick={() => move(-1)}
							aria-label={dict.common.previousSolution}
							className={CAROUSEL_CONTROL}
						>
							<ChevronLeft size={16} aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => move(1)}
							aria-label={dict.common.nextSolution}
							className={CAROUSEL_CONTROL}
						>
							<ChevronRight size={16} aria-hidden="true" />
						</button>

						{/* Hidden from assistive tech: position is already announced by
						    `aria-current` on the ring's labels. */}
						<span
							aria-hidden="true"
							className="ml-1 font-mono text-[0.6875rem] tracking-[0.12em] text-foreground/70 tabular-nums"
						>
							{String(index + 1).padStart(2, "0")}
							<span className="text-foreground/40"> / </span>
							{String(count).padStart(2, "0")}
						</span>

						<button
							type="button"
							onClick={() => setUserPaused((p) => !p)}
							aria-label={userPaused ? dict.common.playSolutions : dict.common.pauseSolutions}
							className={cn(CAROUSEL_CONTROL, "ml-1")}
						>
							{userPaused ? (
								<Play size={13} aria-hidden="true" />
							) : (
								<Pause size={13} aria-hidden="true" />
							)}
						</button>
					</div>
				</div>

				{/* The stage: a square whose centre is the image and whose rim is the
				    orbit. Sized in fixed pixels because every distance inside it is a
				    percentage of this side. */}
				<div
					className="relative aspect-square shrink-0"
					style={{ width: `${STAGE_PX}px` }}
				>
					{/* The panel, crossfading between the six generated diagrams — the
					    behaviour this scene started with. Only the first is `priority`;
					    the rest are decorative duplicates until they are active. */}
					<div
						className={cn(
							IMAGE_FRAME,
							"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
						)}
						style={{ width: `${IMAGE_PCT}%`, aspectRatio: "3 / 2" }}
					>
						{solutions.map((solution, i) => (
							<motion.div
								key={solution.slug}
								className="absolute inset-0"
								initial={false}
								animate={{ opacity: i === index ? 1 : 0 }}
								transition={TRANSITION}
								aria-hidden={i !== index}
							>
								<Image
									src={solution.image.src}
									alt={solution.image.alt}
									fill
									// STAGE_PX × IMAGE_PCT, and the stage only ever renders at
									// one size, so the delivered width is known exactly.
									sizes="408px"
									priority={i === 0}
									className="object-cover"
								/>
							</motion.div>
						))}
					</div>

					{/* The half-ring. Each label owns a full-size layer pinned to the
					    stage centre, with the label parked at the active slot inside it;
					    rotating that layer by the label's slot offset swings it along the
					    arc. One layer per label rather than one shared ring, because a
					    shared ring can only turn as a rigid body and this arc has to let
					    exactly one label jump the gap per step. */}
					<div className="absolute inset-0 z-10">
						{solutions.map((solution, i) => {
							const slot = slotOf(i);
							const active = slot === 0;
							const hidden = slot === SLOT_MIN || slot === SLOT_MAX;
							const angle = slot * SLOT_DEG;
							// The one label crossing between the two ends this step. Its
							// angle has to snap rather than sweep — a tween would take it
							// straight back across the panel — and both ends are already
							// faded out, so the snap happens where nothing is visible.
							const wrapping = wrappedRef.current.has(solution.slug);
							// `pointer-events-none` runs all the way down to the button, which
							// takes them back. Each label rides its own stage-sized layer and the
							// six are stacked, so without this the last one in the DOM lies over
							// the whole scene and swallows every click meant for the other five —
							// only "Cloud & DevOps" was selectable.
							return (
								<motion.div
									key={solution.slug}
									className="pointer-events-none absolute inset-0"
									initial={false}
									animate={{ rotate: angle }}
									transition={wrapping ? { duration: 0 } : TRANSITION}
								>
									<div
										className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
										style={{ left: `${50 - ORBIT_PCT}%` }}
									>
										{/* Counter-rotated by the same amount on the same curve, so
										    the label rides the arc but never tips. */}
										<motion.div
											initial={false}
											animate={{
												rotate: -angle,
												opacity: hidden ? 0 : 1,
												scale: active ? 1 : 0.92,
											}}
											transition={wrapping ? { duration: 0 } : TRANSITION}
										>
											{/* Full-strength ink on every visible label. Depth is
											    carried by scale alone: these are 11px, which answers
											    to 4.5:1, and fading the far ones to suggest depth is
											    exactly what drops them under it. The two arc ends go
											    to 0 outright — that is the gap, not a faded label. */}
											<button
												type="button"
												onClick={() => select(i)}
												aria-current={active}
												// A label parked in the arc's gap is invisible; leaving it
												// focusable or clickable would strand the focus ring on
												// nothing and put a hit target over the panel where the
												// user can see no control.
												tabIndex={hidden ? -1 : undefined}
												aria-hidden={hidden}
												style={{ width: `${(STAGE_PX * CHIP_PCT) / 100}px` }}
												className={cn(
													"rounded-full border px-2.5 py-2 text-center font-mono text-[0.6875rem]",
													"leading-snug tracking-[0.12em] uppercase transition-colors motion-safe:duration-300",
													"focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
													hidden ? "pointer-events-none" : "pointer-events-auto",
													// Opaque grounds, both states. A translucent pill let
													// the brand field through on whichever labels happened
													// to cross it, so the ink's contrast depended on where
													// a label was standing. Carrying its own ground makes
													// that constant — measured 5.9:1 on the arc.
													active
														? "border-signal bg-signal text-signal-foreground"
														: "border-foreground/30 bg-background text-foreground/80 hover:border-signal hover:text-signal",
												)}
											>
												{solution.title}
											</button>
										</motion.div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default SolutionsOrbit;
