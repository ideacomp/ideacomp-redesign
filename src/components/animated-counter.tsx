"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

/**
 * Counts up to `value` once scrolled into view. Always renders the real
 * final number as the default DOM content (SSR-safe, correct even if JS
 * never runs) and only animates the count-up as a client-side enhancement.
 * Snaps straight to the final value under prefers-reduced-motion.
 */
export function AnimatedCounter({
	value,
	prefix = "",
	suffix = "",
	className,
}: {
	value: number;
	prefix?: string;
	suffix?: string;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-80px" });
	const shouldReduceMotion = useReducedMotion();
	const [display, setDisplay] = useState(value);

	useEffect(() => {
		if (!isInView || shouldReduceMotion) return;
		setDisplay(0);
		const controls = animate(0, value, {
			duration: 1.2,
			ease: [0.16, 1, 0.3, 1],
			onUpdate: (v) => setDisplay(Math.round(v)),
		});
		return () => controls.stop();
	}, [isInView, shouldReduceMotion, value]);

	return (
		<span ref={ref} className={className}>
			{prefix}
			{display}
			{suffix}
		</span>
	);
}
