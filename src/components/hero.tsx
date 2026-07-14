"use client";

import dynamic from "next/dynamic";

// WebGL (ogl) touches `window` at render time — must never run during SSR.
const Grainient = dynamic(() => import("@/components/grainient"), { ssr: false });

/**
 * Instrument-canvas hero backdrop: a slow-drifting grainy gradient in the
 * brand's signal-cyan against the graphite background, textured with film
 * grain rather than a flat swirl.
 */
const HeroBackdrop = () => {
	return (
		<div className="absolute inset-0 overflow-hidden" aria-hidden="true">
			<Grainient
				color1="#36c3e7"
				color2="#1c5f7a"
				color3="#0a0f16"
				timeSpeed={0.7}
				colorBalance={0}
				warpStrength={1.0}
				warpFrequency={8.5}
				warpSpeed={1.8}
				warpAmplitude={50}
				blendSoftness={0.05}
				rotationAmount={500}
				noiseScale={2.0}
				contrast={1.5}
				saturation={1.0}
				grainAmount={0.1}
				grainScale={0.9}
				zoom={0.9}
			/>

			<div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
		</div>
	);
};

export default HeroBackdrop;
