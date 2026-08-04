"use client";

import { CheckCircle } from "lucide-react";
import { solutionsData, content } from "@/lib/sitemap";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import FramedImage from "@/components/framed-image";
import { Reveal } from "@/components/reveal";
import { IndustriesGrid } from "@/components/industries-grid";
import { CtaSection } from "@/components/cta-section";
import { useLocale } from "@/lib/i18n/locale-context";

const Solutions = () => {
	const { dict, locale } = useLocale();
	const pageContent = content[locale];
	const solutions = solutionsData[locale];

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero */}
			<section
				className="dark relative flex min-h-[420px] items-center overflow-hidden bg-background px-4 pt-32 pb-16 sm:px-6 lg:px-8"
				aria-labelledby="hero-heading"
			>
				<HeroBackdrop />
				<div className="relative mx-auto max-w-4xl">
					<h1
						id="hero-heading"
						className="font-display text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
					>
						{pageContent.solutions.hero.title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
						{pageContent.solutions.hero.subtitle}
					</p>

					<nav aria-label={dict.common.jumpToSolutionLabel} className="mt-10 flex flex-wrap gap-2">
						{solutions.map((solution) => (
							<a
								key={solution.slug}
								href={`#${solution.slug}`}
								className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/70 transition-colors hover:border-signal hover:text-signal"
							>
								{solution.title}
							</a>
						))}
					</nav>
				</div>
			</section>

			{/* Solutions — alternating spec-sheet bands */}
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

			<IndustriesGrid
				title={pageContent.solutions.industries.title}
				subtitle={pageContent.solutions.industries.subtitle}
			/>

			<CtaSection
				title={pageContent.solutions.finalCta.title}
				subtitle={pageContent.solutions.finalCta.subtitle}
				ctaText={dict.common.getInTouch}
				ctaHref={pageContent.solutions.finalCta.cta.href}
			/>

			<Footer />
		</div>
	);
};

export default Solutions;
