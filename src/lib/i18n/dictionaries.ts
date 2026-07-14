export type Locale = "en" | "cs";

export interface Dictionary {
	nav: {
		home: string;
		about: string;
		solutions: string;
		contact: string;
	};
	footer: {
		navigationHeading: string;
		elsewhereHeading: string;
		allRightsReserved: string;
		managePreferences: string;
		legal: {
			privacy: string;
		};
	};
	common: {
		seeOurSolutions: string;
		getInTouch: string;
		startConversation: string;
	};
	languageSwitcher: {
		label: string;
	};
	cookieBanner: {
		text: string;
		accept: string;
		reject: string;
	};
	faq: {
		heading: string;
		subtitle: string;
	};
	contactForm: {
		heading: string;
		name: string;
		namePlaceholder: string;
		email: string;
		emailPlaceholder: string;
		company: string;
		companyPlaceholder: string;
		projectType: string;
		projectTypeOptions: {
			placeholder: string;
			webApp: string;
			mobileApp: string;
			aiMl: string;
			cybersecurity: string;
			cloudDevops: string;
			outsourcing: string;
			other: string;
		};
		budget: string;
		budgetOptions: {
			placeholder: string;
			under10k: string;
			range10to25: string;
			range25to50: string;
			range50to100: string;
			over100: string;
			discuss: string;
		};
		projectDetails: string;
		projectDetailsPlaceholder: string;
		submitIdle: string;
		submitSending: string;
		submitAriaIdle: string;
		submitAriaSending: string;
		successMessage: string;
		errorMessage: string;
	};
}

export const dictionaries: Record<Locale, Dictionary> = {
	en: {
		nav: {
			home: "Home",
			about: "About",
			solutions: "Our Solutions",
			contact: "Contact",
		},
		footer: {
			navigationHeading: "Navigation",
			elsewhereHeading: "Elsewhere",
			allRightsReserved: "All rights reserved.",
			managePreferences: "Manage cookie preferences",
			legal: {
				privacy: "Privacy Policy",
			},
		},
		common: {
			seeOurSolutions: "See Our Solutions",
			getInTouch: "Get in Touch",
			startConversation: "Start the Conversation",
		},
		languageSwitcher: {
			label: "Language",
		},
		cookieBanner: {
			text: "We only load analytics (Google Analytics, EngageTrack) after you accept. See our Privacy Policy for details.",
			accept: "Accept",
			reject: "Reject",
		},
		faq: {
			heading: "Common Questions",
			subtitle: "Answered before you have to ask.",
		},
		contactForm: {
			heading: "Tell Us About Your Project",
			name: "Name *",
			namePlaceholder: "Your full name",
			email: "Email *",
			emailPlaceholder: "your@email.com",
			company: "Company/Organization",
			companyPlaceholder: "Your company name (optional)",
			projectType: "Project Type *",
			projectTypeOptions: {
				placeholder: "Select project type",
				webApp: "Web Application",
				mobileApp: "Mobile App",
				aiMl: "AI/ML Solution",
				cybersecurity: "Cybersecurity",
				cloudDevops: "Cloud/DevOps",
				outsourcing: "Outsourcing / Team Augmentation",
				other: "Other",
			},
			budget: "Budget Range",
			budgetOptions: {
				placeholder: "Select budget range",
				under10k: "Under $10,000",
				range10to25: "$10,000 - $25,000",
				range25to50: "$25,000 - $50,000",
				range50to100: "$50,000 - $100,000",
				over100: "$100,000+",
				discuss: "Let's discuss",
			},
			projectDetails: "Project Details *",
			projectDetailsPlaceholder:
				"Tell us about your project goals, timeline, and any specific requirements...",
			submitIdle: "Send Message",
			submitSending: "Sending Message...",
			submitAriaIdle: "Send your message to Ideacomp",
			submitAriaSending: "Sending your message, please wait",
			successMessage:
				"Message sent successfully. We'll get back to you within one business day.",
			errorMessage:
				"Failed to send message. Please try again or email us directly at info@ideacomp.cz.",
		},
	},
	cs: {
		nav: {
			home: "Domů",
			about: "O nás",
			solutions: "Naše řešení",
			contact: "Kontakt",
		},
		footer: {
			navigationHeading: "Navigace",
			elsewhereHeading: "Sledujte nás",
			allRightsReserved: "Všechna práva vyhrazena.",
			managePreferences: "Nastavení cookies",
			legal: {
				privacy: "Zásady ochrany osobních údajů",
			},
		},
		common: {
			seeOurSolutions: "Prozkoumat řešení",
			getInTouch: "Kontaktujte nás",
			startConversation: "Domluvme se",
		},
		languageSwitcher: {
			label: "Jazyk",
		},
		cookieBanner: {
			text: "Analytické nástroje (Google Analytics, EngageTrack) načteme až po vašem souhlasu. Podrobnosti najdete v Zásadách ochrany osobních údajů.",
			accept: "Přijmout",
			reject: "Odmítnout",
		},
		faq: {
			heading: "Časté dotazy",
			subtitle: "Odpovědi dřív, než se zeptáte.",
		},
		contactForm: {
			heading: "Řekněte nám o svém projektu",
			name: "Jméno *",
			namePlaceholder: "Vaše celé jméno",
			email: "E-mail *",
			emailPlaceholder: "vas@email.cz",
			company: "Firma / organizace",
			companyPlaceholder: "Název vaší firmy (nepovinné)",
			projectType: "Typ projektu *",
			projectTypeOptions: {
				placeholder: "Vyberte typ projektu",
				webApp: "Webová aplikace",
				mobileApp: "Mobilní aplikace",
				aiMl: "Řešení AI/ML",
				cybersecurity: "Kybernetická bezpečnost",
				cloudDevops: "Cloud / DevOps",
				outsourcing: "Outsourcing / rozšíření týmu",
				other: "Jiné",
			},
			budget: "Rozpočet",
			budgetOptions: {
				placeholder: "Vyberte rozpočet",
				under10k: "Méně než $10 000",
				range10to25: "$10 000 – $25 000",
				range25to50: "$25 000 – $50 000",
				range50to100: "$50 000 – $100 000",
				over100: "$100 000 a více",
				discuss: "Domluvíme se",
			},
			projectDetails: "Popis projektu *",
			projectDetailsPlaceholder:
				"Popište nám cíle projektu, časový rámec a případné specifické požadavky…",
			submitIdle: "Odeslat zprávu",
			submitSending: "Odesílám zprávu…",
			submitAriaIdle: "Odeslat zprávu společnosti Ideacomp",
			submitAriaSending: "Odesílám zprávu, čekejte prosím",
			successMessage:
				"Zpráva byla úspěšně odeslána. Ozveme se vám do jednoho pracovního dne.",
			errorMessage:
				"Odeslání zprávy se nezdařilo. Zkuste to prosím znovu, nebo nám napište přímo na info@ideacomp.cz.",
		},
	},
};
