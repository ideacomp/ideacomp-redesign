import { cn } from "@/lib/utils";

/**
 * Oversized display word set behind a section's content.
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

/**
 * Named placements, x and y together, measured against the page's content rail
 * rather than the viewport.
 *
 * Centring parks the word under the middle of the content column in every
 * section, which is both the busiest place on the page and the most repetitive.
 * Hanging it off the viewport edge is the other obvious move and is worse: on a
 * wide screen it strands the word out in the empty margin, hundreds of px from
 * anything it labels. So x is measured from the rail — which is capped at
 * `max-w-6xl` while the type clamps at 8rem — and the whole composition is
 * therefore identical relative to the content from ~1080px up, whether the
 * screen is 1280, 1440, 2560 or 3840.
 *
 * The reference (templatemonster 52524, `.decor-text`) works the same way: a
 * fixed 200px word, `bottom: 0`, offset per section against the content, and in
 * two of its four cases running *behind* a block — its "ABOUT" is half-hidden by
 * the photo in front of it and re-emerges to the right. That partial occlusion
 * is the effect worth having; a word sitting in clear space below everything is
 * just a caption in a large size.
 *
 * No two neighbouring sections share a placement — identical placement is what
 * makes a run of them read as one repeated template part.
 */
const PLACEMENT = {
	/**
	 * On the rail, hanging off the section's bottom edge. Roughly the lower third
	 * of the cap height is clipped away by that edge; sitting higher than this,
	 * the word starts crossing body copy in short sections and costs legibility.
	 */
	rail: "left-0 -bottom-[0.34em]",
	/**
	 * A tenth of the rail in, still hanging off the bottom edge but only just.
	 * These two are the sections where nothing else covers the word, so the crop
	 * is the whole effect and it has to stay — clearing the edge entirely
	 * (`bottom: 0`, the reference's own value) was tried and reads as a caption in
	 * a large size. `0.24em` shaves roughly a tenth off the bottom of the cap
	 * against `rail`'s quarter.
	 */
	inset: "left-[10%] -bottom-[0.24em]",
	/** Same, ending on the rail's right edge. */
	right: "right-0 -bottom-[0.24em]",
	/**
	 * Pushed out past the rail into the section's left margin — but only from
	 * `lg`, because that margin is what the word is being pushed into. On a phone
	 * the rail *is* the screen (a 16px gutter), so the same offset buys no margin
	 * and just eats the first two letters; there it sits a hair off the rail
	 * instead, which keeps the word readable.
	 */
	margin: "-left-[0.35em] lg:-left-[1.2em] -bottom-[0.34em]",
	/**
	 * Out into the margin and lifted off the bottom edge into the body of the
	 * section, level with the last row of cards, so it crosses behind them and the
	 * last letter is cut by the card column — that crop is the point of this one.
	 *
	 * From `lg`, i.e. from wherever the grid actually has two columns. Below that
	 * it collapses to one, the cards run full width, and a lifted word would be
	 * hidden behind them entirely, so it drops back to the bottom edge.
	 *
	 * Between `lg` and `xl` the card column starts ~100px further left, which is
	 * why the size below carries an `lg:` step: at the full 6.875rem the word
	 * would overshoot it and lose the whole tail instead of a quarter of one
	 * letter. The two rules are a pair — changing one without the other breaks the
	 * crop.
	 */
	cards: "-left-[0.35em] lg:-left-[1.2em] -bottom-[0.34em] lg:bottom-[0.95em]",
} as const;

const SectionWatermark = ({
	word,
	placement = "rail",
	className,
}: {
	word: string;
	placement?: keyof typeof PLACEMENT;
	className?: string;
}) => (
	// Two wrappers, so the word can be positioned against the content rail while
	// still being free to overrun it: the outer box repeats the section's own
	// horizontal padding, the inner one is the rail itself, and the word is
	// absolutely placed against that but clipped only by the section.
	<div
		aria-hidden="true"
		className="pointer-events-none absolute inset-0 select-none px-4 sm:px-6 lg:px-8"
	>
		<div className="relative mx-auto h-full max-w-6xl">
			<span
				className={cn(
					"absolute whitespace-nowrap",
					PLACEMENT[placement],
					// Much smaller than the reference's 200px, and not a free choice: the
					// word is set half out of frame, so the size is whatever makes the
					// longest of them ("DISCIPLINES") span exactly from the left edge to a
					// quarter-covered final S. That is a ~14-point swing per 2px of type,
					// so both stops below are measured, not picked: 6.875rem once the rail
					// is capped, and 8.2vw between `lg` and `xl`, where the card column
					// sits ~100px further left and a fixed size would bury the tail.
					// The cap is a CSS `min()`, not a second breakpoint variant: an
					// arbitrary `min-[1216px]:` loses the cascade to `lg:` in Tailwind v4
					// (it sorts before the named breakpoints), which silently let the word
					// grow to 347px on a 4K screen.
					"font-display text-[clamp(3rem,12vw,6.875rem)] lg:text-[min(9.03vw,6.875rem)] leading-none font-semibold uppercase tracking-[0.12em]",
					// Near-black at low alpha on paper reads far weaker than near-white
					// at the same alpha on graphite, so the two surfaces need different
					// values to land at the same perceived weight. Both sit a third below
					// where they started: off the bottom edge the word crosses real
					// content, so it has to give way to whatever is printed on top of it.
					"text-foreground/[0.04] dark:text-foreground/[0.06]",
					className,
				)}
			>
				{word}
			</span>
		</div>
	</div>
);

export default SectionWatermark;
