"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import TextType, { TYPING_SPEED, LEAD_DELAY, LINE_GAP } from "@/components/text-type";
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
	/**
	 * Type the heading out on scroll, the way the hero headline types on load.
	 * Home page only, and opt-in per call site: `IndustriesGrid` is shared with
	 * /solutions, which does not do this, so it must not be the default. The
	 * final CTA is deliberately left out — at 42 characters it typed for over
	 * four seconds, which is too slow for the thing meant to be acted on.
	 */
	type?: boolean;
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
	type = false,
	className,
}: AccentHeadingProps) => {
	const shouldReduceMotion = useReducedMotion();
	const [mounted, setMounted] = useState(false);
	const [started, setStarted] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => setMounted(true), []);

	/**
	 * The scroll trigger. Deliberately NOT `TextType`'s own `startOnVisible`:
	 * that one only starts once the element is actually on screen, which forces
	 * the heading to render empty until then — and `reveal.tsx` documents why
	 * that is wrong here (a viewport event that never fires, in a headless
	 * renderer, a hidden tab or a print, would ship the section with no heading
	 * at all). So the plain heading stays in the DOM until this fires, and the
	 * bottom `rootMargin` fires it while the heading is still below the fold, so
	 * the swap from plain text to typed text never happens on screen.
	 *
	 * 64px, and no more. It has to clear the heading's own height so the swap is
	 * off-screen, but the capabilities heading sits only `py-24` (96px) below a
	 * `min-h-svh` hero — at 200px it tripped on page load and had finished
	 * typing itself out before the reader ever scrolled down to it.
	 */
	useEffect(() => {
		if (!type || !ref.current) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setStarted(true);
				observer.disconnect();
			},
			{ rootMargin: "0px 0px 64px 0px" }
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [type]);

	// Plain text until mounted, so the server and the first client render always
	// agree — `useReducedMotion` resolves to null during SSR and swapping the
	// subtree on it desynchronises hydration. It also means the real heading is
	// in the HTML for crawlers and for no-JS. Same rule as the hero headline.
	const isTyping = type && mounted && started && !shouldReduceMotion;
	const full = accent ? `${title} ${accent}` : title;

	return (
		<div ref={ref} className={className}>
			<Tag
				id={id}
				// While typing, the element's text is a partial string, so the
				// accessible name comes from the label instead of the contents.
				aria-label={isTyping ? full : undefined}
				className={cn("font-display font-semibold text-foreground", sizes[Tag])}
			>
				{isTyping ? (
					<span aria-hidden="true" className="grid">
						{/* Reserve layer: the finished heading, invisible, sharing one grid
						    cell with the typed one. Without it the box grows a line at a
						    time as the text wraps and everything below the heading jumps. */}
						<span className="invisible [grid-area:1/1]">{full}</span>
						<span className="[grid-area:1/1]">
							<TextType
								as="span"
								text={title}
								typingSpeed={TYPING_SPEED}
								initialDelay={LEAD_DELAY}
								loop={false}
								showCursor={false}
							/>
							{accent ? (
								// Chained by delay, not by a callback: TextType only fires
								// `onSentenceComplete` on its delete transition, which never
								// happens with a single string and `loop={false}`. Derived from
								// the actual string so translations stay in sync.
								<TextType
									as="span"
									className="text-signal"
									text={` ${accent}`}
									typingSpeed={TYPING_SPEED}
									initialDelay={LEAD_DELAY + title.length * TYPING_SPEED + LINE_GAP}
									loop={false}
									showCursor={false}
								/>
							) : null}
						</span>
					</span>
				) : (
					<>
						{title}
						{accent ? <span className="text-signal">{` ${accent}`}</span> : null}
					</>
				)}
			</Tag>
			{rule ? (
				<div
					aria-hidden="true"
					className="mt-5 -ml-4 h-px w-32 bg-signal/70 sm:-ml-6 lg:-ml-8"
				/>
			) : null}
		</div>
	);
};

export default AccentHeading;
