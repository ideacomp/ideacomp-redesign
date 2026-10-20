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
	/** The first panel on the page: its src is in the server HTML, so the
	 *  browser starts fetching while the page loads instead of after
	 *  hydration. On a throttled phone that was ~2.5 s of the 3.5 s start. */
	eager?: boolean;
	/** Arm the download without playing — the tour sets this on the tab under
	 *  the pointer and on the slot that plays next, so a switch has data. */
	prefetch?: boolean;
	/** Second to start (and restart) from. Each piece opens on a beat of bare
	 *  paper before its caption rises; a viewer who just picked it shouldn't
	 *  sit through that. A loop still wraps to 0, where the seam is. */
	startAt?: number;
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
	eager = false,
	prefetch = false,
	startAt = 0,
}: PanelVideoProps) => {
	const { dict } = useLocale();
	const ref = useRef<HTMLVideoElement | null>(null);
	const [onScreen, setOnScreen] = useState(false);
	// Within ~1.5 screens of the viewport: close enough to start downloading.
	const [near, setNear] = useState(false);
	const [reduced, setReduced] = useState(true);
	const [tabVisible, setTabVisible] = useState(true);
	// null = the viewer hasn't touched the controls; then reduced motion decides.
	const [userPaused, setUserPaused] = useState<boolean | null>(null);
	const paused = userPaused ?? reduced;
	// Which still to show before the video runs. Autoplay shows frame 0
	// (`-start.jpg`, written by capture.mjs) so playback starts on the same
	// picture; the settled poster — the end of the story — was a visible cut
	// back to an empty field the moment the video began. Only reduced motion,
	// where nothing autoplays, keeps the settled poster as the panel.
	const [stillPoster, setStillPoster] = useState(false);
	const shownPoster = stillPoster ? poster : poster.replace(/-poster\.jpg$/, "-start.jpg");

	const setRef = useCallback(
		(el: HTMLVideoElement | null) => {
			ref.current = el;
			videoRef?.(el);
		},
		[videoRef],
	);

	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => {
			setReduced(query.matches);
			setStillPoster(query.matches);
		};
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// Plays from the first visible pixel. At 25% the poster sat there
		// first and the start felt late, most of all on a phone.
		const visible = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
			threshold: 0,
		});
		const approach = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
			rootMargin: "150% 0px",
		});
		visible.observe(el);
		approach.observe(el);
		return () => {
			visible.disconnect();
			approach.disconnect();
		};
	}, []);

	useEffect(() => {
		const onVisibility = () => setTabVisible(!document.hidden);
		document.addEventListener("visibilitychange", onVisibility);
		return () => document.removeEventListener("visibilitychange", onVisibility);
	}, []);

	const run = playing && onScreen && tabVisible && !paused;
	const runRef = useRef(run);
	runRef.current = run;

	// Loading is armed once the panel is near the viewport and wanted (the
	// tour only wants its active slot), and stays armed. Until then the video
	// has no src at all: six panels each fetching up front, and the ones
	// scrolled past still downloading, split a phone's bandwidth until the one
	// on screen stalled — 9 stalls in one run on a throttled 3G profile.
	const [armed, setArmed] = useState(eager);
	// Rendered once and never changed, so React never touches the attribute
	// again: language switches still go through the imperative swap below.
	const [initialSrc] = useState(eager ? src : undefined);
	useEffect(() => {
		if (near && (playing || prefetch)) setArmed(true);
	}, [near, playing, prefetch]);

	// The opening seek, for whichever load comes first: the eager one in the
	// server HTML or the one armed below.
	const startAtRef = useRef(startAt);
	startAtRef.current = startAt;
	useEffect(() => {
		const el = ref.current;
		if (!el || !startAt) return;
		const seek = () => {
			if (el.currentTime < startAtRef.current) el.currentTime = startAtRef.current;
		};
		if (el.readyState >= 1) seek();
		else el.addEventListener("loadedmetadata", seek, { once: true });
		return () => el.removeEventListener("loadedmetadata", seek);
	}, [armed, startAt]);

	// Load / swap the source, keeping the current second across the swap.
	useEffect(() => {
		const el = ref.current;
		if (!el || !armed) return;
		if (el.getAttribute("src") === src) return;
		const resumeAt = el.getAttribute("src") ? el.currentTime : 0;
		el.setAttribute("src", src);
		const onReady = () => {
			if (resumeAt > 0 && resumeAt < el.duration) el.currentTime = resumeAt;
			if (runRef.current) el.play().catch(() => {});
		};
		el.addEventListener("loadedmetadata", onReady, { once: true });
		// Kick the load now instead of waiting for loadedmetadata: iOS Safari
		// never fetches metadata on its own for a video that started out as
		// preload="none", so a panel the visitor was already looking at sat on
		// its poster until a scroll re-ran the play effect. play() itself
		// starts the fetch there.
		el.load();
		if (runRef.current) el.play().catch(() => {});
		return () => el.removeEventListener("loadedmetadata", onReady);
	}, [src, armed]);

	// A new key means a fresh run of this panel.
	const firstKey = useRef(true);
	useEffect(() => {
		if (firstKey.current) {
			firstKey.current = false;
			return;
		}
		const el = ref.current;
		if (!el) return;
		el.currentTime = startAtRef.current;
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
		el.currentTime = startAtRef.current;
		setUserPaused(false);
		if (playing && onScreen && tabVisible) el.play().catch(() => {});
	};

	return (
		<>
			<video
				ref={setRef}
				src={initialSrc}
				poster={shownPoster}
				muted
				loop={loop}
				playsInline
				preload={armed ? "auto" : "none"}
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
