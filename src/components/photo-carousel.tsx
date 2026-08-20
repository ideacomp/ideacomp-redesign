"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { IMAGE_FRAME } from "@/components/framed-image";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
	src: string;
	alt: string;
	/** Short line naming what the photo shows. Rendered over the image. */
	caption?: string;
}

interface PhotoCarouselProps {
	slides: CarouselSlide[];
	/** Names the whole group for assistive tech, e.g. "Photos from GITEX Dubai". */
	label: string;
	sizes: string;
	priority?: boolean;
	autoplayMs?: number;
	className?: string;
}

/** Swipe has to clear both of these to count, so a tap never advances a slide. */
const DRAG_DISTANCE = 40;
const DRAG_VELOCITY = 400;

/** Shared look for the arrow and pause buttons. 32px is the visible circle; the
 *  row's gap keeps neighbouring targets from crowding each other on touch.
 *
 *  Exported because `<ReferenceShowcase>` renders the same cluster of arrows and
 *  dots over a different kind of slide, and two copies of this string would
 *  drift the moment one of them is retuned. */
export const CAROUSEL_CONTROL =
	"flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/30 " +
	"text-foreground/80 transition-colors motion-safe:duration-300 " +
	"hover:border-signal hover:bg-signal hover:text-signal-foreground " +
	"focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

/**
 * Crossfading photo band, sharing the site's single image frame.
 *
 * Adapted from the react-bits Carousel (the same collection Grainient and
 * TextType came from) rather than dropped in: that component is a fixed
 * `baseWidth` card widget built around icon/title/description content and its own
 * stylesheet, none of which survives a fluid band that bleeds off the viewport
 * edge. What carried over is its behaviour — drag-to-advance gated on a velocity
 * threshold, and the indicator row.
 *
 * Crossfade rather than a sliding track, for two concrete reasons: a translated
 * track has to either clone its edge slides or visibly rewind past every frame
 * when looping from last to first, and jumping to an arbitrary slide from the
 * indicators sweeps through everything in between. A dissolve loops seamlessly
 * and treats every jump the same.
 *
 * Autoplay stops when: the user pauses it, focus is inside the group, the pointer
 * is over it, the tab is hidden, the band is scrolled out of view, or the OS asks
 * for reduced motion. The explicit pause control is the one PRODUCT.md requires —
 * pausing on hover alone leaves keyboard and touch users unable to stop it.
 *
 * The controls are deliberately unsubtle. A first version put small dots at the
 * bottom *right*, which on desktop is the right edge of the viewport — the band
 * bleeds off it — and they went unnoticed, so the band did not read as a carousel
 * at all. Everything now sits bottom-left, inside the visible area: arrows, equal
 * dots, and an explicit `01 / 04` count. Nothing is hover-revealed, since that
 * hides the affordance on touch entirely.
 */
