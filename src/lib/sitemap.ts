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
import type { Locale } from "@/lib/i18n/dictionaries";

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

// Capability overview data (Home page). `slug` matches a `solutionsData`
// entry so each card can link straight to its section on /solutions.
export interface Capability {
	icon: ComponentType<{ className?: string; size?: number }>;
	title: string;
	description: string;
	slug: string;
}

export const capabilities: Record<Locale, Capability[]> = {
	en: [
		{
			icon: Brain,
			title: "AI & Machine Learning",
			description:
				"We turn operational data into forecasting, automation, and decision-support systems your team can audit and trust.",
			slug: "ai-ml",
		},
		{
			icon: Code,
			title: "Custom Software Development",
			description:
				"Production-grade web and mobile applications, architected for the constraints of your industry, not a generic template.",
			slug: "web-development",
		},
		{
			icon: Braces,
			title: "Outsourcing & Team Augmentation",
			description:
				"Engineers who integrate with your existing workflow and delivery process, so your roadmap keeps moving.",
			slug: "outsourcing",
		},
	],
	cs: [
		{
			icon: Brain,
			title: "AI a strojové učení",
			description:
				"Provozní data proměníme v predikce, automatizaci a systémy pro podporu rozhodování, které váš tým dokáže prověřit a kterým může důvěřovat.",
			slug: "ai-ml",
		},
		{
			icon: Code,
			title: "Vývoj software na míru",
			description:
				"Produkčně nasaditelné webové a mobilní aplikace navržené podle omezení vašeho oboru, ne podle obecné šablony.",
			slug: "web-development",
		},
		{
			icon: Braces,
			title: "Outsourcing a rozšíření týmu",
			description:
				"Inženýři, kteří se začlení do vašich stávajících procesů a workflow, aby se váš roadmap nezastavil.",
			slug: "outsourcing",
		},
	],
};

// Delivery process (Home page — the one legitimate numbered sequence)
export interface ProcessStep {
	step: string;
	title: string;
	description: string;
}

export const processSteps: Record<Locale, ProcessStep[]> = {
	en: [
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
	],
	cs: [
		{
			step: "01",
			title: "Analýza a architektura",
			description:
				"Nejprve zmapujeme vaše limity — compliance, integrace, škálování, stávající systémy — dřív, než napíšeme jediný řádek kódu.",
		},
		{
			step: "02",
			title: "Vývoj s otevřenými kartami",
			description:
				"Iterativní dodávky s funkčním software brzy a přímým přístupem k inženýrům, kteří ho stavějí — ne k account manažerovi předávajícímu informace z druhé ruky.",
		},
		{
			step: "03",
			title: "Bezpečnost a kontrola kvality",
			description:
				"Code review, bezpečnostní testování a kontrola compliance jsou součástí každého release cyklu, ne dodatečně přišroubovaný krok na konci.",
		},
		{
			step: "04",
			title: "Nasazení a podpora",
			description:
				"Produkční nasazení s monitoringem, dokumentací a plánem podpory, který dokáže provozovat i váš vlastní tým.",
		},
	],
};

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

