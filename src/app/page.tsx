"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { capabilities, processSteps, content } from "@/lib/sitemap";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import TextType from "@/components/text-type";
import AccentHeading from "@/components/accent-heading";
import FocusBand from "@/components/focus-band";
import ScrollCue from "@/components/scroll-cue";
import SectionWatermark from "@/components/section-watermark";
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

/** ms per character, shared by both headline lines so the two read as one pass. */
const TYPING_SPEED = 95;
/** ms before the first character of the first line appears. */
const LEAD_DELAY = 200;
/** Beat between the two lines, and the slack that absorbs per-character overhead. */
const LINE_GAP = 140;

const Home = () => {
	const { dict, locale } = useLocale();
	const shouldReduceMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	const pageContent = content[locale];

	useEffect(() => setMounted(true), []);

	const isTyping = mounted && !shouldReduceMotion;
	// The two lines are separate TextType instances, so line two is chained by
	// delay rather than by a callback: TextType only fires `onSentenceComplete`
	// on its delete transition, which never happens with a single string and
	// `loop={false}`. Derived from the actual string so translations stay in sync.
	const mainDelay =
		LEAD_DELAY + pageContent.hero.titleLead.length * TYPING_SPEED + LINE_GAP;

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero */}
			<section
				className="dark relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-background px-4 pt-32 pb-16 sm:px-6 lg:px-8"
				aria-labelledby="hero-heading"
			>
				<HeroBackdrop />

				<div className="relative mx-auto w-full max-w-6xl">
					<motion.div
						className="flex items-center gap-4"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
					>
						<span className="h-px w-16 bg-signal sm:w-24" aria-hidden="true" />
						<span className="font-mono text-xs tracking-[0.15em] uppercase text-foreground/60">
							{pageContent.hero.tagline}
						</span>
					</motion.div>

					{/* Two-line stack with a deliberate jump in scale and weight. Both
					    lines type, in sequence, so the whole headline reads as one
					    machine writing it out. */}
					<motion.h1
						id="hero-heading"
						className="mt-8 font-display text-foreground"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
					>
						{/* Plain text until mounted, so the server and the first client
						    render always agree — `useReducedMotion` resolves to null during
						    SSR, and swapping the subtree on it desynchronises hydration. It
						    also means the real headline is in the HTML for crawlers and
						    no-JS. */}
						<span className="block min-h-[1em] text-[clamp(1.75rem,4.5vw,3rem)] leading-[1] font-light tracking-[-0.01em] text-foreground/60">
							{isTyping ? (
								<TextType
									as="span"
									text={pageContent.hero.titleLead}
									typingSpeed={TYPING_SPEED}
									initialDelay={LEAD_DELAY}
									loop={false}
									showCursor={false}
								/>
							) : (
								pageContent.hero.titleLead
							)}
						</span>
						<span className="mt-1 block text-[clamp(4rem,13vw,8.5rem)] leading-[0.9] font-semibold tracking-[-0.035em]">
							{isTyping ? (
								<TextType
									as="span"
									text={pageContent.hero.titleMain}
									typingSpeed={TYPING_SPEED}
									initialDelay={mainDelay}
									loop={false}
									// No caret: it renders between the word and the accented
									// period, so at rest — which is how the headline is
									// actually read — it splits the two. The period carries
									// the terminal mark instead.
									showCursor={false}
								/>
							) : (
								pageContent.hero.titleMain
							)}
							<span className="text-signal">.</span>
						</span>
					</motion.h1>

					<motion.p
						className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
					>
						{pageContent.hero.subtitle}
					</motion.p>

					<motion.div
						className="mt-10 flex flex-col gap-4 sm:flex-row"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
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

					{/* Hairline datasheet row. Real facts, deliberately not dressed up as
					    a proof band — there are no client numbers worth claiming yet. */}
					<motion.dl
						className="mt-14 flex max-w-2xl flex-wrap gap-x-12 gap-y-6"
						initial="hidden"
						animate="shown"
						variants={heroItem}
						transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
					>
						{pageContent.hero.specs.map((spec) => (
							<div key={spec.label} className="border-t border-border pt-3">
								<dt className="font-mono text-[0.6875rem] tracking-[0.15em] uppercase text-foreground/50">
									{spec.label}
								</dt>
								<dd className="mt-1.5 font-display text-xl font-semibold text-foreground">
									{spec.value}
								</dd>
							</div>
						))}
					</motion.dl>
				</div>

				<div className="relative mx-auto mt-16 w-full max-w-6xl">
					<ScrollCue href="#capabilities" />
				</div>
			</section>

			{/* Capabilities */}
			<section
				id="capabilities"
				className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
				aria-labelledby="capabilities-heading"
			>
				<SectionWatermark word={pageContent.home.capabilities.watermark} />

				<div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
					<Reveal>
						<AccentHeading
							id="capabilities-heading"
							title={pageContent.home.capabilities.title}
							accent={pageContent.home.capabilities.accent}
							rule
						/>
						<p className="mt-8 max-w-sm text-base leading-relaxed text-muted-foreground">
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

			<FocusBand />

			{/* How We Work — the one earned numbered sequence */}
			<section
				className="dark relative overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8"
				aria-labelledby="process-heading"
			>
				<SectionWatermark word={pageContent.home.process.watermark} />

				<div className="relative mx-auto max-w-6xl">
					<Reveal className="max-w-2xl">
						<AccentHeading
							id="process-heading"
							title={pageContent.home.process.title}
							accent={pageContent.home.process.accent}
							rule
						/>
						<p className="mt-8 text-lg leading-relaxed text-foreground/70">
							{pageContent.home.process.subtitle}
						</p>
					</Reveal>

					<ProcessTimeline steps={processSteps[locale]} />
				</div>
			</section>

			<IndustriesGrid
				title={pageContent.home.industries.title}
				accent={pageContent.home.industries.accent}
				subtitle={pageContent.home.industries.subtitle}
				watermark={pageContent.home.industries.watermark}
			/>

			<CtaSection
				title={pageContent.home.finalCta.title}
				accent={pageContent.home.finalCta.accent}
				subtitle={pageContent.home.finalCta.subtitle}
				ctaText={dict.common.startConversation}
				ctaHref={pageContent.home.finalCta.cta.href}
			/>

			<Footer />
		</div>
	);
};

export default Home;
