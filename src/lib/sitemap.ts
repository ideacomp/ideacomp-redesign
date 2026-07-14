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
	Github,
	Linkedin,
} from "lucide-react";

import { ComponentType } from "react";

// Export icons for use in components
export { CheckCircle, ExternalLink };

// Navigation data. `key` looks up the localized label from the i18n
// dictionary (`dict.nav[key]`) — `navigation` itself only carries routing.
export interface NavigationItem {
	key: "home" | "about" | "solutions" | "contact";
	href: string;
}

export const navigation: NavigationItem[] = [
	{ key: "home", href: "/" },
	{ key: "about", href: "/about" },
	{ key: "solutions", href: "/solutions" },
	{ key: "contact", href: "/contact" },
];

// Footer-only legal links — deliberately not part of `navigation` so the
// header/main nav doesn't get cluttered with legal pages.
export interface LegalLink {
	key: "privacy";
	href: string;
}

export const legalLinks: LegalLink[] = [{ key: "privacy", href: "/privacy" }];

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
	/** Background photo behind the schematic diagram card. Free-license Unsplash photos, verified to resolve. */
	image: {
		src: string;
		alt: string;
	};
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
		image: {
			src: "https://images.unsplash.com/photo-1759210358926-4673cc44d35f?auto=format&fit=crop&w=1200&q=80",
			alt: "",
		},
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
		image: {
			src: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=80",
			alt: "",
		},
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
		image: {
			src: "https://images.unsplash.com/photo-1742072594003-abf6ca86e154?auto=format&fit=crop&w=1200&q=80",
			alt: "",
		},
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
		image: {
			src: "https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&w=1200&q=80",
			alt: "",
		},
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
		image: {
			src: "https://images.unsplash.com/photo-1758682663558-1a617d4d6c2a?auto=format&fit=crop&w=1200&q=80",
			alt: "",
		},
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
		image: {
			src: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&w=1200&q=80",
			alt: "",
		},
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

// Certifications / compliance badges (About page). Empty until the company
// actually holds a certification — never render a claim (e.g. "ISO 27001
// Certified") that isn't true. To add a real one once obtained:
//   { name: "ISO/IEC 27001", issuer: "...", year: "2027", href: "..." }
export interface Certification {
	name: string;
	issuer: string;
	year: string;
	href?: string;
}

export const certifications: Certification[] = [];

// Illustrative engagement scenarios (About page). These are representative
// of the kind of work we do, not real client case studies — no company is
// named and no specific client claims are made. Replace with real case
// studies (with client permission) as they become available.
export interface CaseStudy {
	industry: string;
	title: string;
	challenge: string;
	approach: string;
	outcome: string;
}

export const caseStudies: CaseStudy[] = [
	{
		industry: "Healthcare",
		title: "Cloud migration with zero patient-facing downtime",
		challenge:
			"A healthcare provider needed to move a legacy scheduling system off aging on-premise servers without interrupting clinical operations or risking patient data during the cutover.",
		approach:
			"Phased migration with a shadow environment running in parallel, automated data-integrity checks before each cutover step, and a rollback plan rehearsed before it was ever needed.",
		outcome:
			"The kind of migration where success means nobody downstream notices anything happened.",
	},
	{
		industry: "Government",
		title: "An audit-ready case-management platform",
		challenge:
			"A public-sector body needed a case-management system where every action had to be traceable for compliance review, without slowing down the caseworkers using it daily.",
		approach:
			"Immutable audit logging built into the data layer from day one (not bolted on later), paired with role-based access control mapped directly to the organization's existing approval chain.",
		outcome:
			"Every record change is reconstructable after the fact — the audit trail is a byproduct of the architecture, not a separate reporting exercise.",
	},
	{
		industry: "Manufacturing",
		title: "Predictive maintenance on a plant-floor budget",
		challenge:
			"A manufacturer wanted to reduce unplanned downtime from equipment failure but couldn't justify a full industrial-IoT platform for a single production line.",
		approach:
			"A lean sensor-data pipeline and a forecasting model scoped to the handful of failure modes that actually mattered, deployed incrementally so value showed up before the budget ran out.",
		outcome:
			"Proof that predictive maintenance doesn't require an enterprise-IoT budget to be worth doing.",
	},
	{
		industry: "Education",
		title: "A semester-load-tested enrollment system",
		challenge:
			"An educational institution's enrollment portal reliably fell over during the first hour registration opened each semester — the exact moment it mattered most.",
		approach:
			"Load testing built around the institution's actual historical traffic spike (not generic benchmarks), queueing under load instead of failing, and a CDN/caching layer for the parts of the flow that didn't need to hit the database at all.",
		outcome:
			"Registration day stopped being an incident-response exercise.",
	},
];

