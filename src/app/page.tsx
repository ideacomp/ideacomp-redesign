"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { capabilities, processSteps, content } from "@/lib/sitemap";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import TextType from "@/components/text-type";
import { Reveal } from "@/components/reveal";
import { IndustriesGrid } from "@/components/industries-grid";
import { CtaSection } from "@/components/cta-section";
import { ProcessTimeline } from "@/components/process-timeline";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";

const heroItem = {
	hidden: { opacity: 0, y: 24 },
	shown: { opacity: 1, y: 0 },
};

const Home = () => {
	const { dict, locale } = useLocale();
	const shouldReduceMotion = useReducedMotion();
	const pageContent = content[locale];

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero */}
			<section
				className="dark relative flex min-h-[85vh] items-center overflow-hidden bg-background px-4 pt-32 pb-24 sm:px-6 lg:px-8"
				aria-labelledby="hero-heading"
			>
				<HeroBackdrop />
				<div className="relative mx-auto max-w-4xl">
					<motion.h1
						id="hero-heading"
						className="font-display text-[clamp(3rem,10vw,6rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
					>
						{shouldReduceMotion ? (
							pageContent.hero.title
						) : (
							<TextType
								as="span"
								text={pageContent.hero.title}
								typingSpeed={80}
								initialDelay={400}
								loop={false}
								showCursor
								cursorCharacter="|"
							/>
						)}
					</motion.h1>
					<motion.p
						className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
					>
						{pageContent.hero.subtitle}
					</motion.p>
					<motion.div
						className="mt-10 flex flex-col gap-4 sm:flex-row"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
					>
						<Button asChild variant="signal" size="lg">
							<Link href={pageContent.hero.ctaPrimary.href}>
								{dict.common.seeOurSolutions}
								<ArrowRight size={18} aria-hidden="true" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href={pageContent.hero.ctaSecondary.href}>{dict.common.getInTouch}</Link>
						</Button>
					</motion.div>
				</div>
			</section>

			{/* Capabilities */}
			<section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="capabilities-heading">
				<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
					<Reveal>
						<h2
							id="capabilities-heading"
							className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl"
						>
							{pageContent.home.capabilities.title}
						</h2>
						<p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
							{pageContent.home.capabilities.subtitle}
						</p>
					</Reveal>

					<div className="flex flex-col">
						{capabilities[locale].map((capability, i) => (
							<Reveal key={capability.title} delay={i * 0.08}>
								<Link
									href={`/solutions#${capability.slug}`}
									className="group flex items-start gap-6 border-t border-border py-8 transition-colors first:border-t-0 hover:border-signal/40 lg:first:border-t"
								>
									<capability.icon
										className="mt-1 size-7 shrink-0 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
										aria-hidden="true"
									/>
									<div>
										<h3 className="flex items-center gap-2 font-display text-xl font-semibold tracking-[-0.01em] text-foreground transition-colors motion-safe:duration-300 group-hover:text-signal">
											{capability.title}
											<ArrowRight
												size={16}
												className="shrink-0 transition-transform motion-safe:duration-300 group-hover:translate-x-1"
												aria-hidden="true"
											/>
										</h3>
										<p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
											{capability.description}
										</p>
									</div>
								</Link>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* How We Work — the one earned numbered sequence */}
			<section className="dark bg-background px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="process-heading">
				<div className="mx-auto max-w-6xl">
					<Reveal className="max-w-2xl">
						<h2 id="process-heading" className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
							{pageContent.home.process.title}
						</h2>
						<p className="mt-4 text-lg leading-relaxed text-foreground/70">
							{pageContent.home.process.subtitle}
						</p>
					</Reveal>

					<ProcessTimeline steps={processSteps[locale]} />
				</div>
			</section>

			<IndustriesGrid
				title={pageContent.home.industries.title}
				subtitle={pageContent.home.industries.subtitle}
			/>

			<CtaSection
				title={pageContent.home.finalCta.title}
				subtitle={pageContent.home.finalCta.subtitle}
				ctaText={dict.common.startConversation}
				ctaHref={pageContent.home.finalCta.cta.href}
			/>

			<Footer />
		</div>
	);
};

export default Home;
