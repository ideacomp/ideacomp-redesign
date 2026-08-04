import { cn } from "@/lib/utils";

/**
 * Oversized display word bleeding off the bottom edge of a section.
 *
 * This carries the job that a small uppercase eyebrow label would normally do —
 * naming the section — at a scale where it reads as art direction instead of
 * chrome. PRODUCT.md lists "tiny uppercase eyebrows above every section" as an
 * anti-reference, so the label moves behind the content and grows instead.
 *
 * The parent section must be `relative overflow-hidden`, otherwise the word
 * escapes and pushes horizontal page scroll. It must also render its content in
 * a `relative` sibling that comes *after* this one in the DOM: that ordering is
 * what puts the word behind the text. A negative z-index cannot be used — a
 * section that paints its own `bg-background` establishes no stacking context of
 * its own, so `-z-10` drops the word behind that background and it disappears
 * entirely on every dark band.
 */
const SectionWatermark = ({ word, className }: { word: string; className?: string }) => (
	<span
		aria-hidden="true"
		className={cn(
			// Roughly the lower third of the cap height is clipped away by the
			// section edge. Sitting higher than this, the word starts crossing body
			// copy in short sections and costs legibility for no extra effect.
			"pointer-events-none absolute -bottom-[0.34em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap",
			"font-display text-[clamp(4rem,18vw,12rem)] leading-none font-semibold uppercase tracking-[0.12em]",
			// Near-black at low alpha on paper reads far weaker than near-white at
			// the same alpha on graphite, so the two surfaces need different values
			// to land at the same perceived weight.
			"text-foreground/[0.06] dark:text-foreground/[0.09]",
			className,
		)}
	>
		{word}
	</span>
);

export default SectionWatermark;
