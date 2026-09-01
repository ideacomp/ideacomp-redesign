"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AccentHeading from "@/components/accent-heading";
import PhotoCarousel from "@/components/photo-carousel";
import SectionWatermark from "@/components/section-watermark";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { content } from "@/lib/sitemap";

/**
 * Editorial band whose photo runs off the right edge of the viewport, adapted
 * from the reference template's `.image-left-side`.
 *
 * Two layouts rather than one: below `lg` the photo is a normal block in the
 * flow (an absolute element would have no height to fill and the section would
 * collapse); from `lg` up it is absolutely positioned from just right of centre
 * to the viewport edge, and the text column is capped so the two can never
 * overlap regardless of how long the translated copy runs.
 */
const FocusBand = () => {
	const { dict, locale } = useLocale();
	const focus = content[locale].home.focus;

	return (
		<section
			className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
			aria-labelledby="focus-heading"
		>
			<SectionWatermark word={focus.watermark} />

			<div className="relative mx-auto max-w-6xl">
				<Reveal className="lg:max-w-[46%]">
					<AccentHeading
						id="focus-heading"
						title={focus.title}
						accent={focus.accent}
						rule
						type
					/>
					<p className="mt-8 leading-relaxed text-muted-foreground">{focus.body}</p>
					<p className="mt-4 font-medium text-foreground">{focus.bodyStrong}</p>
					<Button asChild variant="outline" size="lg" className="mt-8">
						<Link href={focus.cta.href}>
							{dict.common.meetTheTeam}
							<ArrowRight size={18} aria-hidden="true" />
						</Link>
					</Button>
				</Reveal>

				<Reveal
					className="mt-12 lg:absolute lg:top-0 lg:right-[calc(50%-50vw)] lg:left-[calc(50%+3rem)] lg:mt-0 lg:h-full"
					delay={0.1}
				>
					<PhotoCarousel
						slides={focus.slides}
						label={focus.slidesLabel}
						sizes="(min-width: 1024px) 52vw, 100vw"
						// `aspect-auto` from lg up is load-bearing: with a definite height
						// from `h-full`, an aspect ratio would derive the width from it and
						// the band would stop short of the viewport edge instead of
						// filling the absolute box.
						className="aspect-[3/2] lg:aspect-auto lg:h-full lg:w-full lg:rounded-r-none"
					/>
				</Reveal>
			</div>
		</section>
	);
};

export default FocusBand;
