"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, type PanInfo } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import AccentHeading from "@/components/accent-heading";
import SectionWatermark from "@/components/section-watermark";
import { IMAGE_FRAME } from "@/components/framed-image";
import { CAROUSEL_CONTROL } from "@/components/photo-carousel";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/lib/i18n/locale-context";
import { content, references, type ReferenceProject } from "@/lib/sitemap";
import { cn } from "@/lib/utils";

/** Matched to `<PhotoCarousel>`: a swipe clears both or it was a tap. */
const DRAG_DISTANCE = 40;
const DRAG_VELOCITY = 400;

/** Scroll distance the section claims per project, on top of the one screen the
 *  pin itself occupies. Four projects give 320svh of section and 220svh of
 *  travel — about 55svh per project, which is a short flick each rather than a
 *  full screen. Raising this makes the page feel stuck; lowering it makes the
 *  crossfades trip over each other. */
const SVH_PER_PROJECT = 80;

/** The breakpoint the pinned layout starts at. Below it the section is ordinary
 *  page flow and the controls are the only way through. */
const DESKTOP = "(min-width: 1024px)";

/** Safari has no `scrollend`, so a programmatic scroll needs a fallback before
 *  the scroll handler is allowed to set the index again. */
const SCROLL_LOCK_MS = 900;

/**
 * The sites we have actually built and shipped.
 *
 * Adapted from the mechanism on vivanty.cz, which is worth describing because it
 * is not what it looks like: there is no slider library there at all. It is a
 * 500vh section with a `sticky top-0 h-screen` child, page-scroll progress
 * mapped to a slide index, and an opacity crossfade between absolutely-stacked
 * panes. That much carried over. What did not is the implementation — their
 * hand-latched rAF scroll listener is replaced by `useScroll`, already this
 * project's idiom in `<ProcessTimeline>` — and four things it gets wrong:
 *
 * 1. **Scroll-pinning is a scroll hijack**, so the `prefers-reduced-motion`
 *    block in globals.css is not enough — it only shortens transitions, and the
 *    pin is not a transition. Under reduced motion the whole mechanism is
 *    replaced by a plain grid of every project. The branch is gated on
 *    `mounted` because `useReducedMotion()` is null during SSR.
 * 2. **The inactive panes contain links.** `aria-hidden` alone is what
 *    `<PhotoCarousel>` uses and is right there, since its slides are only
 *    images; here a hidden pane still holds a focusable `<a>`, so Tab would
 *    land on an invisible link to someone else's site. Hence `inert`.
 * 3. **Their dots are non-interactive `<div>`s** and the arrows are icon-only
 *    with no accessible name.
 * 4. **No swipe on touch**, where the pin does not apply and the controls are
 *    the only way through.
 *
 * There is deliberately no autoplay, and so no pause control: on desktop the
 * reader's own scroll is the transport, and on touch it is the arrows. That is
 * the one PRODUCT.md requirement `<PhotoCarousel>` had to grow a pause button
 * for, and this section sidesteps it rather than satisfying it.
 */
