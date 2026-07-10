import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Our Solutions - AI, Cybersecurity, Cloud & Custom Software",
	description:
		"Ideacomp's six engineering disciplines: AI & Machine Learning, Cybersecurity, Custom Web Development, Outsourcing & Team Augmentation, Mobile App Development, and Cloud & DevOps — built for healthcare, government, manufacturing, education, media, and non-profit organizations.",
	keywords: [
		"custom app development",
		"AI machine learning solutions", 
		"cloud DevOps services",
		"digital transformation",
		"MVP development",
		"enterprise software solutions",
		"startup technology consulting",
		"business automation",
		"scalable software architecture",
		"modern web applications",
		"mobile app development",
		"cloud migration services",
		"software consulting Prague",
		"Czech Republic software development"
	],
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		title: "Our Solutions - AI, Cybersecurity, Cloud & Custom Software | Ideacomp",
		description:
			"Six engineering disciplines — AI & ML, Cybersecurity, Custom Web Development, Outsourcing, Mobile, and Cloud & DevOps — for organizations that can't afford to gamble on a vendor.",
		url: "https://ideacomp.cz/solutions",
		type: "website",
		images: [
			{
				url: "/landscape_logo.png",
				width: 1996,
				height: 868,
				alt: "Ideacomp Solutions - Custom Development, AI, Cybersecurity, Cloud & DevOps",
				type: "image/png"
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Our Solutions - AI, Cybersecurity, Cloud & Custom Software | Ideacomp",
		description:
			"Six engineering disciplines — AI & ML, Cybersecurity, Custom Web Development, Outsourcing, Mobile, and Cloud & DevOps — for organizations that can't afford to gamble on a vendor.",
		images: {
			url: "/landscape_logo.png",
			alt: "Ideacomp Solutions"
		},
	},
	alternates: {
		canonical: "https://ideacomp.cz/solutions",
	},
};

export default function SolutionsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
