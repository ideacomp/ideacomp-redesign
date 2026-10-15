"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

interface PanelVideoProps {
	src: string;
	poster: string;
	label: string;
	/** Whether the caller wants it running. It still won't while the viewer
	 *  has paused it, under reduced motion, off-screen, or in a hidden tab. */
	playing: boolean;
	/** Change this to rewind to the start — e.g. each time a tour selects the
	 *  slot. Pausing and resuming never rewinds; only a new key does. */
	restartKey?: number | string;
	/** Loop forever (the bands) or stop on the last frame and report it (the
	 *  tour, which advances on `onEnded`). */
	loop?: boolean;
	onEnded?: () => void;
	/** Hands the element to a parent that draws its own progress from it. */
	videoRef?: (el: HTMLVideoElement | null) => void;
	className?: string;
}

const CONTROL =
	"inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-[oklch(0.16_0.015_255/0.72)] text-white transition-colors hover:bg-[oklch(0.16_0.015_255/0.9)] focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none";

/**
 * A generated motion panel from `docs/motion/`, with its own pause / play and
 * back-to-start controls.
 *
 * **Language switches keep your place.** The EN and CS cuts share one
 * timeline, so when `src` changes the player notes where it was, loads the
 * other cut, seeks to the same second and carries on — instead of the old
 * behaviour, where React swapped the attribute, the browser reloaded from 0
 * and nothing called `play()` again, leaving a frozen first frame.
 *
 * `src` is therefore set imperatively, never as a JSX attribute: by the time an
 * effect sees an attribute change, the element has already reset to 0 and the
 * position is gone.
 *
 * **Pause means pause.** Resuming continues from the same frame. Only a new
 * `restartKey` or the back-to-start button rewinds.
 *
 * The rendered tree never branches on motion preference (see the hydration
 * note on `useReducedMotion`). Under reduced motion nothing autoplays — the
 * poster, a settled frame of the finished run, stands in — but the play button
 * still works, because a viewer pressing it has asked for the motion.
 */
const PanelVideo = ({
	src,
	poster,
	label,
	playing,
	restartKey,
	loop = true,
	onEnded,
	videoRef,
	className,
}: PanelVideoProps) => {
	const { dict } = useLocale();
	const ref = useRef<HTMLVideoElement | null>(null);
	const [onScreen, setOnScreen] = useState(false);
	const [reduced, setReduced] = useState(true);
	const [tabVisible, setTabVisible] = useState(true);
	// null = the viewer hasn't touched the controls; then reduced motion decides.
	const [userPaused, setUserPaused] = useState<boolean | null>(null);
	const paused = userPaused ?? reduced;

	const setRef = useCallback(
		(el: HTMLVideoElement | null) => {
			ref.current = el;
			videoRef?.(el);
		},
		[videoRef],
	);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setReduced(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
			threshold: 0.25,
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const onVisibility = () => setTabVisible(!document.hidden);
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	const run = playing && onScreen && tabVisible && !paused;
	const runRef = useRef(run);
	runRef.current = run;

	// Load / swap the source, keeping the current second across the swap.
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (el.getAttribute("src") === src) return;
		const resumeAt = el.getAttribute("src") ? el.currentTime : 0;
		el.setAttribute("src", src);
		const onReady = () => {
			if (resumeAt > 0 && resumeAt < el.duration) el.currentTime = resumeAt;
			if (runRef.current) el.play().catch(() => {});
		};
		el.addEventListener("loadedmetadata", onReady, { once: true });
		return () => el.removeEventListener("loadedmetadata", onReady);
	}, [src]);

	// A new key means a fresh run of this panel.
	const firstKey = useRef(true);
	useEffect(() => {
		if (firstKey.current) {
			firstKey.current = false;
			return;
		}
		const el = ref.current;
		if (!el) return;
		el.currentTime = 0;
		setUserPaused(null);
	}, [restartKey]);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// Autoplay can still be refused (data saver, some in-app browsers); the
		// poster is a complete frame, so failing quietly is correct.
		if (run) el.play().catch(() => {});
		else el.pause();
	}, [run]);

	const restart = () => {
		const el = ref.current;
		if (!el) return;
		el.currentTime = 0;
		setUserPaused(false);
		if (playing && onScreen && tabVisible) el.play().catch(() => {});
	};

	return (
		<>
			<video
				ref={setRef}
				poster={poster}
				muted
				loop={loop}
				playsInline
				preload="metadata"
				aria-label={label}
				onEnded={onEnded}
				className={cn("h-full w-full object-cover", className)}
			/>
			<div className="absolute right-3 bottom-3 flex gap-2 sm:right-4 sm:bottom-4">
				<button type="button" onClick={restart} aria-label={dict.common.restartVideo} className={CONTROL}>
					<RotateCcw size={15} aria-hidden="true" />
				</button>
				<button
					type="button"
					onClick={() => setUserPaused(!paused)}
					aria-label={paused ? dict.common.playSolutions : dict.common.pauseSolutions}
					className={CONTROL}
				>
					{paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
				</button>
			</div>
		</>
	);
};

export default PanelVideo;
