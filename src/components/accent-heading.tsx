import { cn } from "@/lib/utils";

interface AccentHeadingProps {
	/** Leading part of the heading, rendered in the normal foreground colour. */
	title: string;
	/** Trailing 1–2 words, rendered in signal. Kept as a separate content field
	 *  because the word that should carry the accent differs per language. */
	accent?: string;
	id?: string;
	as?: "h1" | "h2" | "h3";
	/** Short signal rule under the heading that bleeds into the left margin. */
	rule?: boolean;
	className?: string;
}

const sizes = {
	h1: "text-[clamp(2.75rem,8vw,5rem)] tracking-[-0.03em]",
	h2: "text-4xl tracking-[-0.02em] sm:text-5xl",
	h3: "text-xl tracking-[-0.01em]",
} as const;

/**
 * Section heading with the trailing words in signal, plus an optional rule that
 * extends past the text column into the gutter. Both devices come from the
 * reference template; here they reuse the existing hairline vocabulary rather
 * than its 3px primary-coloured bars.
 */
const AccentHeading = ({
	title,
	accent,
	id,
	as: Tag = "h2",
	rule = false,
	className,
}: AccentHeadingProps) => (
	<div className={className}>
		<Tag
			id={id}
			className={cn("font-display font-semibold text-foreground", sizes[Tag])}
		>
			{title}
			{accent ? <span className="text-signal">{` ${accent}`}</span> : null}
		</Tag>
		{rule ? (
			<div
				aria-hidden="true"
				className="mt-5 -ml-4 h-px w-32 bg-signal/70 sm:-ml-6 lg:-ml-8"
			/>
		) : null}
	</div>
);

export default AccentHeading;
