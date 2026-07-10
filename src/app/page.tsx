"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { capabilities, processSteps, content } from "@/lib/sitemap";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { IndustriesGrid } from "@/components/industries-grid";
import { CtaSection } from "@/components/cta-section";
import { Button } from "@/components/ui/button";

const heroItem = {
	hidden: { opacity: 0, y: 24 },
	shown: { opacity: 1, y: 0 },
};

const Home = () => {
	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero */}
			<section
				className="dark relative flex min-h-[640px] items-center overflow-hidden bg-background px-4 pt-32 pb-24 sm:px-6 lg:px-8"
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
						Driven by Ideas
					</motion.h1>
					<motion.p
						className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
					>
						{content.hero.subtitle}
					</motion.p>
					<motion.div
						className="mt-10 flex flex-col gap-4 sm:flex-row"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
					>
						<Button asChild variant="signal" size="lg">
							<Link href={content.hero.ctaPrimary.href}>
								{content.hero.ctaPrimary.text}
								<ArrowRight size={18} aria-hidden="true" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href={content.hero.ctaSecondary.href}>{content.hero.ctaSecondary.text}</Link>
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
							{content.home.capabilities.title}
						</h2>
						<p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
							{content.home.capabilities.subtitle}
						</p>
					</Reveal>

					<div className="flex flex-col">
						{capabilities.map((capability, i) => (
							<Reveal key={capability.title} delay={i * 0.08}>
								<div className="flex items-start gap-6 border-t border-border py-8 first:border-t-0 lg:first:border-t">
									<capability.icon
										className="mt-1 size-7 shrink-0 text-signal"
										aria-hidden="true"
									/>
									<div>
										<h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-foreground">
											{capability.title}
										</h3>
										<p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">
											{capability.description}
										</p>
									</div>
								</div>
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
							{content.home.process.title}
						</h2>
						<p className="mt-4 text-lg leading-relaxed text-foreground/70">
							{content.home.process.subtitle}
						</p>
					</Reveal>

					<div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
						{processSteps.map((step, i) => (
							<Reveal key={step.step} delay={i * 0.08}>
								<div className="border-t border-border pt-6">
									<span className="font-mono text-sm text-signal">{step.step}</span>
									<h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.01em] text-foreground">
										{step.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-foreground/60">
										{step.description}
									</p>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			<IndustriesGrid
				title={content.home.industries.title}
				subtitle={content.home.industries.subtitle}
			/>

			<CtaSection
				title={content.home.finalCta.title}
				subtitle={content.home.finalCta.subtitle}
				ctaText={content.home.finalCta.cta.text}
				ctaHref={content.home.finalCta.cta.href}
			/>

			<Footer />
		</div>
	);
};

export default Home;