export const solutionsData: Record<Locale, Solution[]> = {
	en: [
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
				src: "/ai-solution.jpg",
				alt: "Illustration of an automation workflow connecting a form trigger, data filter, CRM update, and notification steps",
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
				src: "/cybersecurity-solution.jpg",
				alt: "Illustration of a security operations dashboard showing alert counts and a recent security events log",
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
				src: "/web-solutions.jpg",
				alt: "Illustration of a responsive marketing website displayed across desktop, tablet, and mobile screens",
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
				src: "/outsourcing-solution.jpg",
				alt: "Illustration of a support ticket queue alongside a ticket detail and resolution panel",
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
				src: "/mobile-solution.jpg",
				alt: "Illustration of a mobile app design tool showing two connected phone screen mockups",
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
				src: "/cloud-solution.jpg",
				alt: "Illustration of a cloud infrastructure dashboard showing server, database, storage, and cost panels",
			},
		},
	],
	cs: [
		{
			slug: "ai-ml",
			diagram: "ai-ml",
			icon: Brain,
			title: "AI a strojové učení",
			description:
				"Chytrá řešení, která proměňují komplexní a nepřehledná data v rozhodnutí, za kterými si váš tým může stát.",
			detailedDescription:
				"Navrhujeme a nasazujeme systémy AI a strojového učení, které proměňují provozní data v predikce, automatizaci procesů a podporu rozhodování — vysvětlitelné a auditovatelné, ne černou skříňku přišroubovanou k vašemu stacku.",
			features: [
				{
					name: "Prediktivní analytika",
					description:
						"Predikční modely trénované na vašich vlastních provozních datech, navržené pro měřitelná obchodní rozhodnutí.",
				},
				{
					name: "Analýza procesů",
					description:
						"Instrumentace a analytické pipeline, které odhalí, kde workflow skutečně ztrácí čas nebo peníze.",
				},
				{
					name: "Automatizace procesů",
					description:
						"Automatizace, která odstraní opakující se ruční práci, aniž by člověku vzala možnost výsledek zkontrolovat a zasáhnout.",
				},
			],
			image: {
				src: "/ai-solution.jpg",
				alt: "Ilustrace automatizovaného workflow propojujícího spuštění formuláře, filtr dat, aktualizaci CRM a odeslání notifikace",
			},
		},
		{
			slug: "cybersecurity",
			diagram: "cybersecurity",
			icon: Shield,
			title: "Kybernetická bezpečnost",
			description:
				"Ochrana vašich systémů a dat s bezpečností zabudovanou do dodávky, ne auditovanou dodatečně.",
			detailedDescription:
				"Navrhujeme, nasazujeme a spravujeme bezpečnostní programy, které chrání vaši infrastrukturu a data, udržují vás připravené na audit a obstojí pod regulatorním dohledem ve zdravotnictví, státní správě i podnikovém prostředí.",
			features: [
				{
					name: "Firewall a síťový perimetr",
					description:
						"Nasazení Sophos, Fortinet a Palo Alto nakonfigurovaná a spravovaná podle vašeho skutečného síťového provozu, ne podle výchozích nastavení.",
				},
				{
					name: "Bezpečnostní audity",
					description:
						"Audity zabezpečení sítě a aplikací, které identifikují reálná rizika a určí priority oprav podle dopadu.",
				},
				{
					name: "Reakce na incidenty",
					description:
						"Plány reakce a postupy připravené předem, aby zvládnutí incidentu byl postup podle plánu, ne panika.",
				},
			],
			image: {
				src: "/cybersecurity-solution.jpg",
				alt: "Ilustrace dashboardu bezpečnostního dohledu se zobrazením počtu upozornění a logu nedávných bezpečnostních událostí",
			},
		},
		{
			slug: "web-development",
			diagram: "web-dev",
			icon: Code,
			title: "Vývoj webových aplikací na míru",
			description:
				"Vývoj webových řešení v celém cyklu, od architektury přes nasazení až po údržbu.",
			detailedDescription:
				"Stavíme moderní, škálovatelné webové aplikace od začátku do konce — architekturu, frontend, backend i infrastrukturu, na které běží — s technologiemi, které odpovídají vašim požadavkům, ne těmi, které jsou zrovna v módě.",
			features: [
				{
					name: "Frontend vývoj",
					description:
						"Rozhraní v React a Next.js navržená s ohledem na přístupnost a výkon, ne jen na pixelovou přesnost návrhu.",
				},
				{
					name: "Backend a API architektura",
					description:
						"Backendy v Node.js, Pythonu a Go s API kontrakty navrženými tak, aby přežily i první integraci, která je používá.",
				},
				{
					name: "Responzivní a progresivní webové aplikace",
					description:
						"Rozhraní navržená pro každou velikost obrazovky a kvalitu připojení, včetně PWA fungujících i offline.",
				},
			],
			image: {
				src: "/web-solutions.jpg",
				alt: "Ilustrace responzivního marketingového webu zobrazeného na desktopu, tabletu a mobilu",
			},
		},
		{
			slug: "outsourcing",
			diagram: "outsourcing",
			icon: Braces,
			title: "Outsourcing a rozšíření týmu",
			description:
				"Přístup ke zkušeným inženýrům, kteří se zapojí do vašeho stávajícího workflow.",
			detailedDescription:
				"Rozšiřte svou dodávkovou kapacitu o inženýry, kteří se integrují do vašich stávajících nástrojů, standardů a tempa práce — reportují do vašeho procesu, ne že by vedli paralelní.",
			features: [
				{
					name: "Helpdesk a podpora koncových uživatelů",
					description:
						"Pohotová podpora první a druhé úrovně, díky které se vaše interní týmy nikdy nezaseknou.",
				},
				{
					name: "Správa sítě",
					description:
						"Průběžný monitoring a správa vaší síťové infrastruktury, včetně nástrojů postavených na ManageEngine.",
				},
				{
					name: "Správa serverů",
					description:
						"Proaktivní údržba a monitoring, díky kterým se problémy infrastruktury odhalí dřív, než se stanou výpadkem.",
				},
			],
			image: {
				src: "/outsourcing-solution.jpg",
				alt: "Ilustrace fronty podpůrných tiketů spolu s panelem detailu a řešení tiketu",
			},
		},
		{
			slug: "mobile-development",
			diagram: "mobile",
			icon: Smartphone,
			title: "Vývoj mobilních aplikací",
			description:
				"Nativní i cross-platform aplikace navržené pro reálné použití, ne jen na ukázku.",
			detailedDescription:
				"Stavíme výkonné mobilní aplikace pro iOS a Android a pro každý projekt volíme nativní nebo cross-platform přístup podle výkonu, rozpočtu a dosahu — ne podle univerzálního výchozího řešení.",
			features: [
				{
					name: "Nativní vývoj",
					description:
						"iOS a Android postavené nativně tam, kde to výkon nebo integrace s platformou skutečně vyžadují.",
				},
				{
					name: "Cross-platform aplikace",
					description:
						"React Native a Flutter pro efektivní dodávku napříč platformami bez zdvojování vývojářského úsilí.",
				},
				{
					name: "Funkčnost offline-first",
					description:
						"Práce s daty založená primárně na lokálním úložišti, aby aplikace zůstala použitelná v terénu, ve sklepě nemocnice nebo na hale továrny.",
				},
			],
			image: {
				src: "/mobile-solution.jpg",
				alt: "Ilustrace nástroje pro návrh mobilní aplikace se dvěma propojenými maketami obrazovek telefonu",
			},
		},
		{
			slug: "cloud-devops",
			diagram: "cloud-devops",
			icon: Cloud,
			title: "Cloud a DevOps",
			description:
				"Infrastruktura a automatizace pro systémy, které musí zůstat v provozu.",
			detailedDescription:
				"Navrhujeme a provozujeme cloudovou infrastrukturu a dodávkové pipeline tak, aby se vaše aplikace předvídatelně škálovaly, automaticky zotavovaly z výpadků a nasazovaly bez dramat.",
			features: [
				{
					name: "Cloudová infrastruktura",
					description:
						"Prostředí AWS, Azure a Google Cloud definovaná jako kód a dimenzovaná podle vaší skutečné zátěže.",
				},
				{
					name: "Kontejnerizace",
					description:
						"Orchestrace pomocí Dockeru a Kubernetes pro zátěže, které potřebují horizontální škálování a automatické zotavení.",
				},
				{
					name: "CI/CD automatizace",
					description:
						"Nasazovací pipeline s automatizovanými testovacími branami, díky kterým není nasazení v pátek riziko.",
				},
			],
			image: {
				src: "/cloud-solution.jpg",
				alt: "Ilustrace dashboardu cloudové infrastruktury se zobrazením serverů, databáze, úložiště a nákladových panelů",
			},
		},
	],
};

