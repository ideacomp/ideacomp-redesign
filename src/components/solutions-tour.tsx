"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PanelVideo from "@/components/panel-video";
import SolutionBands from "@/components/solution-bands";
import { CheckCircle, type Solution } from "@/lib/sitemap";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

/** The tour needs two real columns — a 22rem list beside a video that is still
 *  worth watching — so below this the bands take over.
 *
 *  1100, not a round 1024 or 1280, for the same reason the orbit before it used
 *  1336: which layout renders changes the page height, the scrollbar, and so
 *  the width the media query sees. A threshold on a common viewport width can
 *  flap. 1100 sits between the 1024 and 1280 classes, so neither can straddle
 *  it however the scrollbar falls (1024 is always below, 1280 − 15 above). */
const DESKTOP = "(min-width: 1100px)";

/** How long a slot without a video stays up. A slot with one holds for a full
 *  run of it instead — the videos are stories with an ending. */
const AUTOPLAY_MS = 7000;

/** The house easing, as used everywhere else on the site. */
const TRANSITION = { duration: 0.6, ease: [0.16, 1, 0.3, 1] } as const;

/**
 * The six solutions as a guided tour: a vertical list on the left, the active
 * solution's video large on the right, its three features beneath.
 *
 * It replaced the orbit (labels riding a half-circle around a 408px panel) on
 * 2026-10-15, which read as scattered tags rather than navigation: only three
 * of six labels were ever visible, the arc they rode was never drawn, the
 * labels were 11px uppercase mono, and the video — the thing the section now
 * exists to show — got under a third of the width. Here every option is
 * visible at once, the active one says what it is, and the panel is ~1.8×
 * larger.
 *
 * **The video drives the tour.** The active tab's bar is the video's own
 * progress, and the tour moves on when the video ends — after any hover or
 * keyboard visit is over. The player owns its pause / play and back-to-start
 * controls (`<PanelVideo>`); pausing holds the bar exactly where the video is.
 *
 * **Tabs, not a carousel.** The list is a `tablist` with roving tabindex and
 * arrow-key navigation; each panel is a `tabpanel` keeping `id={slug}`, so
 * `/solutions#cybersecurity` still deep-links. All six panels stay in the DOM
 * (stacked in one grid cell, inactive ones `inert`), so a crawler sees every
 * service, and the column never reflows between them.
 *
 * Under reduced motion and below `DESKTOP` the page renders `<SolutionBands>`
 * instead — an auto-advancing tour is the wrong mechanism there, not a slower
 * version of the right one.
 */
