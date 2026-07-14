"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { solutionsData, content } from "@/lib/sitemap";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { IndustriesGrid } from "@/components/industries-grid";
import { CtaSection } from "@/components/cta-section";
import { useLocale } from "@/lib/i18n/locale-context";

const Solutions = () => {
	const { dict } = useLocale();

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
						{content.solutions.hero.title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
						{content.solutions.hero.subtitle}
					</p>

					<nav aria-label="Jump to a solution" className="mt-10 flex flex-wrap gap-2">
						{solutionsData.map((solution) => (
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
			{solutionsData.map((solution, index) => {
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
								<div className="group relative isolate aspect-[4/3] overflow-hidden rounded-lg border border-border transition-colors motion-safe:duration-300 hover:border-signal/40">
									<Image
										src={solution.image.src}
										alt={solution.image.alt}
										fill
										sizes="(min-width: 1024px) 50vw, 100vw"
										className="object-cover grayscale-[0.25] contrast-110 transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-signal/20 mix-blend-color" aria-hidden="true" />
								</div>
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
				title={content.solutions.industries.title}
				subtitle={content.solutions.industries.subtitle}
			/>

			<CtaSection
				title={content.solutions.finalCta.title}
				subtitle={content.solutions.finalCta.subtitle}
				ctaText={dict.common.getInTouch}
				ctaHref={content.solutions.finalCta.cta.href}
			/>

			<Footer />
		</div>
	);
};

export default Solutions;