// Industries data
export interface Industry {
	name: string;
	icon: ComponentType<{ className?: string; size?: number }>;
	description: string;
}

export const industries: Record<Locale, Industry[]> = {
	en: [
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
	],
	cs: [
		{
			name: "Zdravotnictví",
			icon: Stethoscope,
			description: "Systémy postavené s ohledem na citlivost pacientských dat a požadavky na klinickou dostupnost.",
		},
		{
			name: "Vzdělávání",
			icon: GraduationCap,
			description: "Platformy, které obstojí při semestrálních špičkách provozu a dlouhých zadávacích cyklech.",
		},
		{
			name: "Výroba",
			icon: Factory,
			description: "Integrace se systémy výrobní haly a automatizace procesů, které nesnesou výpadek.",
		},
		{
			name: "Veřejná správa",
			icon: Landmark,
			description: "Auditovatelná dodávka postavená na compliance, odpovídající standardům odpovědnosti ve veřejném sektoru.",
		},
		{
			name: "Média a zábava",
			icon: Clapperboard,
			description: "Obsahové a streamovací platformy navržené pro špičky provozu a komplexní licenční práva.",
		},
		{
			name: "Neziskový sektor",
			icon: HeartHandshake,
			description: "Úsporné, udržitelné systémy dimenzované na reálné rozpočty a reálná provozní omezení.",
		},
	],
};

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