// FAQ (Contact page)
export interface FaqItem {
	question: string;
	answer: string;
}

export const faqs: FaqItem[] = [
	{
		question: "What does a project with Ideacomp typically cost?",
		answer:
			"It depends on scope, but most engagements fall between $10,000 and $100,000+. We'll give you a real range after the first conversation — not a rate card, since a compliance-heavy healthcare integration and a small internal tool cost very differently to build responsibly.",
	},
	{
		question: "How long does a typical project take?",
		answer:
			"Small, well-scoped projects can ship in 4-8 weeks. Larger systems with integrations, compliance requirements, or multiple stakeholders typically run 3-6 months. We'll give you a realistic timeline during discovery, not an optimistic one meant to win the pitch.",
	},
	{
		question: "Do we work directly with the engineers building our project?",
		answer:
			"Yes. You get direct access to the people writing the code, not an account manager relaying updates from a team you never talk to. That's a deliberate part of how we operate, not a premium tier.",
	},
	{
		question: "How do you handle security and compliance requirements?",
		answer:
			"Security review is part of every release cycle, not a step added at the end. For regulated environments (healthcare, government, financial data) we scope compliance requirements during discovery, before architecture decisions are locked in — it's much cheaper to design for compliance than to retrofit it.",
	},
	{
		question: "Can you sign an NDA before we share project details?",
		answer:
			"Yes, as a matter of course for anything involving sensitive data, procurement-stage discussions, or unreleased product plans. Ask during the first conversation and we'll have one over before we go deeper.",
	},
	{
		question: "Do you offer ongoing support after launch, or just delivery?",
		answer:
			"Both. Every project ends with documentation and a support plan your own team can run with — and we offer ongoing support/maintenance engagements for teams who want us to keep operating what we built.",
	},
];

export interface SocialLink {
	name: string;
	href: string;
	icon: ComponentType<{ className?: string; size?: number }>;
}

export const socialLinks: SocialLink[] = [
	{
		name: "GitHub",
		href: "https://github.com/ideacomp",
		icon: Github,
	},
	// LinkedIn: add once we have the real company page URL, e.g.:
	// { name: "LinkedIn", href: "https://linkedin.com/company/ideacomp", icon: Linkedin },
];

export const content = {
	hero: {
		title: "Driven by Ideas",
		subtitle:
			"We engineer software, AI, and infrastructure for organizations that can't afford to gamble on a vendor — across healthcare, government, manufacturing, education, media, and non-profit work.",
		ctaPrimary: {
			href: "/solutions",
		},
		ctaSecondary: {
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
		// No real phone number yet — leave unset rather than ship a fake one.
		// Once available, set it here (e.g. "+420 123 456 789") and the
		// Contact page / footer will start rendering it automatically.
		phone: undefined as string | undefined,
	},
	about: {
		hero: {
			title: "The Team Behind Ideacomp",
			subtitle:
				"Not an abstract \"we\" — a small, senior engineering team that stays close to every project it takes on.",
		},
		team: {
			title: "Who's Building This",
			body: "Ideacomp was founded in 2024 as a small, senior engineering team — by design, not by size. We stay small enough that the people who scope a project are the people who build it, and the people who build it are who you talk to when something needs a decision. As the team grows, that's the one thing we're not willing to trade away.",
		},
		compliance: {
			title: "Security & Compliance",
			body: "Security review runs on every release, not as a pre-launch checklist — see \"How We Work.\" For regulated environments, we scope compliance requirements (GDPR, sector-specific rules) during discovery, before architecture is locked in, and we sign NDAs as a matter of course for sensitive engagements.",
			certificationsNote:
				"We're not yet formally certified against a framework like ISO/IEC 27001 — if that's a hard requirement for your procurement process, tell us early and we'll be straight with you about timeline and fit.",
		},
		caseStudies: {
			title: "The Kind of Work We Do",
			subtitle:
				"Illustrative scenarios representative of our engagements — not real client case studies (no clients are named or quoted here yet). We'll replace these with real, permissioned case studies as they become available.",
		},
	},
	privacy: {
		hero: {
			title: "Privacy Policy",
			subtitle: "Last updated: July 2026.",
		},
	},
};
