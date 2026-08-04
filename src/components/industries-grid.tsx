import { industries } from "@/lib/sitemap";
import AccentHeading from "@/components/accent-heading";
import SectionWatermark from "@/components/section-watermark";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/lib/i18n/locale-context";

export function IndustriesGrid({
	title,
	subtitle,
	/** Trailing words of the heading, rendered in signal. */
	accent,
	/** Oversized background word. Omitted on pages that already have one nearby. */
	watermark,
}: {
	title: string;
	subtitle: string;
	accent?: string;
	watermark?: string;
}) {
	const { locale } = useLocale();
	return (
		<section
			className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
			aria-labelledby="industries-heading"
		>
			{watermark ? <SectionWatermark word={watermark} /> : null}

			<div className="relative mx-auto max-w-6xl">
				<Reveal className="max-w-2xl">
					<AccentHeading id="industries-heading" title={title} accent={accent} rule />
					<p className="mt-8 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
				</Reveal>

				<div
					className="mt-12 grid gap-x-8 gap-y-10"
					style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
					role="list"
				>
					{industries[locale].map((industry, i) => (
						<Reveal key={industry.name} delay={i * 0.05}>
							<div role="listitem" className="group border-t border-border pt-5">
								<industry.icon
									className="size-6 text-signal transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
									aria-hidden="true"
								/>
								<h3 className="mt-3 font-semibold text-foreground">{industry.name}</h3>
								<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
									{industry.description}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