export const caseStudies: Record<Locale, CaseStudy[]> = {
	en: [
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
	],
	cs: [
		{
			industry: "Zdravotnictví",
			title: "Migrace do cloudu bez výpadku dostupné pro pacienty",
			challenge:
				"Poskytovatel zdravotní péče potřeboval přesunout starší systém plánování z dosluhujících on-premise serverů, aniž by přerušil klinický provoz nebo ohrozil pacientská data během přechodu.",
			approach:
				"Fázovaná migrace se stínovým prostředím běžícím paralelně, automatizované kontroly integrity dat před každým krokem přechodu a plán zvratu odzkoušený dřív, než byl vůbec potřeba.",
			outcome:
				"Migrace, u které úspěch znamená, že si po ní nikdo na druhé straně ničeho nevšimne.",
		},
		{
			industry: "Veřejná správa",
			title: "Platforma pro správu případů připravená na audit",
			challenge:
				"Instituce veřejného sektoru potřebovala systém pro správu případů, kde musela být každá akce dohledatelná pro účely compliance kontroly, aniž by to zpomalilo referenty, kteří s ním pracují denně.",
			approach:
				"Neměnné auditní logování zabudované do datové vrstvy hned od začátku (ne přidané dodatečně), spolu s řízením přístupu na základě rolí namapovaným přímo na existující schvalovací proces organizace.",
			outcome:
				"Každou změnu záznamu lze zpětně rekonstruovat — auditní stopa je vedlejším produktem architektury, ne samostatnou reportovací agendou.",
		},
		{
			industry: "Výroba",
			title: "Prediktivní údržba v rozpočtu výrobní haly",
			challenge:
				"Výrobce chtěl snížit neplánované výpadky způsobené poruchami zařízení, ale nedokázal zdůvodnit plnohodnotnou průmyslovou IoT platformu pro jedinou výrobní linku.",
			approach:
				"Úsporná pipeline pro senzorová data a predikční model zaměřený jen na tu hrstku poruch, na kterých skutečně záleželo, nasazený postupně tak, aby se přínos projevil dřív, než dojde rozpočet.",
			outcome:
				"Důkaz, že prediktivní údržba nemusí vyžadovat rozpočet na úrovni podnikového IoT, aby se vyplatila.",
		},
		{
			industry: "Vzdělávání",
			title: "Zápisový systém prověřený semestrální zátěží",
			challenge:
				"Zápisový portál vzdělávací instituce spolehlivě padal během první hodiny po otevření registrace každý semestr — přesně v okamžiku, kdy na tom nejvíc záleželo.",
			approach:
				"Zátěžové testování postavené na skutečné historické špičce provozu instituce (ne na obecných benchmarcích), řazení do fronty při zátěži místo pádu a CDN/cache vrstva pro části procesu, které vůbec nepotřebovaly zasahovat do databáze.",
			outcome:
				"Den zápisu přestal být cvičením v řešení incidentů.",
		},
	],
};

