"use client";

import FramedImage from "@/components/framed-image";
import { Reveal } from "@/components/reveal";
import { CheckCircle, type Solution } from "@/lib/sitemap";

/**
 * The six solutions as alternating full-width spec-sheet bands.
 *
 * This was `/solutions` itself until the orbit replaced it, and it is lifted
 * here verbatim rather than deleted because it is still the layout two audiences
 * actually get: anything narrower than `lg`, where a ring of labels around an
 * image has nowhere to go, and anyone who asked for reduced motion, where an
 * auto-advancing carousel is the wrong mechanism rather than a slower one.
 * `<SolutionsOrbit>` renders this component for both cases.
 *
 * Every band keeps `id={slug}`, so `/solutions#cybersecurity` resolves here too
 * — the deep links from `<CapabilityGrid>` and the hero jump-nav have to land
 * whichever layout is on screen.
 *
 * `isDark` alternates the surface, which is also why `ai-ml`, `web-development`
 * and `mobile-development` are the three panels graded for a light ground (see
 * `docs/photo-sources.md`). The orbit puts every panel on the dark surface
 * instead, so that coupling only holds in here now.
 */
export const SolutionBands = ({ solutions }: { solutions: Solution[] }) => (
	<>
		{solutions.map((solution, index) => {
			const isDark = index % 2 === 1;
			const reversed = index % 2 === 1;
			return (
				<section
					key={solution.slug}
					id={solution.slug}
					className={`scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8 ${isDark ? "dark bg-background" : "bg-background"}`}
					aria-labelledby={`${solution.slug}-heading`}
				>
					<div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
						<Reveal className={reversed ? "lg:order-2" : undefined}>
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
						</Reveal>

						<Reveal className={(reversed ? "lg:order-1 " : "") + "group"}>
							<solution.icon
								className="size-8 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
								aria-hidden="true"
							/>
							<h2
								id={`${solution.slug}-heading`}
								className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl"
							>
								{solution.title}
							</h2>
							<p className="mt-4 text-base leading-relaxed text-muted-foreground">
								{solution.detailedDescription}
							</p>
							<ul className="mt-6 space-y-3">
								{solution.features.map((feature) => (
									<li key={feature.name} className="group flex gap-3">
										<CheckCircle
											size={18}
											className="mt-0.5 shrink-0 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
											aria-hidden="true"
										/>
										<span className="text-sm leading-relaxed text-foreground/80">
											<span className="font-medium text-foreground">{feature.name}.</span>{" "}
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

export default SolutionBands;
