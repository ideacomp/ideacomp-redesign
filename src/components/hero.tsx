"use client";

import FacetField from "@/components/backgrounds/facet-field";
import ParallaxTriangles from "@/components/backgrounds/parallax-triangles";

/**
 * The hero backdrop, in three layers, modelled on templatemonster demo 52524
 * ("ConsultBiz") and recoloured from that template's royal blue to our brand:
 *
 *   1. the brand field, deep under the copy and opening out to the right
 *   2. `FacetField` — a low-poly relief that relights per pointer frame
 *   3. `ParallaxTriangles` — white triangles drifting against the mouse
 *
 * **On the middle layer, read this before touching it.** Five have been built
 * here: a Grainient WebGL gradient; a wave ribbon; `FacetField`; `SlabStack`,
 * six translucent DOM panes at three depths; and `Platform`, a three-tier
 * terrace baked to a greyscale raster. `SlabStack` and `Platform` were both
 * rejected by the client — the terrace on 2026-08-20, "ty 3d panely dej nakonec
 * pryč" — and `FacetField` was restored the same day because it is what is
 * actually live: the terrace work was never committed and so never shipped.
 *
 * So the shortlist is closed, not open. **`FacetField` is the layer the client
 * has seen and kept.** The `Platform` generator survives at `docs/hero/`
 * (`plateau.mjs` + `scene.mjs`) if it is ever wanted back, but don't reach for
 * it, and don't propose a sixth.
 *
 * `WaveField` — the line ribbon the client picked off the comp sheet on
 * 2026-08-14 — was removed on 2026-08-18 at the client's request. **The
 * component is still in the tree at `backgrounds/wave-field.tsx` and is
 * deliberately not deleted**: it has been in and out once already, and
 * `copyEdge()` there is still the canonical derivation of the copy-column
 * fraction that `--field-hold` in `globals.css` is kept in step with.
 *
 * NOTE: an earlier revision of this file said the scattered triangles were
 * "template furniture" that had been rejected here once and must not return.
 * That instruction was reversed by the client on 2026-08-17, who asked for them
 * by name. Don't delete them on the strength of the old comment.
 *
 * Still deliberately absent: the `Grainient` WebGL gradient, and a photographic
 * focal object composited with `mix-blend-screen`.
 */
interface HeroBackdropProps {
	/**
	 * `hero` is the home page's full-height opening; `band` is the short banner
	 * the interior pages run above their content. Same three layers on the same
	 * copy column — the band just runs the facets at 0.6 intensity, because a
	 * banner is a header and not the opening statement.
	 */
	variant?: "hero" | "band";
}

const HeroBackdrop = ({ variant = "hero" }: HeroBackdropProps) => {
	return (
		<div className="absolute inset-0 overflow-hidden" aria-hidden="true">
			{/* The field itself — see `.surface-signal` in globals.css for why it is
			    graded at all, and why `--field-hold` is per-breakpoint rather than one
			    number. The slight tilt keeps it from reading as a UI gradient.

			    This has to stay a plain div behind `FacetField` rather than being
			    baked into that layer: the facets are white-and-black alpha only,
			    which is what makes recolouring the whole hero a one-token change —
			    and it is why the #00a3ff rebrand cost this hero nothing. */}
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
