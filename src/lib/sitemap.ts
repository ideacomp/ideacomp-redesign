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
				"Provozní data proměníme v předpovědi, automatizaci a podporu rozhodování — v systémy, které si váš tým může sám ověřit, a proto jim může věřit.",
			slug: "ai-ml",
		},
		{
			icon: Code,
			title: "Vývoj softwaru na míru",
			description:
				"Produkčně nasaditelné webové a mobilní aplikace navržené podle omezení vašeho oboru, ne podle obecné šablony.",
			slug: "web-development",
		},
		{
			icon: Braces,
			title: "Outsourcing a rozšíření týmu",
			description:
				"Inženýři, kteří se zapojí do vašich stávajících procesů a nástrojů, aby se vývoj nezastavil.",
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
				"Nejdřív zmapujeme vaše omezení — compliance, integrace, škálování, stávající systémy — a teprve pak napíšeme první řádek kódu.",
		},
		{
			step: "02",
			title: "Vývoj s otevřenými kartami",
			description:
				"Iterativní dodávky: funkční software vidíte brzy a mluvíte přímo s inženýry, kteří ho vyvíjejí — ne s account manažerem, který informace jen předává dál.",
		},
		{
			step: "03",
			title: "Bezpečnost a kontrola kvality",
			description:
				"Code review, bezpečnostní testování a kontrola compliance patří ke každému vydání — nejsou to kroky přidané narychlo na konec.",
		},
		{
			step: "04",
			title: "Nasazení a podpora",
			description:
				"Produkční nasazení s monitoringem, dokumentací a plánem podpory, který dokáže provozovat i váš vlastní tým.",
		},
	],
};

/**
 * A site we built and shipped, shown in `<ReferenceShowcase>` on the home page.
 *
 * This is the first genuinely earned proof on the site — everything else either
 * describes capability (`solutionsData`) or is explicitly illustrative
 * (`caseStudies`). PRODUCT.md forbids fabricated proof, not proof; the bar for
 * anything added here is that we built it and it is publicly reachable.
 */
export interface ReferenceProject {
	/** Matches `public/portfolio/<slug>.jpg`, so a capture and the record that
	 *  points at it cannot drift apart — same rule as the /solutions panels.
	 *  It is also the per-site key in `docs/portfolio/capture.mjs`. */
	slug: string;
	name: string;
	/** The live site. Opens in a new tab. */
	href: string;
	/** Bare host — the visible half of the link, set in mono under the rule. */
	domain: string;
	/** A hero capture from `docs/portfolio/capture.mjs`. 16:10, in the site's
	 *  own colour; see docs/photo-sources.md before replacing one. */
	image: {
		src: string;
		alt: string;
	};
}

/**
 * Names and domains are identical in both locales — only `alt` is translated.
 * The duplication is deliberate: it keeps the shape identical to every other
 * collection here, so TypeScript catches a locale that falls behind.
 */
