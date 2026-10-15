"use client";

import { useEffect, useState } from "react";
import FramedImage, { IMAGE_FRAME } from "@/components/framed-image";
import PanelVideo from "@/components/panel-video";
import { Reveal } from "@/components/reveal";
import { CheckCircle, type Solution } from "@/lib/sitemap";
import { cn } from "@/lib/utils";

/** Below `lg` the bands switch to their phone layout. */
const NARROW = "(max-width: 1023.98px)";

/**
 * The six solutions as alternating full-width spec-sheet bands.
 *
 * This is the layout two audiences get instead of `<SolutionsTour>`: anything
 * narrower than the tour's breakpoint, and anyone who asked for reduced
 * motion, where an auto-advancing tour is the wrong mechanism rather than a
 * slower one. `<SolutionsTour>` renders this component for both cases.
 *
 * **Phones get their own composition** (2026-10-15, desktop untouched):
 * - One dark surface with a hairline between solutions, instead of light and
 *   dark stripes that, each carrying a blue video, read as unrelated blocks.
 * - Title first: icon + heading, then the video, then the copy — so the
 *   visitor knows what a video is about before it plays. Two headings exist
 *   for that (one per layout, the other `display:none`), so only one is ever
 *   in the accessibility tree.
 * - Feature names on their own line, tighter vertical rhythm.
 *
 * The dark surface on phones is applied after mount (`.dark` is a class scope,
 * not something CSS can switch per breakpoint). The bands sit below the hero,
 * so the swap happens off-screen.
 *
 * Every band keeps `id={slug}`, so `/solutions#cybersecurity` resolves here too
 * — the deep links from `<CapabilityGrid>` and the hero jump-nav have to land
 * whichever layout is on screen.
 */
export const SolutionBands = ({ solutions }: { solutions: Solution[] }) => {
	const [narrow, setNarrow] = useState(false);

	useEffect(() => {
		const query = window.matchMedia(NARROW);
		const sync = () => setNarrow(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	return (
		<>
			{solutions.map((solution, index) => {
				const isDark = narrow || index % 2 === 1;
				const reversed = index % 2 === 1;
				return (
					<section
						key={solution.slug}
						id={solution.slug}
						className={cn(
							"scroll-mt-20 bg-background px-4 py-20 sm:px-6 lg:px-8",
							isDark && "dark",
							// Phone rhythm: one surface, a hairline between solutions.
							"max-lg:py-12",
							index > 0 && "max-lg:border-t max-lg:border-border",
						)}
						aria-labelledby={`${solution.slug}-heading`}
					>
						<div className="mx-auto grid max-w-6xl items-center gap-12 max-lg:gap-6 lg:grid-cols-2">
							{/* Phone heading: above the video. */}
							<div className="flex items-center gap-3 lg:hidden">
								<solution.icon className="size-7 shrink-0 text-signal" aria-hidden="true" />
								<h2
									id={`${solution.slug}-heading`}
									className="font-display text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance text-foreground"
								>
									{solution.title}
								</h2>
							</div>

							<Reveal className={reversed ? "lg:order-2" : undefined}>
								{solution.video ? (
									// Edge to edge on phones: the video is the panel's whole
									// point, and the 16px gutters cost it ~9% of an already
									// small width.
									<div
										className={`${IMAGE_FRAME} aspect-[3/2] max-sm:-mx-4 max-sm:rounded-none max-sm:border-x-0`}
									>
										<PanelVideo
											src={solution.video.src}
											poster={solution.video.poster}
											label={solution.video.label}
											playing
											className="absolute inset-0"
										/>
									</div>
								) : (
									<FramedImage
										src={solution.image.src}
										alt={solution.image.alt}
										// The grid caps at max-w-6xl (1152px) with gap-12, so a
										// column never exceeds 552px — a plain 50vw would fetch
										// the 1080w candidate for it on a wide viewport.
										sizes="(min-width: 1152px) 552px, (min-width: 1024px) 50vw, 100vw"
										priority={index === 0}
										className="aspect-[3/2]"
									/>
								)}
							</Reveal>

							<Reveal className={(reversed ? "lg:order-1 " : "") + "group"}>
								{/* Desktop heading: beside the video, as before. */}
								<div className="max-lg:hidden">
									<solution.icon
										className="size-8 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
										aria-hidden="true"
									/>
									<h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
										{solution.title}
									</h2>
								</div>
								<p className="mt-4 text-base leading-relaxed text-muted-foreground max-lg:mt-0">
									{solution.detailedDescription}
								</p>
								<ul className="mt-6 space-y-3 max-lg:mt-5 max-lg:space-y-4">
									{solution.features.map((feature) => (
										<li key={feature.name} className="group flex gap-3">
											<CheckCircle
												size={18}
												className="mt-0.5 shrink-0 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
												aria-hidden="true"
											/>
											<span className="text-sm leading-relaxed text-foreground/80 max-lg:text-[0.9375rem]">
												<span className="font-medium text-foreground max-lg:block">
													{feature.name}
													<span className="max-lg:hidden">.</span>
												</span>{" "}
												{feature.description}
											</span>
										</li>
									))}
								</ul>
							</Reveal>
						</div>
					</section>
				);
			})}
		</>
	);
};

export default SolutionBands;