// FAQ (Contact page)
export interface FaqItem {
	question: string;
	answer: string;
}

export const faqs: Record<Locale, FaqItem[]> = {
	en: [
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
	],
	cs: [
		{
			question: "Kolik obvykle stojí projekt s Ideacomp?",
			answer:
				"Záleží na rozsahu, ale většina zakázek se pohybuje mezi 10 000 a 100 000+ USD. Reálný odhad vám dáme po prvním rozhovoru — ne podle ceníku, protože integrace ve zdravotnictví s vysokými nároky na compliance a malý interní nástroj se odpovědně staví za úplně jinou cenu.",
		},
		{
			question: "Jak dlouho typický projekt trvá?",
			answer:
				"Malé, dobře vymezené projekty lze dodat za 4–8 týdnů. Větší systémy s integracemi, požadavky na compliance nebo více zainteresovanými stranami obvykle běží 3–6 měsíců. Reálný harmonogram dostanete během úvodní analýzy, ne optimistický odhad, který má jen vyhrát zakázku.",
		},
		{
			question: "Pracujeme přímo s inženýry, kteří projekt staví?",
			answer:
				"Ano. Máte přímý přístup k lidem, kteří píšou kód, ne k account manažerovi předávajícímu informace od týmu, se kterým nikdy nemluvíte. Je to záměrná součást toho, jak pracujeme, ne prémiová varianta.",
		},
		{
			question: "Jak řešíte požadavky na bezpečnost a compliance?",
			answer:
				"Bezpečnostní kontrola je součástí každého release cyklu, ne krok přidaný na konci. U regulovaných prostředí (zdravotnictví, státní správa, finanční data) vymezíme požadavky na compliance už během úvodní analýzy, dřív, než se uzamknou architektonická rozhodnutí — navrhnout systém pro compliance je mnohem levnější než ji dodělávat dodatečně.",
		},
		{
			question: "Můžete podepsat NDA, než sdílíme detaily projektu?",
			answer:
				"Ano, standardně u všeho, co zahrnuje citlivá data, jednání ve fázi výběrového řízení nebo nezveřejněné produktové plány. Řekněte si o něj během prvního rozhovoru a než půjdeme do hloubky, budeme ho mít podepsaný.",
		},
		{
			question: "Nabízíte podporu i po spuštění, nebo jen samotnou dodávku?",
			answer:
				"Obojí. Každý projekt končí dokumentací a plánem podpory, se kterým dokáže pracovat i váš vlastní tým — a pro týmy, které chtějí, abychom postavené řešení dál provozovali, nabízíme i průběžnou podporu a údržbu.",
		},
	],
};

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

