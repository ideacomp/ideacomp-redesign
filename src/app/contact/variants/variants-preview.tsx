"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ContactFormSection, type ContactFormVariant } from "@/components/contact";
import { cn } from "@/lib/utils";

/**
 * Internal comparison page (noindex, not linked from navigation). Renders each
 * contact-form variant in place, in whichever locale the site cookie is set to,
 * so the choice can be made against the real thing rather than a mockup.
 */

const VARIANTS: { key: ContactFormVariant; name: string; note: string }[] = [
	{
		key: "datasheet",
		name: "A — Datasheet",
		note: "Light surface. Ruled spec-sheet lines, everything visible at once.",
	},
	{
		key: "staged",
		name: "B — Staged intake",
		note: "Dark surface. Three steps: scope, brief, you — with a filling track.",
	},
	{
		key: "payload",
		name: "C — Request payload",
		note: "Dark surface. The record that will be sent assembles as you type.",
	},
];

export function VariantsPreview() {
	const [active, setActive] = useState<ContactFormVariant>("payload");
	const current = VARIANTS.find((variant) => variant.key === active)!;

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="dark sticky top-16 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div
						role="group"
						aria-label="Contact form variant"
						className="flex flex-wrap gap-2"
					>
						{VARIANTS.map((variant) => (
							<button
								key={variant.key}
								type="button"
								onClick={() => setActive(variant.key)}
								aria-pressed={active === variant.key}
								className={cn(
									"rounded-md border px-3.5 py-2 text-sm transition-colors motion-safe:duration-200",
									"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
									active === variant.key
										? "border-signal bg-signal/10 text-foreground"
										: "border-border text-foreground/60 hover:border-foreground/40 hover:text-foreground"
								)}
							>
								{variant.name}
							</button>
						))}
					</div>
					<p className="max-w-md text-sm text-foreground/60">{current.note}</p>
				</div>
			</div>

			{/* Remounts on switch so each variant starts from a clean form state. */}
			<ContactFormSection key={active} variant={active} />

			<Footer />
		</div>
	);
}
