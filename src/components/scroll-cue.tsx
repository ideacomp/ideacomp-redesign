"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Circular "keep reading" affordance at the bottom of the hero, lifted from the
 * reference template's `.button-way-point`. Native anchor, so keyboard and
 * middle-click behave; the smooth scroll comes from the target's `scroll-mt`
 * plus the browser default, not from JS.
 *
 * The idle drift is a slow expo-eased glide, not a springy hop: elastic easing
 * reads as playful, which is the wrong register here, and this curve is the one
 * every other animation on the page already uses. Reduced motion is handled
 * globally by `<MotionConfig reducedMotion="user">`.
 */
const ScrollCue = ({ href }: { href: string }) => {
	const { dict } = useLocale();

	return (
		<a
			href={href}
			aria-label={dict.common.scrollToContent}
			className="group flex size-14 items-center justify-center rounded-full border border-foreground/25 text-foreground/70 transition-colors motion-safe:duration-300 hover:border-signal hover:bg-signal hover:text-signal-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
		>
			<motion.span
				className="flex"
				animate={{ y: [0, 5, 0] }}
				transition={{ duration: 2.4, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
			>
				<ChevronDown size={20} aria-hidden="true" />
			</motion.span>
		</a>
	);
};

export default ScrollCue;
