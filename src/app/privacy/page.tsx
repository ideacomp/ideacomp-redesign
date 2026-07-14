import type { Metadata } from "next";
import PrivacyContent from "./privacy-content";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"How Ideacomp s.r.o. collects, uses, and protects personal data submitted through this site, including contact form data and consent-gated analytics.",
	alternates: {
		canonical: "https://ideacomp.cz/privacy",
	},
	robots: {
		index: true,
		follow: true,
	},
};

const Privacy = () => <PrivacyContent />;

export default Privacy;
