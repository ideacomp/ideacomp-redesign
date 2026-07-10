import {
	Code,
	Smartphone,
	Brain,
	Cloud,
	Shield,
	Braces,
	Stethoscope,
	GraduationCap,
	Factory,
	Landmark,
	Clapperboard,
	HeartHandshake,
	CheckCircle,
	ExternalLink,
} from "lucide-react";

import { ComponentType } from "react";

// Export icons for use in components
export { CheckCircle, ExternalLink };

// Navigation data
export interface NavigationItem {
	name: string;
	href: string;
}

export const navigation: NavigationItem[] = [
	{ name: "Home", href: "/" },
	{ name: "Our Solutions", href: "/solutions" },
	{ name: "Contact", href: "/contact" },
];

// Capability overview data (Home page)
export interface Capability {
	icon: ComponentType<{ className?: string; size?: number }>;
	title: string;
	description: string;
}

export const capabilities: Capability[] = [
	{
		icon: Brain,
		title: "AI & Machine Learning",
		description:
			"We turn operational data into forecasting, automation, and decision-support systems your team can audit and trust.",
	},
	{
		icon: Code,
		title: "Custom Software Development",
		description:
			"Production-grade web and mobile applications, architected for the constraints of your industry, not a generic template.",
	},
	{
		icon: Braces,
		title: "Outsourcing & Team Augmentation",
		description:
			"Engineers who integrate with your existing workflow and delivery process, so your roadmap keeps moving.",
	},
];

// Delivery process (Home page — the one legitimate numbered sequence)
export interface ProcessStep {
	step: string;
	title: string;
	description: string;
}

export const processSteps: ProcessStep[] = [
	{
		step: "01",
		title: "Discovery & Architecture",
		description:
			"We map your constraints first — compliance, integrations, scale, existing systems — before a line of code is written.",
	},
	{
		step: "02",
		title: "Build in the Open",
		description:
			"Iterative delivery with working software early and direct access to the engineers building it, not an account manager relaying updates.",
	},
	{
		step: "03",
		title: "Security & Quality Review",
		description:
			"Code review, security testing, and compliance checks are part of every release cycle, not a step bolted on at the end.",
	},
	{
		step: "04",
		title: "Ship & Support",
		description:
			"Production rollout with monitoring, documentation, and a support plan your own team can actually operate.",
	},
];

// Solutions data (the required "Our Solutions" content)
export type DiagramKind =
	| "ai-ml"
	| "cybersecurity"
	| "web-dev"
	| "outsourcing"
	| "mobile"
	| "cloud-devops";

export interface Solution {
	slug: string;
	diagram: DiagramKind;
	icon: ComponentType<{ className?: string; size?: number }>;
	title: string;
	description: string;
	detailedDescription: string;
	features: {
		name: string;
		description: string;
	}[];
}

export const solutionsData: Solution[] = [
	{
		slug: "ai-ml",
		diagram: "ai-ml",
		icon: Brain,
		title: "AI & Machine Learning",
		description:
			"Smart solutions that turn complex, messy data into decisions your team can defend.",
		detailedDescription:
			"We design and ship AI and machine learning systems that transform operational data into forecasting, process automation, and decision support — built to be explainable and auditable, not a black box bolted onto your stack.",
		features: [
			{
				name: "Predictive Analytics",
				description:
					"Forecasting models trained on your own operational data, built for measurable business decisions.",
			},
			{
				name: "Process Analysis",
				description:
					"Instrumentation and analysis pipelines that surface where a workflow is actually losing time or money.",
			},
			{
				name: "Process Automation",
				description:
					"Automation that removes repetitive manual work without removing a human's ability to review and override it.",
			},
		],
	},
	{
		slug: "cybersecurity",
		diagram: "cybersecurity",
		icon: Shield,
		title: "Cybersecurity",
		description:
			"Protecting your systems and data with security built into delivery, not audited in afterward.",
		detailedDescription:
			"We design, deploy, and manage security programs that protect your infrastructure and data, keep you audit-ready, and hold up under regulatory scrutiny in healthcare, government, and enterprise environments.",
		features: [
			{
				name: "Firewall & Network Perimeter",
				description:
					"Sophos, Fortinet, and Palo Alto deployments configured and managed for your actual traffic patterns, not defaults.",
			},
			{
				name: "Security Assessments",
				description:
					"Network and application security assessments that identify real exposure and prioritize fixes by impact.",
			},
			{
				name: "Incident Response",
				description:
					"Response plans and runbooks built before an incident happens, so containment is a procedure, not a scramble.",
			},
		],
	},
	{
		slug: "web-development",
		diagram: "web-dev",
		icon: Code,
		title: "Custom Web Development",
		description:
			"Full-cycle web development, from architecture to deployment and maintenance.",
		detailedDescription:
			"We build modern, scalable web applications end to end — architecture, frontend, backend, and the infrastructure it runs on — using the stack that fits your requirements, not the one that's trending.",
		features: [
			{
				name: "Frontend Engineering",
				description:
					"React and Next.js interfaces built for accessibility and performance, not just a pixel-matched comp.",
			},
			{
				name: "Backend & API Architecture",
				description:
					"Node.js, Python, and Go backends with API contracts designed to outlive the first integration that uses them.",
			},
			{
				name: "Responsive & Progressive Web Apps",
				description:
					"Interfaces engineered for every viewport and connection quality, including offline-tolerant PWAs.",
			},
		],
	},
	{
		slug: "outsourcing",
		diagram: "outsourcing",
		icon: Braces,
		title: "Outsourcing & Team Augmentation",
		description:
			"Access experienced engineers who plug into your existing workflow.",
		detailedDescription:
			"Scale your delivery capacity with engineers who integrate with your existing tools, standards, and cadence — reporting into your process, not running a parallel one.",
		features: [
			{
				name: "Helpdesk & End-User Support",
				description:
					"Responsive first- and second-line support that keeps your internal teams unblocked.",
			},
			{
				name: "Network Management",
				description:
					"Ongoing monitoring and management of your network estate, including ManageEngine-based tooling.",
			},
			{
				name: "Server Management",
				description:
					"Proactive maintenance and monitoring so infrastructure issues get caught before they become outages.",
			},
		],
	},
	{
		slug: "mobile-development",
		diagram: "mobile",
		icon: Smartphone,
		title: "Mobile App Development",
		description:
			"Native and cross-platform apps built for real-world usage, not just a demo.",
		detailedDescription:
			"We build high-performance mobile applications for iOS and Android, choosing native or cross-platform per project based on performance, budget, and reach — not a one-size-fits-all default.",
		features: [
			{
				name: "Native Development",
				description:
					"iOS and Android built natively where performance or platform integration genuinely requires it.",
			},
			{
				name: "Cross-Platform Apps",
				description:
					"React Native and Flutter for efficient multi-platform delivery without duplicating engineering effort.",
			},
			{
				name: "Offline-First Functionality",
				description:
					"Local-first data handling so the app stays usable in the field, in a hospital basement, or on a factory floor.",
			},
		],
	},
	{
		slug: "cloud-devops",
		diagram: "cloud-devops",
		icon: Cloud,
		title: "Cloud & DevOps",
		description:
			"Infrastructure and automation for systems that need to stay up.",
		detailedDescription:
			"We design and operate cloud infrastructure and delivery pipelines so your applications scale predictably, recover from failure automatically, and deploy without drama.",
		features: [
			{
				name: "Cloud Infrastructure",
				description:
					"AWS, Azure, and Google Cloud environments provisioned as code and sized for your actual load.",
			},
			{
				name: "Containerization",
				description:
					"Docker and Kubernetes orchestration for workloads that need to scale horizontally and recover automatically.",
			},
			{
				name: "CI/CD Automation",
				description:
					"Deployment pipelines with automated testing gates, so shipping on a Friday isn't a risk.",
			},
		],
	},
];

