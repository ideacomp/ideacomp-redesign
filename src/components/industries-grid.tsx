import { industries } from "@/lib/sitemap";
import { Reveal } from "@/components/reveal";

export function IndustriesGrid({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="industries-heading">
			<div className="mx-auto max-w-6xl">
				<Reveal className="max-w-2xl">
					<h2
						id="industries-heading"
						className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl"
					>
						{title}
					</h2>
					<p className="mt-4 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
				</Reveal>

				<div
					className="mt-12 grid gap-x-8 gap-y-10"
					style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
					role="list"
				>
					{industries.map((industry, i) => (
						<Reveal key={industry.name} delay={i * 0.05}>
							<div role="listitem" className="border-t border-border pt-5">
								<industry.icon className="size-6 text-signal" aria-hidden="true" />
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
