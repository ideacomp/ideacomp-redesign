import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
	title: "About",
	description:
		"Ideacomp is a small, senior engineering team founded in 2024 — direct access to the people building your project, security review on every release, and no invented client claims.",
	alternates: {
		canonical: "https://ideacomp.cz/about",
	},
};

const About = () => <AboutContent />;

export default About;
