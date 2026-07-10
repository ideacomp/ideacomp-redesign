import Script from "next/script";

export default function StructuredData() {
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": "https://ideacomp.cz/#organization",
		name: "Ideacomp s.r.o.",
		legalName: "Ideacomp s.r.o.",
		url: "https://ideacomp.cz",
		logo: {
			"@type": "ImageObject",
			url: "https://ideacomp.cz/landscape_logo.png",
			width: 1996,
			height: 868,
			caption: "Ideacomp - Custom Software Development Company"
		},
		image: "https://ideacomp.cz/landscape_logo.png",
		description:
			"Ideacomp engineers custom software, AI & machine learning, cybersecurity, and cloud/DevOps systems for healthcare, government, manufacturing, education, media, and non-profit organizations.",
		slogan: "Driven by Ideas",
		foundingDate: "2024",
		numberOfEmployees: "2-10",
		industry: "Software Development",
		naics: "541511",
		knowsAbout: [
			"Software Development",
			"Mobile App Development",
			"Web Applications",
			"DevOps",
			"Machine Learning",
			"Artificial Intelligence",
			"Cybersecurity",
			"Cloud Computing",
			"Outsourcing & Team Augmentation",
			"Digital Transformation"
		],
		sameAs: [
			"https://github.com/ideacomp"
		],
		contactPoint: [
			{
				"@type": "ContactPoint",
				contactType: "customer service",
				url: "https://ideacomp.cz/contact",
				availableLanguage: ["English", "Czech"],
				areaServed: "Worldwide"
			},
			{
				"@type": "ContactPoint", 
				contactType: "sales",
				email: "info@ideacomp.cz",
				availableLanguage: ["English", "Czech"],
				areaServed: "Worldwide"
			}
		],
		address: {
			"@type": "PostalAddress",
			addressCountry: "CZ",
			addressLocality: "Prague",
			addressRegion: "Prague"
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: "50.0755",
			longitude: "14.4378"
		},
		areaServed: {
			"@type": "Place",
			name: "Worldwide"
		},
		makesOffer: [
			{
				"@type": "Offer",
				name: "AI & Machine Learning",
				description: "Predictive analytics, process analysis, and process automation built on your own operational data"
			},
			{
				"@type": "Offer",
				name: "Cybersecurity",
				description: "Firewall and network perimeter management, security assessments, and incident response planning"
			},
			{
				"@type": "Offer",
				name: "Custom Web Development",
				description: "Frontend, backend, and API architecture for scalable, production-grade web applications"
			},
			{
				"@type": "Offer",
				name: "Outsourcing & Team Augmentation",
				description: "Helpdesk support, network management, and server management delivered by engineers who integrate with your workflow"
			},
			{
				"@type": "Offer",
				name: "Mobile App Development",
				description: "Native and cross-platform mobile applications, including offline-first functionality"
			},
			{
				"@type": "Offer",
				name: "Cloud & DevOps",
				description: "Cloud infrastructure, containerization, and CI/CD automation"
			}
		]
	};

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": "https://ideacomp.cz/#website",
		name: "Ideacomp",
		alternateName: "Ideacomp s.r.o.",
		url: "https://ideacomp.cz",
		description:
			"Custom software, AI & machine learning, cybersecurity, and cloud/DevOps engineering from Prague, Czech Republic.",
		inLanguage: "en-US",
		isPartOf: {
			"@id": "https://ideacomp.cz/#organization"
		},
		about: {
			"@id": "https://ideacomp.cz/#organization"
		},
		publisher: {
			"@id": "https://ideacomp.cz/#organization"
		},
		copyrightHolder: {
			"@id": "https://ideacomp.cz/#organization"
		},
		copyrightYear: "2024",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://ideacomp.cz/search?q={search_term_string}"
			},
			"query-input": "required name=search_term_string"
		}
	};

	const serviceSchema = {
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"@id": "https://ideacomp.cz/#service",
		name: "Custom Software Development Services",
		provider: {
			"@id": "https://ideacomp.cz/#organization"
		},
		description:
			"AI & machine learning, cybersecurity, custom web and mobile development, outsourcing, and cloud/DevOps services for organizations in healthcare, government, manufacturing, education, media, and non-profit work.",
		serviceType: "Software Development",
		category: "Technology Services",
		areaServed: {
			"@type": "Place",
			name: "Worldwide"
		},
		audience: {
			"@type": "Audience",
			audienceType: "Business"
		},
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Software Development Services",
			itemListElement: [
				{
					"@type": "Offer",
					"@id": "https://ideacomp.cz/solutions#ai-ml",
					name: "AI & Machine Learning",
					description: "Predictive analytics, process analysis, and process automation built on your own operational data.",
					category: "Artificial Intelligence",
					areaServed: "Worldwide"
				},
				{
					"@type": "Offer",
					"@id": "https://ideacomp.cz/solutions#cybersecurity",
					name: "Cybersecurity",
					description: "Firewall and network perimeter management, security assessments, and incident response planning.",
					category: "Cybersecurity",
					areaServed: "Worldwide"
				},
				{
					"@type": "Offer",
					"@id": "https://ideacomp.cz/solutions#web-development",
					name: "Custom Web Development",
					description: "Frontend, backend, and API architecture for scalable, production-grade web applications.",
					category: "Mobile & Web Development",
					areaServed: "Worldwide"
				},
				{
					"@type": "Offer",
					"@id": "https://ideacomp.cz/solutions#outsourcing",
					name: "Outsourcing & Team Augmentation",
					description: "Helpdesk support, network management, and server management delivered by engineers who integrate with your workflow.",
					category: "IT Outsourcing",
					areaServed: "Worldwide"
				},
				{
					"@type": "Offer",
					"@id": "https://ideacomp.cz/solutions#mobile-development",
					name: "Mobile App Development",
					description: "Native and cross-platform mobile applications, including offline-first functionality.",
					category: "Mobile & Web Development",
					areaServed: "Worldwide"
				},
				{
					"@type": "Offer",
					"@id": "https://ideacomp.cz/solutions#cloud-devops",
					name: "Cloud & DevOps",
					description: "Cloud infrastructure, containerization, and CI/CD automation for scalable operations.",
					category: "Cloud Computing",
					areaServed: "Worldwide"
				}
			]
		}
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: "https://ideacomp.cz"
			},
			{
				"@type": "ListItem", 
				position: 2,
				name: "Solutions",
				item: "https://ideacomp.cz/solutions"
			},
			{
				"@type": "ListItem",
				position: 3, 
				name: "Contact",
				item: "https://ideacomp.cz/contact"
			}
		]
	};

	return (
		<>
			<Script
				id="organization-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<Script
				id="website-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
			/>
			<Script
				id="service-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
			/>
			<Script
				id="breadcrumb-schema"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		</>
	);
}
