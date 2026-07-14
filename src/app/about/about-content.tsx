"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { CtaSection } from "@/components/cta-section";
import { AnimatedCounter } from "@/components/animated-counter";
import { content, certifications, caseStudies, industries, solutionsData } from "@/lib/sitemap";
import { useLocale } from "@/lib/i18n/locale-context";

const AboutContent = () => {
	const { dict, locale } = useLocale();
	const pageContent = content[locale];
	const industryList = industries[locale];
	const studies = caseStudies[locale];

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero */}
			<section
				className="dark relative flex min-h-[380px] items-center overflow-hidden bg-background px-4 pt-32 pb-16 sm:px-6 lg:px-8"
				aria-labelledby="hero-heading"
			>
				<HeroBackdrop />
				<div className="relative mx-auto max-w-4xl">
					<h1
						id="hero-heading"
						className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
					>
						{pageContent.about.hero.title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
						{pageContent.about.hero.subtitle}
					</p>
				</div>
			</section>

			{/* The Team */}
			<section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="team-heading">
				<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
					<Reveal>
						<h2 id="team-heading" className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
							{pageContent.about.team.title}
						</h2>
						<p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
							{pageContent.about.team.body}
						</p>
					</Reveal>

					<Reveal delay={0.08}>
						<dl className="grid grid-cols-2 gap-x-8 gap-y-8">
							<div className="border-t border-border pt-4">
								<dt className="text-sm text-muted-foreground">{dict.about.founded}</dt>
								<dd className="mt-1 font-display text-4xl font-semibold text-foreground">2024</dd>
							</div>
							<div className="border-t border-border pt-4">
								<dt className="text-sm text-muted-foreground">{dict.about.teamSize}</dt>
								<dd className="mt-1 font-display text-4xl font-semibold text-foreground">2&ndash;10</dd>
							</div>
							<div className="border-t border-border pt-4">
								<dt className="text-sm text-muted-foreground">{dict.about.disciplines}</dt>
								<dd className="mt-1 font-display text-4xl font-semibold text-foreground">
									<AnimatedCounter value={solutionsData[locale].length} />
								</dd>
							</div>
							<div className="border-t border-border pt-4">
								<dt className="text-sm text-muted-foreground">{dict.about.industriesServed}</dt>
								<dd className="mt-1 font-display text-4xl font-semibold text-foreground">
									<AnimatedCounter value={industryList.length} />
								</dd>
							</div>
						</dl>
					</Reveal>
				</div>
			</section>

			{/* Security & Compliance */}
			<section className="dark bg-background px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="compliance-heading">
				<div className="mx-auto max-w-3xl">
					<Reveal>
						<h2 id="compliance-heading" className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
							{pageContent.about.compliance.title}
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-foreground/70">
							{pageContent.about.compliance.body}
						</p>
						<p className="mt-4 text-sm leading-relaxed text-foreground/50">
							{pageContent.about.compliance.certificationsNote}
						</p>

						{certifications.length > 0 && (
							<ul className="mt-8 flex flex-wrap gap-6">
								{certifications.map((cert) => (
									<li key={cert.name} className="border-t border-border pt-3 text-sm text-foreground/70">
										<span className="font-medium text-foreground">{cert.name}</span> &middot; {cert.issuer} ({cert.year})
									</li>
								))}
							</ul>
						)}
					</Reveal>
				</div>
			</section>

			{/* Case studies */}
			<section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="case-studies-heading">
				<div className="mx-auto max-w-6xl">
					<Reveal className="max-w-2xl">
						<h2 id="case-studies-heading" className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
							{pageContent.about.caseStudies.title}
						</h2>
						<p className="mt-4 text-lg leading-relaxed text-muted-foreground">
							{pageContent.about.caseStudies.subtitle}
						</p>
					</Reveal>

					<div
						className="mt-12 grid gap-x-8 gap-y-10"
						style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
					>
						{studies.map((cs, i) => {
							const industryIcon = industryList.find((ind) => ind.name === cs.industry)?.icon;
							const Icon = industryIcon;
							return (
								<Reveal key={cs.title} delay={i * 0.06}>
									<div className="border-t border-border pt-5">
										<div className="flex items-center gap-2">
											{Icon && <Icon className="size-4 text-signal" aria-hidden="true" />}
											<span className="font-mono text-xs uppercase tracking-wide text-signal">
												{cs.industry}
											</span>
										</div>
										<h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.01em] text-foreground">
											{cs.title}
										</h3>
										<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
											<span className="font-medium text-foreground/80">{dict.about.challenge}</span>
											{cs.challenge}
										</p>
										<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
											<span className="font-medium text-foreground/80">{dict.about.approach}</span>
											{cs.approach}
										</p>
										<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
											<span className="font-medium text-foreground/80">{dict.about.outcome}</span>
											{cs.outcome}
										</p>
									</div>
								</Reveal>
							);
						})}
					</div>
				</div>
			</section>

			<CtaSection
				title={pageContent.home.finalCta.title}
				subtitle={pageContent.home.finalCta.subtitle}
				ctaHref={pageContent.home.finalCta.cta.href}
			/>

			<Footer />
		</div>
	);
};

export default AboutContent;
