import { Metadata } from "next";
import NotFoundContent from "./not-found-content";

export const metadata: Metadata = {
	title: "Page Not Found (404) - Ideacomp",
	description: "The page you're looking for doesn't exist. Explore our software development solutions, contact us, or return to our homepage.",
	robots: {
		index: false,
		follow: true,
	},
};

export default function NotFound() {
	return <NotFoundContent />;
}
