"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useReducedMotion } from "motion/react";
import type { ProcessStep } from "@/lib/sitemap";

/**
 * "How We Work" as a scroll-driven timeline: a track line fills as the
 * section scrolls through view (one `useScroll` on the container, a single
 * GPU `scaleY` transform — not per-step scroll listeners), and each step's
 * index brightens to signal color as it crosses the viewport's center band.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const shouldReduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	});
	// `useReducedMotion` is null during SSR and resolves after hydration, so
	// feeding it straight into `style` makes the server emit scaleY(0) where the
	// client wants none. Read it only once mounted, and keep the static track
	// (scaleY 1) as the value both renders agree on beforehand.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const trackScale = mounted && !shouldReduceMotion ? scrollYProgress : 1;

	return (
		<div ref={containerRef} className="relative mt-16">
			<div className="absolute left-0 top-0 h-full w-px bg-border" aria-hidden="true">
				<motion.div
					className="w-full origin-top bg-signal"
					style={{ height: "100%", scaleY: trackScale }}
				/>
			</div>

			<div className="grid gap-y-14 pl-8 sm:pl-10">
				{steps.map((step) => (
					<TimelineStep key={step.step} step={step} />
				))}
			</div>
		</div>
	);
}

function TimelineStep({ step }: { step: ProcessStep }) {
	const [isActive, setIsActive] = useState(false);

	return (
		<motion.div
			onViewportEnter={() => setIsActive(true)}
			onViewportLeave={() => setIsActive(false)}
			viewport={{ margin: "-45% 0px -45% 0px" }}
		>
			<span
				className={`font-mono text-sm transition-colors motion-safe:duration-500 ${
					isActive ? "text-signal" : "text-foreground/40"
				}`}
			>
				{step.step}
			</span>
			<h3 className="eyebrow-heading mt-3 text-foreground">{step.title}</h3>
			<p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/60">{step.description}</p>
		</motion.div>
	);
}