const ReferenceShowcase = () => {
	const { dict, locale } = useLocale();
	const copy = content[locale].home.references;
	const projects = references[locale];
	const count = projects.length;

	const shouldReduceMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const reduced = mounted && shouldReduceMotion;

	const sectionRef = useRef<HTMLElement>(null);
	const [index, setIndex] = useState(0);

	// Tracked in JS as well as CSS because the scroll handler and the arrow
	// behaviour both change at this breakpoint, not just the layout.
	const [desktop, setDesktop] = useState(false);
	useEffect(() => {
		const query = window.matchMedia(DESKTOP);
		const sync = () => setDesktop(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	const scrollDriven = desktop && !reduced;

	// While a programmatic scroll is animating, the scroll handler would fight
	// it: it reads intermediate positions and sets the index back to whatever
	// the page is passing through on its way to the target.
	const locked = useRef(false);
	const unlock = useRef<() => void>(() => {});
	useEffect(() => () => unlock.current(), []);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	useMotionValueEvent(scrollYProgress, "change", (t) => {
		if (!scrollDriven || locked.current) return;
		setIndex(Math.min(Math.floor(t * count), count - 1));
	});

	const go = useCallback(
		(next: number) => {
			const target = Math.max(0, Math.min(count - 1, next));
			setIndex(target);

			const el = sectionRef.current;
			if (!scrollDriven || !el) return;

			// Move the page to where this slide's band sits, or the pin and the
			// scroll position disagree and the next wheel tick snaps back.
			const travel = el.offsetHeight - window.innerHeight;
			// Aim at the middle of the band rather than its leading edge: an exact
			// boundary is where a single pixel of rounding flips to the neighbour.
			const top = el.offsetTop + ((target + 0.5) / count) * travel;

			unlock.current();
			locked.current = true;
			const release = () => {
				locked.current = false;
				window.removeEventListener("scrollend", release);
				window.clearTimeout(timer);
				unlock.current = () => {};
			};
			const timer = window.setTimeout(release, SCROLL_LOCK_MS);
			window.addEventListener("scrollend", release);
			unlock.current = release;

			window.scrollTo({ top, behavior: "smooth" });
		},
		[count, scrollDriven],
	);

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

	const heading = (
		<>
			<AccentHeading id="reference-heading" title={copy.title} accent={copy.accent} rule />
			<p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/70">{copy.subtitle}</p>
		</>
	);

	// Reduced motion: no pin, no crossfade, no transport. Every project is just
	// on the page. Nothing here is hidden, so nothing needs `inert`.
	if (reduced) {
		return (
			<section
				id="reference"
				className="dark relative scroll-mt-20 overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8"
				aria-labelledby="reference-heading"
			>
				<SectionWatermark word={copy.watermark} />

				<div className="relative mx-auto max-w-6xl">
					{heading}
					<ul className="mt-14 grid gap-12 sm:grid-cols-2">
						{projects.map((project, i) => (
							<li key={project.slug}>
								<div className={cn(IMAGE_FRAME, "aspect-[16/10]")}>
									<Image
										src={project.image.src}
										alt={project.image.alt}
										fill
										sizes="(min-width: 640px) 50vw, 100vw"
										className="object-cover object-top"
									/>
								</div>
								<ProjectIdentity project={project} n={i} className="mt-6" />
							</li>
						))}
					</ul>
				</div>
			</section>
		);
	}

	return (
		<section
			id="reference"
			ref={sectionRef}
			className="dark relative scroll-mt-20 bg-background lg:h-[calc(var(--projects)*var(--svh-each))]"
			style={
				{
					"--projects": count,
					"--svh-each": `${SVH_PER_PROJECT}svh`,
				} as CSSProperties
			}
			aria-labelledby="reference-heading"
		>
			{/* `overflow-hidden` lives here rather than on the section because the
			    watermark is clipped by the pinned viewport, not by the tall scroll
			    track — and because an `overflow-hidden` scroll ancestor is exactly
			    what stops `position: sticky` from sticking. */}
			{/* Top-anchored with the same `pt-24` every other section uses, not
			    centred. Centring inside a full-height pane makes the gap above the
			    heading a function of the window — 123px at 900 tall, 213px at 1080 —
			    so this section never matched the rhythm of the ones around it, and
			    did not even match itself between two machines. 96px is the same
			    distance "Where We Build" puts above its heading, and it clears the
			    fixed header by the same margin those sections do. */}
			<div className="relative overflow-hidden px-4 py-24 sm:px-6 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-start lg:px-8 lg:pt-24 lg:pb-0">
				<SectionWatermark word={copy.watermark} />

				{/* Wider than the site's `max-w-6xl` rail, and the only section that
				    is. A screenshot has to be read, not just recognised, and inside
				    1152px a three-fifths column leaves it 672px wide — small enough
				    that the captured site's own body copy turns to texture. Width is
				    what binds here, not height: even with the whole pinned viewport
				    free, a 16:10 frame in that column could not get taller without
				    first getting wider. 80rem is as far as this can go — at 86rem the
				    section had no margin left at 1440px, the heading sat flush to the
				    viewport edge and its rule bled off it. Bleeding it off the right edge the way
				    `<FocusBand>` does was the other option and is wrong for this
				    content — that band holds a photograph, where losing an edge costs
				    nothing, whereas cropping a home page cuts off half its layout. */}
				<div className="relative mx-auto w-full max-w-6xl lg:max-w-[80rem]">
					<Reveal>{heading}</Reveal>

					<div
						role="group"
						aria-roledescription={dict.common.showcaseRoleDescription}
						aria-label={copy.label}
						onKeyDown={onKeyDown}
						// The identity block is four short lines, so the split is far off
						// centre: the left column only has to fit the longest project name
						// and the transport under it, and everything else goes to the frame.
						className="mt-10 flex flex-col gap-8 lg:mt-12 lg:grid lg:grid-cols-[minmax(17rem,1fr)_minmax(0,2.35fr)] lg:items-center lg:gap-12"
					>
						{/* Text pane. Every project is stacked here; only the active one
						    is in flow, so the column is exactly as tall as what it shows
						    instead of as tall as the longest name. The transport sits in
						    this column too, directly under the identity: parked in a grid
						    row of its own it read as a stray row of dots, and the left
						    column read as a small block floating in a lot of nothing. */}
						<div>
							<div className="relative">
								{projects.map((project, i) => (
									<div
										key={project.slug}
										className={cn(
											"top-0 left-0 w-full transition-opacity motion-safe:duration-500",
											i === index ? "relative opacity-100" : "absolute opacity-0",
										)}
										aria-hidden={i !== index}
										inert={i !== index}
									>
										<ProjectIdentity project={project} n={i} />
									</div>
								))}
							</div>

							<div className="mt-10 flex items-center gap-1.5 sm:gap-2.5">
								<button
									type="button"
									onClick={() => go(index - 1)}
									disabled={index === 0}
									aria-label={dict.common.previousProject}
									className={cn(
										CAROUSEL_CONTROL,
										"disabled:pointer-events-none disabled:opacity-35",
									)}
								>
									<ChevronLeft size={16} aria-hidden="true" />
								</button>
								<button
									type="button"
									onClick={() => go(index + 1)}
									disabled={index === count - 1}
									aria-label={dict.common.nextProject}
									className={cn(
										CAROUSEL_CONTROL,
										"disabled:pointer-events-none disabled:opacity-35",
									)}
								>
									<ChevronRight size={16} aria-hidden="true" />
								</button>

								{/* No `01 / 04` counter here, unlike `<PhotoCarousel>`. The
								    identity block already sets the index in mono a few lines
								    up, and four dots make the total obvious — printing "01"
								    twice inside one column is just noise. */}
								<div className="ml-1 flex items-center">
									{projects.map((project, i) => (
										<button
											key={project.slug}
											type="button"
											onClick={() => go(i)}
											aria-label={`${dict.common.goToProject}: ${project.name}`}
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
							</div>
						</div>

						{/* Image pane. `order-first` below lg puts the screenshot above the
						    name on a phone, while the DOM keeps the name first so a screen
						    reader hears what the site is before it hears the alt text. */}
						<motion.div
							className={cn(
								IMAGE_FRAME,
								"aspect-[16/10] max-lg:order-first",
								// Anchoring the heading at a fixed 96px means the frame can no
								// longer absorb a short window by re-centring, and the pane is
								// `overflow-hidden`, so on something like 1440x800 the bottom
								// of the frame would simply be cut off. 20rem is the rest of
								// the column — padding, heading, rule, subtitle, gap. When it
								// bites, `object-top` spends the loss on the foot of the
								// captured page and keeps its masthead.
								"lg:max-h-[calc(100svh-20rem)]",
								count > 1 && "cursor-grab active:cursor-grabbing",
							)}
							drag={count > 1 ? "x" : false}
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0.08}
							dragMomentum={false}
							onDragEnd={onDragEnd}
						>
							{projects.map((project, i) => (
								<motion.div
									key={project.slug}
									className="absolute inset-0"
									initial={false}
									animate={{ opacity: i === index ? 1 : 0 }}
									transition={
										shouldReduceMotion
											? { duration: 0 }
											: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
									}
									aria-hidden={i !== index}
								>
									<Image
										src={project.image.src}
										alt={project.image.alt}
										fill
										// The column stops growing once the container hits its 80rem
									// cap, so past ~1344 this is a fixed 864px, not a fraction.
									sizes="(min-width: 1344px) 864px, (min-width: 1024px) 66vw, 100vw"
										draggable={false}
										// `object-top`: these are 16:10 hero captures shown in a
										// 16:10 frame, so nothing is cropped today — but if a
										// future capture comes in taller, losing the bottom of a
										// page beats losing its masthead.
										className="object-cover object-top select-none"
									/>
								</motion.div>
							))}
						</motion.div>

					</div>
				</div>
			</div>
		</section>
	);
};

/**
 * One project's name and domain — the whole of what a slide says.
 *
 * Deliberately sparse: no description, no tech chips, no sector label. The
 * screenshot is the argument, and a mono index over a name over a hairline over
 * a host reads as a datasheet entry, which is the register the rest of the site
 * is written in.
 */
const ProjectIdentity = ({
	project,
	n,
	className,
}: {
	project: ReferenceProject;
	n: number;
	className?: string;
}) => {
	const { dict } = useLocale();

	return (
		<div className={className}>
			<span className="font-mono text-xs tracking-[0.16em] text-signal tabular-nums">
				{String(n + 1).padStart(2, "0")}
			</span>

			<h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] text-foreground sm:text-4xl">
				<a
					href={project.href}
					target="_blank"
					rel="noopener noreferrer"
					className="group/link inline-flex items-baseline gap-2 transition-colors motion-safe:duration-300 hover:text-signal focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
				>
					{project.name}
					<ArrowUpRight
						size={22}
						aria-hidden="true"
						className="shrink-0 translate-y-0.5 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover/link:-translate-y-0.5"
					/>
					<span className="sr-only">{` (${dict.common.opensInNewTab})`}</span>
				</a>
			</h3>

			<div className="mt-5 h-px w-16 bg-signal/50" aria-hidden="true" />

			<p className="mt-4 font-mono text-sm tracking-[0.04em] text-foreground/60">{project.domain}</p>
		</div>
	);
};

export default ReferenceShowcase;
