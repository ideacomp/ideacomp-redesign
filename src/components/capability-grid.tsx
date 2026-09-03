"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { solutionsData } from "@/lib/sitemap";
import AccentHeading from "@/components/accent-heading";
import SectionWatermark from "@/components/section-watermark";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Card shell. The border stays `border-border` in every state — the traced
 * outline below is the whole hover event, and fading the underlying border to
 * signal at the same time just muddies the line as it travels.
 *
 * The lift is a whole-pixel `-translate-y-0.5`, never a fractional scale — same
 * rule as `ui/button.tsx`, for the same reason (scaling re-rasterises the text).
 * No coloured drop shadow either; nothing else on this site glows.
 */
const CARD = [
	"group relative flex h-full flex-col rounded-xl border border-border bg-card p-6",
	"transition-[color,transform] motion-safe:duration-300",
	"motion-safe:hover:-translate-y-0.5",
	"focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
].join(" ");

/**
 * The stroke that draws itself around the card on hover.
 *
 * `pathLength={100}` renormalises the rect's perimeter to 100 user units, so a
 * single dash of 100 with an offset of 100 is "hidden" and an offset of 0 is
 * "fully drawn" — no measuring, and it stays correct at every card width. A
 * rounded <rect> path starts just past the top-left corner and runs clockwise,
 * so the line still leaves from the top-left the way the reference's bar did,
 * then carries on down the right edge, back along the bottom and up the left.
 *
 * Geometry: the rect is inset 1px so a 2px stroke sits centred over the card's
 * own 1px border. `rx` is therefore 9, not 10 — one less than the card's
 * `rounded-xl`, so the traced curve stays concentric with the corner it covers.
 *
 * Easing is the reference template's own `cubic-bezier(.4,0,.2,1)` rather than
 * the site's expo-out: over a full perimeter, expo-out spends its first fifth
 * covering three-quarters of the trip and then appears to stall on the last edge.
 */
const TRACE = [
	"[width:calc(100%-2px)] [height:calc(100%-2px)]",
	"[stroke-dasharray:100] [stroke-dashoffset:100]",
	"transition-[stroke-dashoffset] ease-[cubic-bezier(0.4,0,0.2,1)] motion-safe:duration-700",
	"group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]",
].join(" ");

/**
 * The six disciplines as cards, with the top edge filling in on hover.
 *
 * The hover device comes from the client's reference template, where a 4px
 * gradient bar wipes across the card top (`transform: scaleX(0 → 1)`,
 * `transform-origin: left`) while the icon tile flips to a filled gradient with
 * a white glyph. Reproduced here as mechanics only: the bar is 2px because this
 * site is built out of hairlines, it is solid `signal` because gradients are an
 * anti-reference, and the easing is the site's shared expo-out rather than the
 * template's plain `ease`. The reference's oversized ghost `01`/`02` numerals
 * are deliberately NOT carried over — numbering is reserved for the delivery
 * process (see PRODUCT.md) — so that slot holds the arrow affordance instead.
 *
 * Reads `solutionsData` directly so the home page and /solutions can never drift
 * apart again; the short `description` field exists in both locales for exactly
 * this kind of overview and is rendered nowhere else.
 */
export function CapabilityGrid({
	title,
	subtitle,
	/** Trailing words of the heading, rendered in signal. */
	accent,
	/** Oversized background word. */
	watermark,
}: {
	title: string;
	subtitle: string;
	accent?: string;
	watermark?: string;
}) {
	const { locale } = useLocale();

	return (
		// `id`/`scroll-mt-20` are load-bearing: the hero's <ScrollCue> targets them.
		<section
			id="capabilities"
			className="relative scroll-mt-20 overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
			aria-labelledby="capabilities-heading"
		>
			{/* Lifted level with the last card row and pushed out into the margin:
			    the left column is empty below its subtitle, so the word reads there
			    and then runs behind the cards. */}
			{watermark ? <SectionWatermark word={watermark} placement="cards" /> : null}

			<div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
				<Reveal>
					<AccentHeading
						id="capabilities-heading"
						title={title}
						accent={accent}
						rule
						type
					/>
					<p className="mt-8 max-w-sm text-base leading-relaxed text-muted-foreground">
						{subtitle}
					</p>
				</Reveal>

				<div className="grid gap-4 sm:grid-cols-2" role="list">
					{solutionsData[locale].map((solution, i) => (
						// `h-full` on both the Reveal wrapper and the card: Reveal renders a
						// motion.div between the grid and the link, and without it that
						// wrapper shrink-wraps and the cards in a row stop matching height.
						<Reveal key={solution.slug} delay={i * 0.06} className="h-full">
							<Link
								href={`/solutions#${solution.slug}`}
								role="listitem"
								className={CARD}
							>
								<svg
									aria-hidden="true"
									className="pointer-events-none absolute inset-0 size-full text-signal"
								>
									<rect
										x="1"
										y="1"
										rx="9"
										ry="9"
										pathLength={100}
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										className={TRACE}
									/>
								</svg>

								<div className="flex items-start justify-between">
									{/* Plate radius is one step down from the card's, so a 44px
									    square reads as roughly as round as the card around it
									    rather than turning into a pastel squircle. */}
									<span className="flex size-11 items-center justify-center rounded-lg border border-border text-signal transition-colors motion-safe:duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-signal-foreground group-focus-visible:border-signal group-focus-visible:bg-signal group-focus-visible:text-signal-foreground">
										<solution.icon className="size-5" aria-hidden="true" />
									</span>
									<ArrowUpRight
										size={16}
										aria-hidden="true"
										className="shrink-0 text-muted-foreground transition-[color,transform] motion-safe:duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-signal"
									/>
								</div>

								{/* `.eyebrow-heading` — the same treatment these titles carried
								    as rows, kept deliberately. It is a named brand device here
								    (see the rule's docblock in globals.css: Poppins 400 at 14px,
								    confirmed with the client), not a section eyebrow, so the
								    caps and the 0.16em tracking are what mark these as titles. */}
								<h3 className="eyebrow-heading mt-4 text-foreground transition-colors motion-safe:duration-300 group-hover:text-signal group-focus-visible:text-signal">
									{solution.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{solution.description}
								</p>
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
