import Image from "next/image";
import { cn } from "@/lib/utils";

interface DuotoneImageProps {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	/** Applied to the wrapper — aspect ratio, positioning, extra borders. */
	className?: string;
}

/**
 * The blend stack that *is* the treatment. Exported so anything rendering photos
 * — a single image, a carousel of them — composites through one calibrated
 * recipe instead of a copy that can drift. Layer it over the photo(s) inside an
 * `isolate` wrapper.
 *
 * `saturate-0 contrast-[1.12] brightness-[0.97]` on the image itself is the other
 * half of the recipe; see `IMAGE_FILTER`.
 */
export const DuotoneLayers = () => (
	<>
		{/* Hue + chroma of signal, luminance of the photo — the actual duotone. */}
		<div className="absolute inset-0 bg-signal opacity-70 mix-blend-color" aria-hidden="true" />
		{/* Lifts the shadows so dark frames keep detail. Lifts more on the dark
		    surface, where `--signal` is the brighter of the two values — which is
		    where the extra headroom is needed. */}
		<div className="absolute inset-0 bg-signal opacity-[0.18] mix-blend-screen" aria-hidden="true" />
		{/* Seats the image into the surface. Near-no-op on light, where
		    `--background` is almost white. */}
		<div className="absolute inset-0 bg-background opacity-15 mix-blend-multiply" aria-hidden="true" />
		{/* Dissolves the bottom edge into the section — the same idiom the hero
		    uses over the Grainient canvas. */}
		<div
			className="absolute inset-0 bg-gradient-to-b from-transparent to-background/45"
			aria-hidden="true"
		/>
	</>
);

/** Greyscale + grade applied to the photo before the layers tint it. */
export const IMAGE_FILTER = "saturate-0 contrast-[1.12] brightness-[0.97]";

/**
 * The single photographic treatment used across the site.
 *
 * Photos come from mixed stock sources, so nothing about their native colour
 * can be relied on. Rather than hand-grading each file, every photo is
 * flattened to greyscale and then re-tinted through four blend layers, which
 * forces any source image into the same signal-cyan duotone family.
 *
 * The reason this is done in CSS rather than baked into the JPEGs: layers 3
 * and 4 paint `bg-background`, and `--background` is redefined per art-directed
 * surface. So the same markup lands as a graphite-cyan duotone inside a `.dark`
 * section and a paper-cyan duotone on the light "datasheet" surface, with no
 * per-surface variants and no second set of files. Baked duotones would read as
 * a hole punched in the light surface — which is exactly what the previous
 * near-black source images did.
 *
 * `isolate` on the wrapper is required: without it the blend layers would
 * composite against the page behind the card instead of against the photo.
 */
const DuotoneImage = ({ src, alt, sizes, priority = false, className }: DuotoneImageProps) => (
	<div
		className={cn(
			"group relative isolate overflow-hidden rounded-lg border border-border",
			"transition-colors motion-safe:duration-300 hover:border-signal/40",
			className,
		)}
	>
		<Image
			src={src}
			alt={alt}
			fill
			sizes={sizes}
			priority={priority}
			className={cn(
				"object-cover transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105",
				IMAGE_FILTER,
			)}
		/>
		<DuotoneLayers />
	</div>
);

export default DuotoneImage;