const PhotoCarousel = ({
	slides,
	label,
	sizes,
	priority = false,
	autoplayMs = 6000,
	className,
}: PhotoCarouselProps) => {
	const { dict } = useLocale();
	const shouldReduceMotion = useReducedMotion();
	const [index, setIndex] = useState(0);
	const [userPaused, setUserPaused] = useState(false);
	const [held, setHeld] = useState(false);
	const [onScreen, setOnScreen] = useState(true);
	const [tabVisible, setTabVisible] = useState(true);
	// `useReducedMotion` is null during SSR, so anything it removes from the tree
	// has to wait for mount or the server and client markup disagree.
	const [mounted, setMounted] = useState(false);
	const hostRef = useRef<HTMLDivElement>(null);

	useEffect(() => setMounted(true), []);

	const count = slides.length;
	const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

	// Don't run a timer for a band nobody is looking at.
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

	const running =
		!shouldReduceMotion && !userPaused && !held && onScreen && tabVisible && count > 1;

	useEffect(() => {
		if (!running) return;
		const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), autoplayMs);
		return () => window.clearInterval(timer);
	}, [running, autoplayMs, count]);

	const onDragEnd = (_: unknown, info: PanInfo) => {
		const { offset, velocity } = info;
		if (offset.x < -DRAG_DISTANCE || velocity.x < -DRAG_VELOCITY) go(index + 1);
		else if (offset.x > DRAG_DISTANCE || velocity.x > DRAG_VELOCITY) go(index - 1);
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowRight") {
			event.preventDefault();
			go(index + 1);
		} else if (event.key === "ArrowLeft") {
			event.preventDefault();
			go(index - 1);
		}
	};

	const active = slides[index];

	return (
		<div
			ref={hostRef}
			className={cn(IMAGE_FRAME, className)}
			role="group"
			aria-roledescription={dict.common.carouselRoleDescription}
			aria-label={label}
			onMouseEnter={() => setHeld(true)}
			onMouseLeave={() => setHeld(false)}
			onFocusCapture={() => setHeld(true)}
			onBlurCapture={() => setHeld(false)}
			onKeyDown={onKeyDown}
		>
			{/* `dragElastic` is deliberately tiny: the slides crossfade rather than
			    track the finger, so the frame gives just enough to read as a swipe
			    and springs back. `dragConstraints` pinned to 0 keeps it in place. */}
			<motion.div
				className="absolute inset-0 cursor-grab active:cursor-grabbing"
				drag={count > 1 ? "x" : false}
				dragConstraints={{ left: 0, right: 0 }}
				dragElastic={0.08}
				dragMomentum={false}
				onDragStart={() => setHeld(true)}
				onDragEnd={onDragEnd}
			>
				{slides.map((slide, i) => (
					<motion.div
						key={slide.src}
						className="absolute inset-0"
						initial={false}
						animate={{ opacity: i === index ? 1 : 0 }}
						transition={
							shouldReduceMotion
								? { duration: 0 }
								: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
						}
						// Only the visible frame is exposed; the rest are decorative
						// duplicates as far as a screen reader is concerned.
						aria-hidden={i !== index}
					>
						<Image
							src={slide.src}
							alt={slide.alt}
							fill
							sizes={sizes}
							priority={priority && i === 0}
							draggable={false}
							className="object-cover select-none"
						/>
					</motion.div>
				))}
			</motion.div>

			{/* Caption and controls sit on their own scrim and in the `dark` palette.

			    Both are needed. The slides run from a near-black stage to a bright
			    daylit forecourt, so no single ink colour clears contrast on all of
			    them — the scrim gives the text a consistent ground regardless of the
			    photo under it. Switching to `dark` then makes every token resolve to
			    its light-on-graphite value, including `signal`, whose light-surface
			    value is too dark to read on that scrim.

			    This scrim carries the whole burden now. It used to sit on top of the
			    duotone stack, which had already flattened and darkened every slide;
			    with the photos in their own colour the brightest one is brighter than
			    anything that was measured against back then. */}
			{/* Reaches half the band and stays dense well above the bottom edge. The
			    cluster is two rows tall, so a scrim that only darkens the last few
			    pixels leaves the caption sitting on raw photo — measured at 3.1:1 over
			    the daylit slides before this was deepened.

			    Deepened a second time when the duotone came off. At 80/55 the caption
			    measured 4.76:1 over the brightest slide — passing, but with almost no
			    room, since 11px is small text and the bar is 4.5:1. At 92/68 the worst
			    slide measures 7.89:1. Re-measure from rendered pixels if a slide is
			    swapped; parsing the computed `color` does not work, these tokens
			    resolve to `oklab()`. */}
			<div
				className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/92 via-black/68 to-transparent"
				aria-hidden="true"
			/>
			{/* Everything lives bottom-left, not split across the band. On desktop the
			    right edge of this box is the right edge of the viewport, so controls
			    parked there sit flush against the screen edge and read as decoration —
			    which is exactly why the first version went unnoticed. */}
			<div className="dark pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 sm:p-5">
				{active.caption ? (
					<p
						key={active.caption}
						// Full-strength ink, not a faded tint: at 11px this is small text,
						// so it needs 4.5:1 against the scrim, and 80% opacity measured
						// at only ~4.4:1 over the brightest slide.
						className="max-w-[85%] font-mono text-[0.6875rem] leading-relaxed tracking-[0.12em] uppercase text-foreground"
					>
						{active.caption}
					</p>
				) : null}

				{count > 1 ? (
					<div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
						<button
							type="button"
							onClick={() => go(index - 1)}
							aria-label={dict.common.previousSlide}
							className={CAROUSEL_CONTROL}
						>
							<ChevronLeft size={16} aria-hidden="true" />
						</button>
						<button
							type="button"
							onClick={() => go(index + 1)}
							aria-label={dict.common.nextSlide}
							className={CAROUSEL_CONTROL}
						>
							<ChevronRight size={16} aria-hidden="true" />
						</button>

						{/* Equal circles rather than a stretched active pill: these have to
						    read as "photo 2 of 4" at a glance, which a bar does not. The
						    24px button around each 8px dot keeps the tap target usable. */}
						<div className="ml-1 flex items-center">
							{slides.map((slide, i) => (
								<button
									key={slide.src}
									type="button"
									onClick={() => go(i)}
									aria-label={`${dict.common.goToSlide} ${i + 1}`}
									aria-current={i === index}
									className="flex size-6 items-center justify-center rounded-full focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
								>
									<span
										className={cn(
											"size-2 rounded-full transition-colors motion-safe:duration-300",
											i === index ? "bg-signal" : "bg-foreground/45 hover:bg-foreground/80",
										)}
									/>
								</button>
							))}
						</div>

						{/* Redundant with the dots on purpose: the explicit count is what was
						    asked for, and mono numerals are already this project's idiom for
						    indices. Hidden from assistive tech, which reads position from
						    `aria-current` on the dots instead of hearing it twice. */}
						<span
							aria-hidden="true"
							className="font-mono text-[0.6875rem] tracking-[0.12em] text-foreground/70 tabular-nums"
						>
							{String(index + 1).padStart(2, "0")}
							<span className="text-foreground/40"> / </span>
							{String(count).padStart(2, "0")}
						</span>

						{/* Hidden once mounted under reduced motion: there is no autoplay
						    to pause. Gated on `mounted` so SSR and hydration agree. */}
						{mounted && shouldReduceMotion ? null : (
							<button
								type="button"
								onClick={() => setUserPaused((p) => !p)}
								aria-label={userPaused ? dict.common.playSlideshow : dict.common.pauseSlideshow}
								className={cn(CAROUSEL_CONTROL, "ml-1")}
							>
								{userPaused ? (
									<Play size={13} aria-hidden="true" />
								) : (
									<Pause size={13} aria-hidden="true" />
								)}
							</button>
						)}
					</div>
				) : null}
			</div>
		</div>
	);
};

export default PhotoCarousel;
