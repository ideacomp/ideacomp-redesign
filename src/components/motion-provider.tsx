"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes every Motion component in the tree respect
 * the OS-level prefers-reduced-motion setting automatically (durations
 * collapse, transforms are skipped) — the global CSS media query alone
 * doesn't reach Motion's JS-driven animations.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
	return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
