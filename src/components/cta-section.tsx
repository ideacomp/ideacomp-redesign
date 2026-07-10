import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection({
	title,
	subtitle,
	ctaText,
	ctaHref,
}: {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaHref: string;
}) {
	return (
		<section className="dark bg-background px-4 py-28 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
			<Reveal className="mx-auto max-w-3xl text-center">
				<h2 id="cta-heading" className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
					{title}
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground/70">{subtitle}</p>
				<div className="mt-10 flex justify-center">
					<Button asChild variant="signal" size="lg">
						<Link href={ctaHref}>
							{ctaText}
							<ArrowRight size={18} aria-hidden="true" />
						</Link>
					</Button>
				</div>
			</Reveal>
		</section>
	);
}