// Industries data
export interface Industry {
	name: string;
	icon: ComponentType<{ className?: string; size?: number }>;
	description: string;
}

export const industries: Industry[] = [
	{
		name: "Healthcare",
		icon: Stethoscope,
		description: "Systems built for patient data sensitivity and clinical uptime requirements.",
	},
	{
		name: "Education",
		icon: GraduationCap,
		description: "Platforms that hold up under semester-scale traffic and long procurement cycles.",
	},
	{
		name: "Manufacturing",
		icon: Factory,
		description: "Integrations with plant-floor systems and process automation that can't tolerate downtime.",
	},
	{
		name: "Government",
		icon: Landmark,
		description: "Auditable, compliance-first delivery for public-sector accountability standards.",
	},
	{
		name: "Media & Entertainment",
		icon: Clapperboard,
		description: "Content and streaming platforms engineered for traffic spikes and rights complexity.",
	},
	{
		name: "Non-Profit",
		icon: HeartHandshake,
		description: "Lean, sustainable systems sized to real budgets and real operating constraints.",
	},
];

export const socialLinks = [
	{
		name: "GitHub",
		href: "https://github.com/ideacomp",
	},
];

export const content = {
	hero: {
		title: "Driven by Ideas",
		subtitle:
			"We engineer software, AI, and infrastructure for organizations that can't afford to gamble on a vendor — across healthcare, government, manufacturing, education, media, and non-profit work.",
		ctaPrimary: {
			text: "See Our Solutions",
			href: "/solutions",
		},
		ctaSecondary: {
			text: "Get in Touch",
			href: "/contact",
		},
	},
	home: {
		capabilities: {
			title: "Where We Build",
			subtitle:
				"Three disciplines, one delivery standard.",
		},
		process: {
			title: "How We Work",
			subtitle:
				"A delivery process built for organizations that need to defend every decision to their own stakeholders.",
		},
		industries: {
			title: "Industries We Serve",
			subtitle:
				"Domain-specific constraints, not a generic playbook.",
		},
		finalCta: {
			title: "Ready to Build Something That Has to Work?",
			subtitle:
				"Tell us what you're building and what it has to hold up against. We'll tell you honestly whether we're the right team for it.",
			cta: {
				text: "Start the Conversation",
				href: "/contact",
			},
		},
	},
	solutions: {
		hero: {
			title: "Our Solutions",
			subtitle:
				"Six disciplines, applied together or on their own, depending on what the problem actually needs.",
		},
		industries: {
			title: "Industries We Serve",
			subtitle:
				"Our expertise spans healthcare, education, manufacturing, government, media, and non-profit work — each with its own constraints we design around.",
		},
		finalCta: {
			title: "Ready to Transform Your Business?",
			subtitle:
				"Let's discuss how our solutions can help you achieve your goals and drive innovation in your industry.",
			cta: {
				text: "Get In Touch",
				href: "/contact",
			},
		},
	},
	contact: {
		hero: {
			title: "Let's Build Something That Holds Up",
			subtitle:
				"Tell us about your project. We reply within one business day.",
		},
	},
};
