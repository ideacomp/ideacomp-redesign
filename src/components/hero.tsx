"use client";

import FacetField from "@/components/backgrounds/facet-field";
import ParallaxTriangles from "@/components/backgrounds/parallax-triangles";

/**
 * The hero backdrop, in three layers, modelled on templatemonster demo 52524
 * ("ConsultBiz") and recoloured from that template's royal blue to our cyan:
 *
 *   1. the cyan field, deep under the copy and opening out to the right
 *   2. `FacetField`   — a low-poly slab relief, the reference's "3D objects":
 *                       real 3D geometry through a pinhole camera, relit and
 *                       sheared as the pointer moves
 *   3. `ParallaxTriangles` — white triangles drifting against the mouse
 *
 * That is now exactly the reference's own stack. `WaveField` — the line ribbon
 * the client picked off the comp sheet on 2026-08-14 — sat between 2 and 3 and
 * was removed on 2026-08-18 at the client's request, after being made static and
 * then shortened on laptops in the days before. **The component is still in the
 * tree at `backgrounds/wave-field.tsx` and is deliberately not deleted**: it has
 * been in and out once already, and `copyEdge()` there is still the canonical
 * derivation of the copy-column fraction that `--field-hold` in `globals.css` is
 * kept in step with. Remounting it is one line.
 *
 * NOTE: an earlier revision of this file said the scattered triangles were
 * "template furniture" that had been rejected here once and must not return.
 * That instruction was reversed by the client on 2026-08-17, who asked for them
 * by name along with the faceted background. Don't delete them on the strength
 * of the old comment.
 *
 * Still deliberately absent: the `Grainient` WebGL gradient this replaced (the
 * facets need a flat ground to read against), and a photographic focal object
 * composited with `mix-blend-screen`.
 */
interface HeroBackdropProps {
	/**
	 * `hero` is the home page's full-height opening; `band` is the short banner
	 * the interior pages run above their content. Same three layers on the same
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

			<ParallaxTriangles className="absolute inset-0" />

			<div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background" />
		</div>
	);
};

export default HeroBackdrop;