export const content: Record<Locale, {
	hero: {
		title: string;
		subtitle: string;
		ctaPrimary: { href: string };
		ctaSecondary: { href: string };
	};
	home: {
		capabilities: { title: string; subtitle: string };
		process: { title: string; subtitle: string };
		industries: { title: string; subtitle: string };
		finalCta: { title: string; subtitle: string; cta: { href: string } };
	};
	solutions: {
		hero: { title: string; subtitle: string };
		industries: { title: string; subtitle: string };
		finalCta: { title: string; subtitle: string; cta: { href: string } };
	};
	contact: {
		hero: { title: string; subtitle: string };
		phone: string | undefined;
	};
	about: {
		hero: { title: string; subtitle: string };
		team: { title: string; body: string };
		compliance: { title: string; body: string; certificationsNote: string };
		caseStudies: { title: string; subtitle: string };
	};
	privacy: {
		hero: { title: string; subtitle: string };
	};
}> = {
	en: {
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
			phone: undefined,
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
	},
	cs: {
		hero: {
			title: "Driven by Ideas",
			subtitle:
				"Vyvíjíme software, AI a infrastrukturu pro organizace, které si nemohou dovolit hazardovat s dodavatelem — ve zdravotnictví, veřejné správě, výrobě, vzdělávání, médiích i neziskovém sektoru.",
			ctaPrimary: {
				href: "/solutions",
			},
			ctaSecondary: {
				href: "/contact",
			},
		},
		home: {
			capabilities: {
				title: "Kde stavíme",
				subtitle:
					"Tři oblasti, jeden standard dodávky.",
			},
			process: {
				title: "Jak pracujeme",
				subtitle:
					"Dodávkový proces navržený pro organizace, které musí každé rozhodnutí umět obhájit před vlastními zainteresovanými stranami.",
			},
			industries: {
				title: "Odvětví, kterým sloužíme",
				subtitle:
					"Omezení specifická pro daný obor, ne obecný playbook.",
			},
			finalCta: {
				title: "Připraveni stavět něco, co musí fungovat?",
				subtitle:
					"Řekněte nám, co stavíte a čemu to musí odolat. Upřímně vám řekneme, jestli jsme na to ten správný tým.",
				cta: {
					href: "/contact",
				},
			},
		},
		solutions: {
			hero: {
				title: "Naše řešení",
				subtitle:
					"Šest oblastí, použitých společně nebo samostatně, podle toho, co problém skutečně potřebuje.",
			},
			industries: {
				title: "Odvětví, kterým sloužíme",
				subtitle:
					"Naše expertíza pokrývá zdravotnictví, vzdělávání, výrobu, veřejnou správu, média i neziskový sektor — každé s vlastními omezeními, podle kterých navrhujeme.",
			},
			finalCta: {
				title: "Připraveni proměnit vaše podnikání?",
				subtitle:
					"Pojďme probrat, jak vám naše řešení pomohou dosáhnout vašich cílů a přinést inovaci do vašeho oboru.",
				cta: {
					href: "/contact",
				},
			},
		},
		contact: {
			hero: {
				title: "Postavme něco, co obstojí",
				subtitle:
					"Řekněte nám o svém projektu. Odpovíme do jednoho pracovního dne.",
			},
			phone: undefined,
		},
		about: {
			hero: {
				title: "Tým za Ideacomp",
				subtitle:
					"Ne abstraktní \"my\" — malý, seniorní vývojářský tým, který zůstává v kontaktu s každým projektem, který přijme.",
			},
			team: {
				title: "Kdo to staví",
				body: "Ideacomp byl založen v roce 2024 jako malý, seniorní vývojářský tým — záměrně, ne z nedostatku velikosti. Zůstáváme dost malí na to, aby lidé, kteří projekt vymezují, byli i těmi, kdo ho staví, a aby lidé, kteří ho staví, byli těmi, s kým mluvíte, když je potřeba rozhodnutí. S růstem týmu je tohle jediná věc, kterou nejsme ochotni obětovat.",
			},
			compliance: {
				title: "Bezpečnost a compliance",
				body: "Bezpečnostní kontrola probíhá u každého vydání, ne jako checklist před spuštěním — viz \"Jak pracujeme\". U regulovaných prostředí vymezíme požadavky na compliance (GDPR, oborová pravidla) už během úvodní analýzy, dřív, než se uzamkne architektura, a u citlivých zakázek standardně podepisujeme NDA.",
				certificationsNote:
					"Zatím nemáme formální certifikaci podle rámce jako ISO/IEC 27001 — pokud je to pro váš výběrový proces tvrdý požadavek, řekněte nám to včas a budeme k vám upřímní ohledně harmonogramu a vhodnosti spolupráce.",
			},
			caseStudies: {
				title: "Jaký typ práce děláme",
				subtitle:
					"Ilustrativní scénáře reprezentující naše zakázky — ne skutečné případové studie klientů (žádný klient zde zatím není jmenován ani citován). Jakmile to bude možné, nahradíme je skutečnými případovými studiemi se souhlasem klienta.",
			},
		},
		privacy: {
			hero: {
				title: "Zásady ochrany osobních údajů",
				subtitle: "Poslední aktualizace: červenec 2026.",
			},
		},
	},
};
