import type { Metadata } from "next";
import { VariantsPreview } from "./variants-preview";

export const metadata: Metadata = {
	title: "Contact form variants",
	description: "Internal comparison of the contact form layouts.",
	// Overrides the indexable defaults inherited from contact/layout.tsx — this
	// page is a working tool, not a public route.
	robots: { index: false, follow: false },
	alternates: { canonical: "https://ideacomp.cz/contact/variants" },
};

export default function ContactVariantsPage() {
	return <VariantsPreview />;
}
