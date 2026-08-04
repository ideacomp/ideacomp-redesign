import Image from "next/image";
import { cn } from "@/lib/utils";

interface FramedImageProps {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	/** Applied to the wrapper — aspect ratio, positioning, extra borders. */
	className?: string;
}

/**
 * The frame every image on the site sits in, exported so a single image and a
 * carousel of them share one definition instead of two copies that drift.
 *
 * `group` is here because both consumers hang a hover transform off it.
 */
export const IMAGE_FRAME =
	"group relative overflow-hidden rounded-lg border border-border transition-colors motion-safe:duration-300 hover:border-signal/40";

/**
 * An image in the site frame, shown in its own colour.
 *
 * There used to be a duotone here: every image was flattened to greyscale and
 * re-tinted signal-cyan through four blend layers, so that mixed stock sources
 * would land in one colour family. It was removed on request — photographs and
 * generated panels now render as they are.
 *
 * Two consequences worth knowing before adding an image:
 *
 * - **Source colour is now load-bearing.** The tint used to absorb it. A photo
 *   that clashes with the palette will now clash on the page, and the fix is to
 *   grade the file, not to reach for a CSS filter.
 * - **The `/solutions` panels supply their own palette.** They are generated in
 *   our tokens (see `docs/diagrams/panel.css`), which is why they still sit in
 *   the signal-cyan family without anything tinting them.
 *
 * `isolate` is also gone: it was only there to stop the blend layers
 * compositing against the page instead of against the image.
 */
const FramedImage = ({ src, alt, sizes, priority = false, className }: FramedImageProps) => (
	<div className={cn(IMAGE_FRAME, className)}>
		<Image
			src={src}
			alt={alt}
			fill
			sizes={sizes}
			priority={priority}
			className="object-cover transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
		/>
	</div>
);

export default FramedImage;
