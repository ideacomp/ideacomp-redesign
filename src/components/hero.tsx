"use client";

import FacetField from "@/components/backgrounds/facet-field";
import ParallaxTriangles from "@/components/backgrounds/parallax-triangles";
import WaveField from "@/components/backgrounds/wave-field";

/**
 * The hero backdrop, in four layers, modelled on templatemonster demo 52524
 * ("ConsultBiz") and recoloured from that template's royal blue to our cyan:
 *
 *   1. the cyan field, deep under the copy and opening out to the right
 *   2. `FacetField`   — a low-poly slab relief, the reference's "3D objects":
 *                       real 3D geometry through a pinhole camera, relit as the
 *                       pointer moves, on a ±1.2° tilt
 *   3. `WaveField`    — the flowing ribbon, kept from the client's comp sheet
 *   4. `ParallaxTriangles` — white triangles drifting against the mouse
 *
 * The reference's own background is only 1, 2 and 4; the ribbon is an addition
 * the client asked to keep. Triangles sit above the ribbon so they read as the
 * nearest plane, which is where the reference puts them.
 *
 * NOTE: an earlier revision of this file said the scattered triangles were
 * "template furniture" that had been rejected here once and must not return.
 * That instruction was reversed by the client on 2026-08-17, who asked for them
 * by name along with the faceted background. Don't delete them on the strength
 * of the old comment.
 *
 * Still deliberately absent: the `Grainient` WebGL gradient this replaced (the
 * ribbon and the facets both need a flat ground to read against), and a
 * photographic focal object composited with `mix-blend-screen`.
 */
interface HeroBackdropProps {
	/**
	 * `hero` is the home page's full-height opening; `band` is the short banner
	 * the interior pages run above their content. Same four layers on the same
	 * copy column — the only thing the height changes is `FacetField`.
	 *
	 * In a tall hero the height drives that layer's `slice` crop, and the
	 * horizontal overflow carries its bright right-hand panels off past the copy.
	 * A band is wider than it is tall, so the width drives instead and those
	 * panels sit at a fixed 60% of it at every viewport — over the tail of the
	 * paragraph at anything under about 1200. On graphite that was survivable;
	 * on the cyan field it is 3.9:1, hence the dimming. See `intensity` there.
	 */
	variant?: "hero" | "band";
}

const HeroBackdrop = ({ variant = "hero" }: HeroBackdropProps) => {
	return (
		<div className="absolute inset-0 overflow-hidden" aria-hidden="true">
			{/* The field itself — see `.surface-signal` in globals.css for why it is
			    graded at all, and why `--field-hold` is per-breakpoint rather than one
			    number. The slight tilt keeps it from reading as a UI gradient.

			    This has to stay a plain div behind `FacetField` rather than becoming
			    that layer's own backdrop: the facets are white and black alpha only,
			    which is what makes recolouring the whole hero a one-token change. */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(100deg, var(--background) 0%, var(--background) var(--field-hold), var(--canvas-far) 100%)",
				}}
			/>

			<FacetField
				className="absolute inset-0 h-full w-full"
				intensity={variant === "band" ? 0.6 : 1}
			/>

			{/* Near-white rather than the logo cyan: the canvas underneath is now
			    itself cyan, so the ribbon has to be lighter than the field to exist
			    at all. Same relationship as the reference's white-on-blue lines.

			    Static by request — the triangles are the only thing that moves here
			    now, which is also what the reference does. Flip `animated` back on
			    to restore the drift; the still pose is the same one reduced motion
			    has always been served. */}
			<WaveField className="absolute inset-0 h-full w-full" color="#dff5ff" animated={false} />

			<ParallaxTriangles className="absolute inset-0" />

			<div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background" />
		</div>
	);
};

export default HeroBackdrop;