export const references: Record<Locale, ReferenceProject[]> = {
	en: [
		{
			slug: "autoskola-necas",
			name: "Autoškola Nečas",
			href: "https://www.autoskolanecas.cz",
			domain: "autoskolanecas.cz",
			image: {
				src: "/portfolio/autoskola-necas.jpg",
				alt: "Home page of autoskolanecas.cz: a dark hero with a motorcyclist cornering on a mountain road, the headline Řiď svou budoucnost, and course and contact buttons",
			},
		},
		{
			slug: "spf-group",
			name: "SPF Group",
			href: "https://www.spfgroup.org",
			domain: "spfgroup.org",
			image: {
				src: "/portfolio/spf-group.jpg",
				alt: "Home page of spfgroup.org: a deep blue hero over a meeting-room photograph, the headline Plánujeme budoucnost, která dává smysl, and a row of consulting-field tags",
			},
		},
		{
			slug: "acord",
			name: "ACoRD CZ",
			href: "https://acord-redesign.vercel.app",
			domain: "acord-redesign.vercel.app",
			image: {
				src: "/portfolio/acord.jpg",
				alt: "Home page of the ACoRD CZ redesign: a dark green hero headlined Sociální služby v území, beside a panel of figures for projects delivered, regions covered, and period",
			},
		},
		{
			slug: "artiphy",
			name: "Artiphy.ai",
			href: "https://artiphy-ai.vercel.app",
			domain: "artiphy-ai.vercel.app",
			image: {
				src: "/portfolio/artiphy.jpg",
				alt: "Home page of artiphy-ai.vercel.app: a full-bleed portrait photograph behind the headline Create beyond imagination, with translucent feature cards down the right",
			},
		},
	],
	cs: [
		{
			slug: "autoskola-necas",
			name: "Autoškola Nečas",
			href: "https://www.autoskolanecas.cz",
			domain: "autoskolanecas.cz",
			image: {
				src: "/portfolio/autoskola-necas.jpg",
				alt: "Úvodní stránka autoskolanecas.cz: tmavá hlavička s motorkářem v zatáčce horské silnice, nadpisem Řiď svou budoucnost a tlačítky na kurzy a kontakt",
			},
		},
		{
			slug: "spf-group",
			name: "SPF Group",
			href: "https://www.spfgroup.org",
			domain: "spfgroup.org",
			image: {
				src: "/portfolio/spf-group.jpg",
				alt: "Úvodní stránka spfgroup.org: tmavě modrá hlavička nad fotografií jednací místnosti, nadpis Plánujeme budoucnost, která dává smysl, a řada štítků s obory poradenství",
			},
		},
		{
			slug: "acord",
			name: "ACoRD CZ",
			href: "https://acord-redesign.vercel.app",
			domain: "acord-redesign.vercel.app",
			image: {
				src: "/portfolio/acord.jpg",
				alt: "Úvodní stránka redesignu ACoRD CZ: tmavě zelená hlavička s nadpisem Sociální služby v území a panelem s počtem projektů, krajů a obdobím",
			},
		},
		{
			slug: "artiphy",
			name: "Artiphy.ai",
			href: "https://artiphy-ai.vercel.app",
			domain: "artiphy-ai.vercel.app",
			image: {
				src: "/portfolio/artiphy.jpg",
				alt: "Úvodní stránka artiphy-ai.vercel.app: přes celou plochu portrétní fotografie za nadpisem Create beyond imagination, vpravo poloprůhledné karty s funkcemi",
			},
		},
	],
};

// Solutions data (the required "Our Solutions" content)
export interface Solution {
	slug: string;
	icon: ComponentType<{ className?: string; size?: number }>;
	title: string;
	description: string;
	detailedDescription: string;
	features: {
		name: string;
		description: string;
	}[];
	/** A generated panel from `docs/diagrams/`, rendered through `<FramedImage>`
	 *  in its own colour — the panel supplies the palette itself, nothing tints
	 *  it. It shows this slot's three `features`; see docs/photo-sources.md
	 *  before changing one. */
	image: {
		src: string;
		alt: string;
	};
}

