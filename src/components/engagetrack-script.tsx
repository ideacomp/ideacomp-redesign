import Script from "next/script";

export default function EngageTrackScript() {
	return (
		<Script
			data-site-id="1k5cqZeUhBPsYOzs"
			data-domain="ideacomp.cz"
			src="https://cdn.engagetrack.net/sdk.js"
			strategy="afterInteractive"
		/>
	);
}