const SolutionsTour = ({ solutions }: { solutions: Solution[] }) => {
	const { dict } = useLocale();
	const shouldReduceMotion = useReducedMotion();
	const count = solutions.length;

	const [index, setIndex] = useState(0);
	// Bumped on every selection so the progress bar remounts and starts over,
	// even when the same tab is chosen again.
	const [cycle, setCycle] = useState(0);
	const [held, setHeld] = useState(false);
	const [onScreen, setOnScreen] = useState(true);
	const [tabVisible, setTabVisible] = useState(true);
	const [isDesktop, setIsDesktop] = useState(false);
	// `useReducedMotion` is null during SSR and `matchMedia` can't run there, so
	// both branches wait for mount or the markup disagrees on hydration.
	const [mounted, setMounted] = useState(false);
	const hostRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const progressRef = useRef<HTMLSpanElement>(null);
	const animRef = useRef<Animation | null>(null);
	const videoEls = useRef<(HTMLVideoElement | null)[]>([]);
	const indexRef = useRef(0);
	const heldRef = useRef(false);
	const pendingAdvance = useRef(false);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		const query = window.matchMedia(DESKTOP);
		const sync = () => setIsDesktop(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		const el = hostRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
			threshold: 0.15,
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [isDesktop, mounted]);

	useEffect(() => {
		const onVisibility = () => setTabVisible(!document.hidden);
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	const goTo = useCallback(
		(target: number) => {
			setIndex(((target % count) + count) % count);
			setCycle((c) => c + 1);
		},
		[count],
	);

	// `/solutions#cybersecurity` selects the service *and* brings the tour into
	// view. The scroll is ours, not the browser's: the page first renders the
	// tall bands (before mount we can't know the viewport), the browser jumps to
	// that band's id far down the page, and then the much shorter tour replaces
	// them — so every card on the homepage except the first used to land the
	// visitor below the tour. Re-run once the tour has actually rendered.
	//
	// Keyed on the slugs, not the array: switching language hands in a new
	// array with the same slugs, and re-running this used to re-select the
	// current solution and rewind its video mid-watch.
	const slugKey = solutions.map((s) => s.slug).join(",");
	useEffect(() => {
		const slugs = slugKey.split(",");
		const applyHash = () => {
			const target = slugs.indexOf(decodeURIComponent(window.location.hash.slice(1)));
			if (target < 0) return;
			if (target !== indexRef.current) goTo(target);
			const section = sectionRef.current;
			if (section) requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
		};
		applyHash();
		window.addEventListener("hashchange", applyHash);
		return () => window.removeEventListener("hashchange", applyHash);
	}, [slugKey, goTo, mounted, isDesktop]);

	/** User-driven moves rewrite the hash; autoplay does not, or a copied URL
	 *  would carry whatever happened to be up. `replaceState` neither scrolls
	 *  nor re-fires `hashchange`. */
	const select = useCallback(
		(target: number, focus = false) => {
			const next = ((target % count) + count) % count;
			goTo(next);
			const slug = solutions[next]?.slug;
			if (slug) window.history.replaceState(null, "", `#${slug}`);
			if (focus) tabRefs.current[next]?.focus();
		},
		[goTo, solutions, count],
	);

	const running = !held && onScreen && tabVisible && count > 1;
	const active = solutions[index];
	const hasVideo = Boolean(active?.video);
	indexRef.current = index;
	heldRef.current = held;

	/* A video slot's progress *is* the video: the bar reads its currentTime
	   every frame, so pausing, resuming and rewinding all show up truthfully,
	   and the tour advances when the video actually ends. */
	useEffect(() => {
		if (!hasVideo) return;
		let raf = 0;
		const tick = () => {
			const v = videoEls.current[index];
			const bar = progressRef.current;
			if (v && bar && v.duration) bar.style.transform = `scaleX(${Math.min(1, v.currentTime / v.duration)})`;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [hasVideo, index, cycle, mounted, isDesktop]);

	const onVideoEnded = useCallback(
		(i: number) => {
			if (i !== indexRef.current) return;
			// Someone is hovering or tabbing through: let them finish, then move on.
			if (heldRef.current) pendingAdvance.current = true;
			else goTo(i + 1);
		},
		[goTo],
	);
	useEffect(() => {
		if (!held && pendingAdvance.current) {
			pendingAdvance.current = false;
			goTo(indexRef.current + 1);
		}
	}, [held, goTo]);

	// A slot without a video falls back to a timed Web Animation.
	const dwell = AUTOPLAY_MS;

	// The progress bar is a Web Animation rather than a CSS keyframe: Tailwind
	// v4 tree-shakes keyframes no utility uses, so a CSS version never reached
	// the browser. Its `finish` advances the tour; pausing pauses it in place.
	useEffect(() => {
		const el = progressRef.current;
		if (!el || hasVideo) return;
		const anim = el.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
			duration: dwell,
			easing: "linear",
			fill: "forwards",
		});
		anim.onfinish = () => goTo(index + 1);
		animRef.current = anim;
		return () => anim.cancel();
	}, [index, cycle, dwell, goTo, mounted, isDesktop, hasVideo]);

	useEffect(() => {
		const anim = animRef.current;
		if (!anim) return;
		if (running) anim.play();
		else anim.pause();
	}, [running, index, cycle]);

	const onKeyDown = (event: React.KeyboardEvent) => {
		const keys: Record<string, number> = {
			ArrowDown: index + 1,
			ArrowRight: index + 1,
			ArrowUp: index - 1,
			ArrowLeft: index - 1,
			Home: 0,
			End: count - 1,
		};
		if (event.key in keys) {
			event.preventDefault();
			select(keys[event.key], true);
		}
	};

	if (!mounted || shouldReduceMotion || !isDesktop) {
		return <SolutionBands solutions={solutions} />;
	}

	return (
		<section
			ref={sectionRef}
			className="surface-paper relative scroll-mt-16 overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
			aria-label={dict.common.jumpToSolutionLabel}
		>
			<div
				ref={hostRef}
				className="mx-auto grid max-w-6xl grid-cols-[minmax(0,21rem)_minmax(0,1fr)] items-start gap-x-14"
				onMouseEnter={() => setHeld(true)}
				onMouseLeave={() => setHeld(false)}
				// Keyboard focus holds the tour; a mouse click on a tab does not, or
				// one click would freeze it for as long as the button kept focus.
				onFocusCapture={(e) => setHeld((e.target as HTMLElement).matches(":focus-visible"))}
				onBlurCapture={() => setHeld(false)}
			>
				{/* The list. Every option visible, the active one expanded. */}
				<div
					role="tablist"
					aria-orientation="vertical"
					aria-label={dict.common.solutionsRoleDescription}
					onKeyDown={onKeyDown}
					className="flex flex-col border-b border-border"
				>
					{solutions.map((solution, i) => {
						const isActive = i === index;
						return (
							<button
								key={solution.slug}
								ref={(el) => {
									tabRefs.current[i] = el;
								}}
								type="button"
								role="tab"
								id={`tab-${solution.slug}`}
								aria-selected={isActive}
								aria-controls={solution.slug}
								tabIndex={isActive ? 0 : -1}
								onClick={() => select(i)}
								className="group relative border-t border-border py-5 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
							>
								{/* Progress rides the tab's own top rule, so the list's
								    dividers double as the timeline. */}
								{isActive && (
									<span aria-hidden="true" className="absolute inset-x-0 -top-px h-0.5 overflow-hidden">
										<span
											ref={progressRef}
											className="block h-full origin-left scale-x-0 bg-signal"
										/>
									</span>
								)}
								<span className="flex items-center gap-3">
									<solution.icon
										className={cn(
											"size-5 shrink-0 transition-colors motion-safe:duration-300",
											isActive ? "text-signal" : "text-foreground/40 group-hover:text-foreground/70",
										)}
										aria-hidden="true"
									/>
									<span
										className={cn(
											"font-display text-[1.625rem] leading-tight font-semibold tracking-[-0.01em] text-balance transition-colors motion-safe:duration-300",
											isActive ? "text-foreground" : "text-foreground/55 group-hover:text-foreground/85",
										)}
									>
										{solution.title}
									</span>
								</span>
								{/* Height animates through the 0fr → 1fr grid-row trick, so
								    the list never needs a measured height. */}
								<span
									className={cn(
										"grid transition-[grid-template-rows,opacity] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]",
										isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
									)}
								>
									<span className="overflow-hidden">
										<span className="block pt-3 pl-8 text-[0.9375rem] leading-relaxed text-muted-foreground">
											{solution.detailedDescription}
										</span>
									</span>
								</span>
							</button>
						);
					})}
				</div>

				{/* The panels, all six stacked in one grid cell. */}
				<div className="grid">
					{solutions.map((solution, i) => {
						const isActive = i === index;
						return (
							<motion.div
								key={solution.slug}
								id={solution.slug}
								role="tabpanel"
								aria-labelledby={`tab-${solution.slug}`}
								className="[grid-area:1/1] scroll-mt-28"
								initial={false}
								animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
								transition={TRANSITION}
								aria-hidden={!isActive}
								inert={!isActive}
							>
								<h2 className="sr-only">{solution.title}</h2>
								{/* No frame: the video is rendered on the section's own colour. */}
								<div className="relative aspect-[3/2]">
									{solution.video ? (
										<PanelVideo
											className="video-feather"
											src={solution.video.src}
											poster={solution.video.poster}
											label={solution.video.label}
											playing={isActive}
											// Each selection starts the run over; pause and language
											// switches keep the position.
											restartKey={isActive ? cycle : -1}
											loop={false}
											onEnded={() => onVideoEnded(i)}
											videoRef={(el) => {
												videoEls.current[i] = el;
											}}
										/>
									) : (
										<Image
											src={solution.image.src}
											alt={solution.image.alt}
											fill
											sizes="(min-width: 1152px) 744px, 60vw"
											priority={i === 0}
											className="object-cover"
										/>
									)}
								</div>

								<ul className="mt-9 grid grid-cols-3 gap-x-8">
									{solution.features.map((feature) => (
										<li key={feature.name}>
											<span className="flex items-center gap-2 font-medium text-foreground">
												<CheckCircle size={17} className="shrink-0 text-signal" aria-hidden="true" />
												{feature.name}
											</span>
											<p className="mt-2 text-sm leading-relaxed text-foreground/70">{feature.description}</p>
										</li>
									))}
								</ul>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default SolutionsTour;