export const solutionsData: Record<Locale, Solution[]> = {
	en: [
		{
			slug: "ai-ml",
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
				src: "/solutions/ai-ml.png",
				alt: "Forecasting panel: a demand curve of actual figures continues past a “now” marker as a dashed forecast inside an 80% confidence band, beside a ranked list of the drivers behind it and an automated reorder held open for human review",
			},
		},
		{
			slug: "cybersecurity",
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
				src: "/solutions/cybersecurity.png",
				alt: "Security console: traffic passes from the internet through a firewall of 412 deny-by-default rules into a DMZ and then a segmented internal network, beside assessment findings ranked by impact and an incident runbook running from detect to recover",
			},
		},
		{
			slug: "web-development",
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
				src: "/solutions/web-development.png",
				alt: "The same interface laid out at desktop, tablet and phone widths — three columns collapsing to one, with an “offline ready” badge on the phone — above the versioned API endpoints and response times that serve all three",
			},
		},
		{
			slug: "outsourcing",
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
				src: "/solutions/outsourcing.png",
				alt: "Operations board in three columns: a helpdesk column with 18 open tickets and their time to SLA breach, a network column showing 99.98% link availability across four connected sites, and a server column tracking 126 managed hosts, patch state and verified backups",
			},
		},
		{
			slug: "mobile-development",
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
				src: "/solutions/mobile-development.png",
				alt: "One shared codebase branching into two handsets, iOS and Android, both running the same work-order screen with three items queued offline, beside a note that camera, Bluetooth and background sync run natively",
			},
		},
		{
			slug: "cloud-devops",
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
				src: "/solutions/cloud-devops.png",
				alt: "Deployment pipeline running commit, build, test, stage and production, with the test stage held open as a gate that must pass, above six healthy container replicas and infrastructure declared in code across dev, stage and production",
			},
		},
	],
	cs: [
		{
			slug: "ai-ml",
			icon: Brain,
			title: "AI a strojové učení",
			description:
				"Chytrá řešení, která ze složitých a nepřehledných dat udělají rozhodnutí, za kterými si váš tým může stát.",
			detailedDescription:
				"Navrhujeme a nasazujeme systémy AI a strojového učení, které proměňují provozní data v předpovědi, automatizaci procesů a podporu rozhodování — vysvětlitelné a auditovatelné, ne černou skříňku přilepenou na váš stávající systém.",
			features: [
				{
					name: "Prediktivní analytika",
					description:
						"Predikční modely natrénované na vašich vlastních provozních datech, stavěné pro měřitelná obchodní rozhodnutí.",
				},
				{
					name: "Analýza procesů",
					description:
						"Měření a analytické pipeline, které odhalí, kde proces doopravdy ztrácí čas nebo peníze.",
				},
				{
					name: "Automatizace procesů",
					description:
						"Automatizace, která odstraní opakující se ruční práci, aniž by člověku vzala možnost výsledek zkontrolovat a zasáhnout.",
				},
			],
			image: {
				src: "/solutions/ai-ml.png",
				alt: "Predikční panel: křivka skutečné poptávky pokračuje za značkou „now“ čárkovanou předpovědí uvnitř 80% intervalu spolehlivosti, vedle seřazeného seznamu faktorů, které ji ovlivňují, a automatické doobjednávky pozdržené ke schválení člověkem",
			},
		},
		{
			slug: "cybersecurity",
			icon: Shield,
			title: "Kybernetická bezpečnost",
			description:
				"Ochrana vašich systémů a dat. Bezpečnost je součástí vývoje, ne až dodatečného auditu.",
			detailedDescription:
				"Navrhujeme, nasazujeme a spravujeme bezpečnostní opatření, která chrání vaši infrastrukturu i data, drží vás připravené na audit a obstojí i při kontrole regulátora — ve zdravotnictví, ve státní správě i ve velkých firmách.",
			features: [
				{
					name: "Firewall a síťový perimetr",
					description:
						"Řešení Sophos, Fortinet a Palo Alto nastavená a spravovaná podle vašeho skutečného síťového provozu, ne podle výchozích hodnot.",
				},
				{
					name: "Bezpečnostní audity",
					description:
						"Audity zabezpečení sítě a aplikací, které odhalí reálná rizika a seřadí opravy podle dopadu.",
				},
				{
					name: "Reakce na incidenty",
					description:
						"Plány reakce a postupy připravené dřív, než incident nastane — aby se pak postupovalo podle plánu, ne v panice.",
				},
			],
			image: {
				src: "/solutions/cybersecurity.png",
				alt: "Bezpečnostní konzole: provoz prochází z internetu firewallem se 412 pravidly v režimu deny-by-default do DMZ a dál do segmentované vnitřní sítě, vedle nálezů z auditu seřazených podle dopadu a postupu pro řešení incidentu od detekce po obnovu",
			},
		},
		{
			slug: "web-development",
			icon: Code,
			title: "Vývoj webových aplikací na míru",
			description:
				"Vývoj webových aplikací v celém cyklu — od architektury přes nasazení až po údržbu.",
			detailedDescription:
				"Stavíme moderní, škálovatelné webové aplikace od začátku do konce — architekturu, frontend, backend i infrastrukturu, na které běží — s technologiemi, které odpovídají vašim požadavkům, ne těmi, které jsou zrovna v módě.",
			features: [
				{
					name: "Frontend vývoj",
					description:
						"Rozhraní v Reactu a Next.js navržená s ohledem na přístupnost a výkon, ne jen na pixelovou přesnost návrhu.",
				},
				{
					name: "Backend a API architektura",
					description:
						"Backendy v Node.js, Pythonu a Go s API kontrakty navrženými tak, aby vydržely déle než první integrace, která je použije.",
				},
				{
					name: "Responzivní a progresivní webové aplikace",
					description:
						"Rozhraní navržená pro každou velikost obrazovky a kvalitu připojení, včetně PWA fungujících i offline.",
				},
			],
			image: {
				src: "/solutions/web-development.png",
				alt: "Totéž rozhraní v šířce desktopu, tabletu a telefonu — tři sloupce se skládají do jednoho a na telefonu svítí štítek „offline ready“ — nad verzovanými API endpointy a dobami odezvy, které obsluhují všechna tři zařízení",
			},
		},
		{
			slug: "outsourcing",
			icon: Braces,
			title: "Outsourcing a rozšíření týmu",
			description:
				"Zkušení inženýři, kteří se zapojí do vašeho zavedeného způsobu práce.",
			detailedDescription:
				"Rozšiřte svou vývojovou kapacitu o inženýry, kteří se přizpůsobí vašim nástrojům, standardům i tempu práce — zapojí se do vašeho procesu, místo aby vedli vlastní paralelní.",
			features: [
				{
					name: "Helpdesk a podpora koncových uživatelů",
					description:
						"Pohotová podpora první a druhé úrovně, díky které se vaše interní týmy nezaseknou.",
				},
				{
					name: "Správa sítě",
					description:
						"Průběžný dohled a správa vaší síťové infrastruktury, včetně nástrojů postavených na ManageEngine.",
				},
				{
					name: "Správa serverů",
					description:
						"Preventivní údržba a dohled, díky kterým se problémy v infrastruktuře odhalí dřív, než z nich bude výpadek.",
				},
			],
			image: {
				src: "/solutions/outsourcing.png",
				alt: "Provozní nástěnka ve třech sloupcích: helpdesk s 18 otevřenými tickety a časem do porušení SLA, síť s 99,98% dostupností linek ve čtyřech propojených lokalitách a servery se 126 spravovanými stroji, stavem záplat a ověřenými zálohami",
			},
		},
		{
			slug: "mobile-development",
			icon: Smartphone,
			title: "Vývoj mobilních aplikací",
			description:
				"Nativní i multiplatformní aplikace stavěné pro reálný provoz, ne jen na ukázku.",
			detailedDescription:
				"Vyvíjíme výkonné mobilní aplikace pro iOS a Android. U každého projektu volíme mezi nativním a multiplatformním přístupem podle výkonu, rozpočtu a dosahu — ne podle jednoho univerzálního receptu.",
			features: [
				{
					name: "Nativní vývoj",
					description:
						"iOS a Android postavené nativně tam, kde to výkon nebo integrace s platformou skutečně vyžadují.",
				},
				{
					name: "Multiplatformní aplikace",
					description:
						"React Native a Flutter pro efektivní vývoj napříč platformami bez zdvojené práce.",
				},
				{
					name: "Provoz i bez připojení",
					description:
						"Data se drží primárně v zařízení, aby aplikace fungovala i v terénu, v suterénu nemocnice nebo ve výrobní hale.",
				},
			],
			image: {
				src: "/solutions/mobile-development.png",
				alt: "Jedna sdílená kódová základna se větví do dvou telefonů, iOS a Androidu, na obou běží tatáž obrazovka pracovního příkazu se třemi položkami ve frontě offline, vedle poznámky, že fotoaparát, Bluetooth a synchronizace na pozadí běží nativně",
			},
		},
		{
			slug: "cloud-devops",
			icon: Cloud,
			title: "Cloud a DevOps",
			description:
				"Infrastruktura a automatizace pro systémy, které musí zůstat v provozu.",
			detailedDescription:
				"Navrhujeme a provozujeme cloudovou infrastrukturu i nasazovací pipeline tak, aby se vaše aplikace předvídatelně škálovaly, samy se zotavily z výpadku a jejich nasazení proběhlo bez dramat.",
			features: [
				{
					name: "Cloudová infrastruktura",
					description:
						"Prostředí AWS, Azure a Google Cloud popsaná kódem a dimenzovaná podle vaší skutečné zátěže.",
				},
				{
					name: "Kontejnerizace",
					description:
						"Orchestrace v Dockeru a Kubernetes pro zátěže, které potřebují horizontální škálování a automatické zotavení.",
				},
				{
					name: "Automatizace CI/CD",
					description:
						"Nasazovací pipeline s automatickými testovacími branami, díky kterým není nasazení v pátek riziko.",
				},
			],
			image: {
				src: "/solutions/cloud-devops.png",
				alt: "Nasazovací pipeline s kroky commit, build, test, stage a produkce, kde je testovací krok bránou, kterou je nutné projít, nad šesti běžícími replikami kontejnerů a infrastrukturou popsanou kódem pro dev, stage i produkci",
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
			description: "Platformy, které ustojí nápor na začátku semestru i dlouhá výběrová řízení.",
		},
		{
			name: "Výroba",
			icon: Factory,
			description: "Integrace se systémy výrobní haly a automatizace procesů, které nesnesou výpadek.",
		},
		{
			name: "Veřejná správa",
			icon: Landmark,
			description: "Dohledatelná dodávka s důrazem na compliance, odpovídající nárokům na odpovědnost ve veřejné správě.",
		},
		{
			name: "Média a zábava",
			icon: Clapperboard,
			description: "Obsahové a streamovací platformy navržené pro nárazové špičky provozu a spletitá licenční práva.",
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
			title: "Migrace do cloudu bez výpadku pro pacienty",
			challenge:
				"Poskytovatel zdravotní péče potřeboval přesunout starší objednávkový systém z dosluhujících vlastních serverů, aniž by přerušil klinický provoz nebo během přechodu ohrozil data pacientů.",
			approach:
				"Migrace po etapách se stínovým prostředím běžícím souběžně, automatické kontroly integrity dat před každým krokem a plán návratu k původnímu stavu nacvičený dřív, než ho bylo vůbec potřeba.",
			outcome:
				"Migrace, u které úspěch znamená, že si nikdo z uživatelů ničeho nevšimne.",
		},
		{
			industry: "Veřejná správa",
			title: "Platforma pro správu případů připravená na audit",
			challenge:
				"Instituce veřejné správy potřebovala systém pro správu případů, ve kterém musí být každý úkon dohledatelný pro účely kontroly, aniž by to zdrželo referenty, kteří s ním pracují denně.",
			approach:
				"Neměnný auditní záznam zabudovaný do datové vrstvy hned od začátku, ne dodělaný později, a řízení přístupu podle rolí navázané přímo na schvalovací proces, který v organizaci už funguje.",
			outcome:
				"Každou změnu záznamu lze zpětně dohledat — auditní stopa vzniká sama z architektury, není to zvláštní agenda navíc.",
		},
		{
			industry: "Výroba",
			title: "Prediktivní údržba v rozpočtu výrobní haly",
			challenge:
				"Výrobce chtěl omezit neplánované prostoje kvůli poruchám strojů, ale investici do plnohodnotné průmyslové IoT platformy kvůli jediné výrobní lince neuměl obhájit.",
			approach:
				"Úsporná pipeline pro data ze senzorů a predikční model zaměřený jen na tu hrstku poruch, na kterých opravdu záleželo, nasazovaný postupně tak, aby se přínos projevil dřív, než dojde rozpočet.",
			outcome:
				"Důkaz, že prediktivní údržba se vyplatí i bez rozpočtu na podnikové IoT.",
		},
		{
			industry: "Vzdělávání",
			title: "Zápisový systém, který ustojí nápor semestru",
			challenge:
				"Zápisový portál školy každý semestr spolehlivě spadl během první hodiny po otevření registrace — přesně v okamžiku, kdy na něm nejvíc záleželo.",
			approach:
				"Zátěžové testy postavené na skutečné historické špičce dané školy, ne na obecných benchmarcích, řazení do fronty místo pádu a CDN s cache pro ty části zápisu, které databázi vůbec nepotřebovaly.",
			outcome:
				"Ze dne zápisu přestalo být hašení požárů.",
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
				"Záleží na rozsahu, ale většina zakázek se pohybuje mezi 10 000 a 100 000 USD i výš. Reálné rozpětí vám řekneme po prvním hovoru — ceník na to nemáme, protože integrace ve zdravotnictví s vysokými nároky na compliance a malý interní nástroj vyjdou při stejně poctivém přístupu úplně jinak.",
		},
		{
			question: "Jak dlouho typický projekt trvá?",
			answer:
				"Malé a dobře vymezené projekty zvládneme dodat za 4–8 týdnů. Větší systémy s integracemi, požadavky na compliance nebo více schvalovateli obvykle běží 3–6 měsíců. Reálný harmonogram dostanete během úvodní analýzy — ne optimistický odhad, který má jen vyhrát zakázku.",
		},
		{
			question: "Pracujeme přímo s inženýry, kteří projekt staví?",
			answer:
				"Ano. Mluvíte přímo s lidmi, kteří píší kód, ne s account manažerem, který jen tlumočí informace od týmu, se kterým se nikdy nepotkáte. Je to záměrná součást toho, jak pracujeme, ne příplatková služba.",
		},
		{
			question: "Jak řešíte požadavky na bezpečnost a compliance?",
			answer:
				"Bezpečnostní kontrola patří ke každému vydání, není to krok přidaný na konec. U regulovaných prostředí (zdravotnictví, státní správa, finanční data) si požadavky na compliance vyjasníme už během úvodní analýzy, dřív než se uzavřou architektonická rozhodnutí — navrhnout systém rovnou podle pravidel vyjde mnohem levněji než ho jim přizpůsobovat dodatečně.",
		},
		{
			question: "Můžete podepsat NDA, než sdílíme detaily projektu?",
			answer:
				"Ano, běžně to tak děláme u všeho, co se týká citlivých dat, jednání ve výběrovém řízení nebo nezveřejněných produktových plánů. Stačí si o něj říct hned při prvním hovoru — než půjdeme do detailů, bude podepsaná.",
		},
		{
			question: "Nabízíte podporu i po spuštění, nebo jen samotnou dodávku?",
			answer:
				"Obojí. Každý projekt končí dokumentací a plánem podpory, se kterým si poradí i váš vlastní tým — a pokud chcete, aby hotové řešení dál provozoval někdo od nás, nabízíme i průběžnou podporu a údržbu.",
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

/**
 * Headings are split into `title` + `accent` because the accent colour falls on
 * the trailing words, and which words those are differs per language — it can't
 * be derived by slicing the string.
 */
interface AccentTitle {
	title: string;
	accent?: string;
}

export const content: Record<Locale, {
	hero: {
		/** Whole headline as one string. Still the source of truth for the
		 *  reduced-motion branch, so it must always read as the full title. */
		title: string;
		/** Smaller, lighter first line of the two-line headline stack. */
		titleLead: string;
		/** Oversized second line. This is the part the typewriter types. */
		titleMain: string;
		/** Short mono line above the headline, paired with a signal hairline. */
		tagline: string;
		subtitle: string;
		/** Hairline datasheet row under the buttons. Real facts only. */
		specs: { label: string; value: string }[];
		ctaPrimary: { href: string };
		ctaSecondary: { href: string };
	};
	home: {
		capabilities: AccentTitle & { subtitle: string; watermark: string };
		references: AccentTitle & {
			subtitle: string;
			watermark: string;
			/** Names the whole showcase for assistive tech. */
			label: string;
		};
		focus: AccentTitle & {
			body: string;
			bodyStrong: string;
			watermark: string;
			cta: { href: string };
			/** Names the carousel for assistive tech. */
			slidesLabel: string;
			slides: { src: string; alt: string; caption: string }[];
		};
		process: AccentTitle & { subtitle: string; watermark: string };
		industries: AccentTitle & { subtitle: string; watermark: string };
		finalCta: AccentTitle & { subtitle: string; cta: { href: string } };
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
			titleLead: "Driven by",
			titleMain: "Ideas",
			tagline: "Custom software engineering — Czech Republic",
			subtitle:
				"We engineer software, AI, and infrastructure for organizations that can't afford to gamble on a vendor — across healthcare, government, manufacturing, education, media, and non-profit work.",
			specs: [
				{ label: "Based in", value: "Czech Republic" },
				{ label: "Founded", value: "2019" },
				{ label: "Disciplines", value: "Six" },
			],
			ctaPrimary: {
				href: "/solutions",
			},
			ctaSecondary: {
				href: "/contact",
			},
		},
		home: {
			capabilities: {
				title: "Where We",
				accent: "Build",
				subtitle:
					"Three disciplines, one delivery standard.",
				watermark: "Disciplines",
			},
			references: {
				title: "Shipped and",
				accent: "Live",
				subtitle: "Four sites we designed, built, and handed over.",
				watermark: "Built",
				label: "Sites built by Ideacomp",
			},
			focus: {
				title: "Engineered to Hold",
				accent: "Weight",
				body: "Most software fails long after the launch demo — when the data grows, the regulation changes, or the person who wrote it leaves. We build for that part. Architecture is documented before it is written, security review runs on every release rather than once before launch, and the system is handed over in a state your own team can operate.",
				bodyStrong:
					"A small, senior team: the people who scope your project are the people who build it.",
				watermark: "Method",
				cta: { href: "/about" },
				slidesLabel: "Ideacomp at GITEX Global, Dubai",
				slides: [
					{
						src: "/gitex-dev-slam.jpg",
						alt: "Ideacomp at GITEX Global in Dubai, in front of the Global Dev Slam stage backdrop showing source code",
						caption: "Global Dev Slam · GITEX Global, Dubai",
					},
					{
						src: "/gitex-main-stage.jpg",
						alt: "The GITEX Global Dubai 2024 main stage entrance, flanked by tall illuminated columns",
						caption: "Main stage · GITEX Global Dubai 2024",
					},
					{
						src: "/gitex-entrance.jpg",
						alt: "The approach to the GITEX Global venue in Dubai, lined with event flags",
						caption: "Venue approach · Dubai World Trade Centre",
					},
					{
						src: "/gitex-signage.jpg",
						alt: "Ideacomp beside the GITEX Global Dubai 2024 signage outside the venue",
						caption: "On site · GITEX Global Dubai 2024",
					},
				],
			},
			process: {
				title: "How We",
				accent: "Work",
				subtitle:
					"A delivery process built for organizations that need to defend every decision to their own stakeholders.",
				watermark: "Process",
			},
			industries: {
				title: "Industries We",
				accent: "Serve",
				subtitle:
					"Domain-specific constraints, not a generic playbook.",
				watermark: "Sectors",
			},
			finalCta: {
				title: "Ready to Build Something That Has to",
				accent: "Work?",
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
				body: "Ideacomp was founded in 2019 as a small, senior engineering team — by design, not by size. We stay small enough that the people who scope a project are the people who build it, and the people who build it are who you talk to when something needs a decision. As the team grows, that's the one thing we're not willing to trade away.",
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
			// The slogan is the brand mark and stays in English in both locales.
			title: "Driven by Ideas",
			titleLead: "Driven by",
			titleMain: "Ideas",
			tagline: "Vývoj softwaru na míru — Česká republika",
			subtitle:
				"Vyvíjíme software, AI a infrastrukturu pro organizace, které si nemohou dovolit riskovat výběr dodavatele — ve zdravotnictví, veřejné správě, výrobě, vzdělávání, médiích i neziskovém sektoru.",
			specs: [
				{ label: "Sídlo", value: "Česká republika" },
				{ label: "Založeno", value: "2019" },
				{ label: "Obory", value: "Šest" },
			],
			ctaPrimary: {
				href: "/solutions",
			},
			ctaSecondary: {
				href: "/contact",
			},
		},
		home: {
			capabilities: {
				title: "Co",
				accent: "vyvíjíme",
				subtitle:
					"Tři obory, jeden standard dodávky.",
				watermark: "Obory",
			},
			references: {
				title: "Hotovo a",
				accent: "v provozu",
				subtitle: "Čtyři weby, které jsme navrhli, postavili a předali.",
				watermark: "Reference",
				label: "Weby, které jsme vytvořili",
			},
			focus: {
				title: "Navržené tak, aby to",
				accent: "uneslo zátěž",
				body: "Většina softwaru se nerozpadne při spouštěcím demu, ale dlouho po něm — když naroste objem dat, změní se regulace nebo odejde člověk, který to napsal. Právě s tímhle obdobím dopředu počítáme. Architekturu popíšeme dřív, než ji napíšeme, bezpečnostní kontrola probíhá u každého vydání, ne jen jednou před spuštěním, a systém předáváme ve stavu, kdy ho zvládne provozovat váš vlastní tým.",
				bodyStrong:
					"Malý, seniorní tým: projekt s vámi navrhují ti samí lidé, kteří ho pak vyvíjejí.",
				watermark: "Metoda",
				cta: { href: "/about" },
				slidesLabel: "Ideacomp na GITEX Global v Dubaji",
				slides: [
					{
						src: "/gitex-dev-slam.jpg",
						alt: "Ideacomp na GITEX Global v Dubaji před scénou Global Dev Slam se zobrazeným zdrojovým kódem",
						caption: "Global Dev Slam · GITEX Global, Dubaj",
					},
					{
						src: "/gitex-main-stage.jpg",
						alt: "Vstup na hlavní pódium GITEX Global Dubai 2024 mezi vysokými osvětlenými sloupy",
						caption: "Hlavní pódium · GITEX Global Dubai 2024",
					},
					{
						src: "/gitex-entrance.jpg",
						alt: "Cesta k areálu GITEX Global v Dubaji lemovaná vlajkami akce",
						caption: "Příchod k areálu · Dubai World Trade Centre",
					},
					{
						src: "/gitex-signage.jpg",
						alt: "Ideacomp u poutače GITEX Global Dubai 2024 před areálem",
						caption: "Na místě · GITEX Global Dubai 2024",
					},
				],
			},
			process: {
				title: "Jak",
				accent: "pracujeme",
				subtitle:
					"Proces dodávky navržený pro organizace, které musí každé rozhodnutí obhájit před vlastním vedením.",
				watermark: "Proces",
			},
			industries: {
				title: "Odvětví, ve kterých",
				accent: "působíme",
				subtitle:
					"Omezení konkrétního oboru, ne obecná příručka.",
				watermark: "Odvětví",
			},
			finalCta: {
				title: "Chystáte něco, co prostě musí",
				accent: "fungovat?",
				subtitle:
					"Napište nám, co chystáte a čemu to musí odolat. Řekneme vám na rovinu, jestli jsme pro to ten správný tým.",
				cta: {
					href: "/contact",
				},
			},
		},
		solutions: {
			hero: {
				title: "Naše řešení",
				subtitle:
					"Šest oborů — použijeme je společně nebo samostatně, podle toho, co problém skutečně vyžaduje.",
			},
			industries: {
				title: "Odvětví, ve kterých působíme",
				subtitle:
					"Rozumíme zdravotnictví, vzdělávání, výrobě, veřejné správě, médiím i neziskovému sektoru — každý z těchto oborů má svá omezení, se kterými při návrhu počítáme.",
			},
			finalCta: {
				title: "Připraveni posunout své podnikání?",
				subtitle:
					"Pojďme probrat, jak vám naše řešení pomohou dosáhnout vašich cílů a posunout obor, ve kterém působíte.",
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
					"Žádné neurčité „my“ — malý, seniorní vývojářský tým, který má ke každé zakázce blízko.",
			},
			team: {
				title: "Kdo za tím stojí",
				body: "Ideacomp vznikl v roce 2019 jako malý, seniorní vývojářský tým — malý záměrně, ne z nouze. Zůstáváme dost malí na to, aby projekt navrhovali ti samí lidé, kteří ho pak vyvíjejí, a aby to byli právě oni, s kým mluvíte, když je potřeba se rozhodnout. Ať už tým poroste jakkoli, tohle je jediná věc, které se vzdát nechceme.",
			},
			compliance: {
				title: "Bezpečnost a compliance",
				body: "Bezpečnostní kontrola probíhá u každého vydání, není to checklist před spuštěním — viz „Jak pracujeme“. U regulovaných prostředí si požadavky na compliance (GDPR, oborová pravidla) vyjasníme už během úvodní analýzy, dřív než se architektura uzavře, a u citlivých zakázek běžně podepisujeme NDA.",
				certificationsNote:
					"Zatím nemáme formální certifikaci podle rámce, jako je ISO/IEC 27001. Pokud je to pro vaše výběrové řízení nutná podmínka, řekněte nám to včas a my vám na rovinu napíšeme, jak jsme na tom s termínem a jestli to pro vás dává smysl.",
			},
			caseStudies: {
				title: "Jakou práci děláme",
				subtitle:
					"Ilustrativní scénáře, které odpovídají typu zakázek, jaké děláme — ne skutečné případové studie (žádný klient zde zatím není jmenován ani citován). Jakmile to půjde, nahradíme je skutečnými studiemi se souhlasem klienta.",
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
