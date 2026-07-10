"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll reveal that never hides content: opacity stays at 1 so the section
 * is fully present even if the viewport transition never fires (headless
 * renderers, hidden tabs). Only position/scale animate as polish.
 */
const variants: Variants = {
	hidden: { opacity: 1, y: 20 },
	shown: { opacity: 1, y: 0 },
};

export function Reveal({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	className?: string;
	delay?: number;
}) {
	return (
		<motion.div
			className={className}
			initial="hidden"
			whileInView="shown"
			viewport={{ once: true, margin: "-80px" }}
			variants={variants}
			transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
		>
			{children}
		</motion.div>
	);
}
