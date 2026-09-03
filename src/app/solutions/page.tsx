"use client";

import { solutionsData, content } from "@/lib/sitemap";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import SolutionsOrbit from "@/components/solutions-orbit";
import { IndustriesGrid } from "@/components/industries-grid";
import { CtaSection } from "@/components/cta-section";
import { useLocale } from "@/lib/i18n/locale-context";

const Solutions = () => {
	const { dict, locale } = useLocale();
	const pageContent = content[locale];
	const solutions = solutionsData[locale];

	return (
		<div className="min-h-screen bg-background">
			<Header overlay />

			{/* Hero */}
			<section
				className="dark surface-signal relative flex min-h-[420px] items-center overflow-hidden bg-background px-4 pt-32 pb-16 sm:px-6 lg:px-8"
				aria-labelledby="hero-heading"
			>
				<HeroBackdrop variant="band" />
				{/* `w-full max-w-6xl`, matching the home hero and every section below —
				    not a shrink-to-fit `max-w-4xl`. A column that sizes to its content
				    and then centres itself lands wherever the longest line happens to
				    end (672px wide, so 27–83% of the viewport depending on width), and
				    `.surface-signal` grades the field against one fixed copy edge. It
				    also means the banner heading now sits on the same left margin as
				    the page it introduces. */}
				<div className="relative mx-auto w-full max-w-6xl">
					<h1
						id="hero-heading"
						className="max-w-2xl font-display text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
					>
						{pageContent.solutions.hero.title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
						{pageContent.solutions.hero.subtitle}
					</p>

					{/* Held to the paragraph's `max-w-2xl`, not left to fill the container:
					    these are 14px at 70% ink, so they answer to the same 4.5:1 the
					    paragraph does and belong inside the same protected column that
					    `--field-hold` is graded for. Costs a row of wrapping. */}
					<nav
						aria-label={dict.common.jumpToSolutionLabel}
						className="mt-10 flex max-w-2xl flex-wrap gap-2"
					>
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

			{/* One scene on desktop — the active service unfolded beside its panel
			    image, the other five orbiting it. Falls back to the alternating
			    spec-sheet bands below `lg` and under reduced motion; see the
			    component for why the fallback is a different layout rather than a
			    slower version of the same one. */}
			<SolutionsOrbit solutions={solutions} />

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
