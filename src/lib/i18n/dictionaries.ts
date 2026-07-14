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
		tagline: string;
		legal: {
			privacy: string;
		};
	};
	common: {
		seeOurSolutions: string;
		getInTouch: string;
		startConversation: string;
		openMenu: string;
		closeMenu: string;
		cookieConsentLabel: string;
		jumpToSolutionLabel: string;
	};
	contactInfo: {
		address: string;
		officeHours: string;
		officeHoursFooter: string;
		replyNote: string;
	};
	about: {
		founded: string;
		teamSize: string;
		disciplines: string;
		industriesServed: string;
		challenge: string;
		approach: string;
		outcome: string;
	};
	notFound: {
		title: string;
		heading: string;
		subtitle: string;
		goHome: string;
		ariaError: string;
		ariaGoHome: string;
		links: {
			solutions: { title: string; description: string };
			contact: { title: string; description: string };
			home: { title: string; description: string };
		};
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
	privacy: {
		whoWeAre: { heading: string; before: string; after: string };
		whatWeCollect: {
			heading: string;
			contactForm: { label: string; text: string };
			analytics: { label: string; text: string };
		};
		whyWeProcess: { heading: string; text: string };
		whoWeShare: {
			heading: string;
			intro: string;
			processors: {
				emailjs: { name: string; text: string };
				googleAnalytics: { name: string; text: string };
				engageTrack: { name: string; text: string };
			};
			closing: string;
		};
		howLongWeKeep: { heading: string; text: string };
		yourRights: { heading: string; before: string; after: string };
		cookies: { heading: string; text: string };
		security: { heading: string; text: string };
		changes: { heading: string; text: string };
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
			tagline:
				"Driven by Ideas. We engineer software, AI, and infrastructure for organizations that can't afford to gamble on a vendor.",
			legal: {
				privacy: "Privacy Policy",
			},
		},
		common: {
			seeOurSolutions: "See Our Solutions",
			getInTouch: "Get in Touch",
			startConversation: "Start the Conversation",
			openMenu: "Open navigation menu",
			closeMenu: "Close navigation menu",
			cookieConsentLabel: "Cookie consent",
			jumpToSolutionLabel: "Jump to a solution",
		},
		contactInfo: {
			address: "Prague, Czech Republic",
			officeHours: "Mon–Fri, 09:00–17:00 (UTC+1)",
			officeHoursFooter: "Mon–Fri, 09:00–17:00 (UTC+1) · Prague, CZ",
			replyNote:
				"We read every submission personally. Expect a reply within one business day with a straight answer on scope, timeline, and fit.",
		},
		about: {
			founded: "Founded",
			teamSize: "Team size",
			disciplines: "Disciplines",
			industriesServed: "Industries served",
			challenge: "Challenge: ",
			approach: "Approach: ",
			outcome: "Outcome: ",
		},
		notFound: {
			title: "Page Not Found (404) - Ideacomp",
			heading: "Page Not Found",
			subtitle:
				"The page might have been moved, deleted, or the URL is wrong. Here's how to get back on track.",
			goHome: "Go Home",
			ariaError: "Error 404",
			ariaGoHome: "Return to Ideacomp homepage",
			links: {
				solutions: {
					title: "Our Solutions",
					description: "AI & ML, cybersecurity, custom software, cloud & DevOps.",
				},
				contact: {
					title: "Contact Us",
					description: "Tell us about your project — we reply within one business day.",
				},
				home: {
					title: "Home",
					description: "Back to Driven by Ideas.",
				},
			},
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
		privacy: {
			whoWeAre: {
				heading: "Who we are",
				before:
					'Ideacomp s.r.o. ("Ideacomp", "we", "us"), based in Prague, Czech Republic, is the data controller for the personal data described in this policy. For any privacy question or request, contact us at ',
				after: ".",
			},
			whatWeCollect: {
				heading: "What we collect",
				contactForm: {
					label: "Contact form.",
					text: "When you submit the form on our Contact page, we collect the information you provide: name, email address, company/organization (optional), project type, budget range, and your message. We use this only to respond to your inquiry.",
				},
				analytics: {
					label: "Analytics — only after you consent.",
					text: 'If you accept the cookie banner, we load Google Analytics and EngageTrack, which collect standard web analytics data (pages visited, approximate location, device/browser type, referral source). Neither loads before you accept, and you can withdraw consent at any time (see "Cookies" below).',
				},
			},
			whyWeProcess: {
				heading: "Why we process it",
				text: "Contact form data is processed to respond to your inquiry and, where relevant, to take steps toward a contract at your request (GDPR Art. 6(1)(b)) or on the basis of our legitimate interest in responding to business inquiries (Art. 6(1)(f)). Analytics data is processed solely on the basis of your consent (Art. 6(1)(a)), which you may withdraw at any time without affecting the lawfulness of processing before withdrawal.",
			},
			whoWeShare: {
				heading: "Who we share it with",
				intro: "We use the following processors, each acting under its own data processing terms:",
				processors: {
					emailjs: {
						name: "EmailJS",
						text: "delivers contact form submissions to our inbox.",
					},
					googleAnalytics: {
						name: "Google Analytics",
						text: "website analytics, loaded only after consent.",
					},
					engageTrack: {
						name: "EngageTrack",
						text: "website analytics, loaded only after consent.",
					},
				},
				closing:
					"We do not sell personal data, and we do not share it with third parties for their own marketing purposes.",
			},
			howLongWeKeep: {
				heading: "How long we keep it",
				text: "Contact form submissions are retained for as long as necessary to respond to your inquiry and maintain reasonable business records — typically no more than 24 months — unless a longer period is required by law or an ongoing contractual relationship. Analytics data is retained per Google Analytics' and EngageTrack's standard retention settings and is deleted immediately if you withdraw consent going forward.",
			},
			yourRights: {
				heading: "Your rights",
				before:
					"Under the GDPR, you have the right to access, correct, or erase your personal data, to restrict or object to its processing, to data portability, and to withdraw consent at any time. To exercise any of these rights, contact us at ",
				after:
					". You also have the right to lodge a complaint with the Czech Office for Personal Data Protection (Úřad pro ochranu osobních údajů), the supervisory authority for the Czech Republic.",
			},
			cookies: {
				heading: "Cookies",
				text: "We use a single essential-vs-analytics distinction: nothing beyond what's strictly necessary to run the site loads until you accept the cookie banner. You can change your choice at any time.",
			},
			security: {
				heading: "Security",
				text: "This site is served over HTTPS, and access to systems that handle your data is restricted to the people who need it to do their job. No system is perfectly secure, but we treat the data you share with the same care we design into the systems we build for clients.",
			},
			changes: {
				heading: "Changes to this policy",
				text: 'We\'ll update the "last updated" date above if this policy changes materially. Continued use of the site after an update constitutes acceptance of the revised policy.',
			},
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
			tagline:
				"Driven by Ideas. Vyvíjíme software, AI a infrastrukturu pro organizace, které si nemohou dovolit hazardovat s dodavatelem.",
			legal: {
				privacy: "Zásady ochrany osobních údajů",
			},
		},
		common: {
			seeOurSolutions: "Prozkoumat řešení",
			getInTouch: "Kontaktujte nás",
			startConversation: "Domluvme se",
			openMenu: "Otevřít navigační menu",
			closeMenu: "Zavřít navigační menu",
			cookieConsentLabel: "Souhlas s cookies",
			jumpToSolutionLabel: "Přejít na řešení",
		},
		contactInfo: {
			address: "Praha, Česká republika",
			officeHours: "Po–Pá, 9:00–17:00 (UTC+1)",
			officeHoursFooter: "Po–Pá, 9:00–17:00 (UTC+1) · Praha, ČR",
			replyNote:
				"Každou zprávu čteme osobně. Odpověď dostanete do jednoho pracovního dne, s upřímným vyjádřením k rozsahu, harmonogramu a vhodnosti spolupráce.",
		},
		about: {
			founded: "Založeno",
			teamSize: "Velikost týmu",
			disciplines: "Oblasti",
			industriesServed: "Obsluhovaná odvětví",
			challenge: "Zadání: ",
			approach: "Přístup: ",
			outcome: "Výsledek: ",
		},
		notFound: {
			title: "Stránka nenalezena (404) – Ideacomp",
			heading: "Stránka nenalezena",
			subtitle:
				"Stránka mohla být přesunuta, smazána, nebo je adresa URL chybná. Zde je návod, jak se vrátit zpět.",
			goHome: "Zpět domů",
			ariaError: "Chyba 404",
			ariaGoHome: "Návrat na domovskou stránku Ideacomp",
			links: {
				solutions: {
					title: "Naše řešení",
					description: "AI a strojové učení, kybernetická bezpečnost, vývoj software, cloud a DevOps.",
				},
				contact: {
					title: "Kontaktujte nás",
					description: "Řekněte nám o svém projektu — odpovíme do jednoho pracovního dne.",
				},
				home: {
					title: "Domů",
					description: "Zpět na Driven by Ideas.",
				},
			},
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
		privacy: {
			whoWeAre: {
				heading: "Kdo jsme",
				before:
					'Ideacomp s.r.o. ("Ideacomp", "my"), se sídlem v Praze, je správcem osobních údajů popsaných v těchto zásadách. S jakýmkoli dotazem nebo žádostí týkající se ochrany osobních údajů nás kontaktujte na ',
				after: ".",
			},
			whatWeCollect: {
				heading: "Co shromažďujeme",
				contactForm: {
					label: "Kontaktní formulář.",
					text: "Při odeslání formuláře na naší kontaktní stránce shromažďujeme údaje, které nám poskytnete: jméno, e-mailovou adresu, firmu/organizaci (nepovinné), typ projektu, rozpočtové rozpětí a vaši zprávu. Tyto údaje používáme pouze k reakci na váš dotaz.",
				},
				analytics: {
					label: "Analytika — pouze po vašem souhlasu.",
					text: 'Pokud přijmete cookie lištu, načteme Google Analytics a EngageTrack, které shromažďují standardní webová analytická data (navštívené stránky, přibližná poloha, typ zařízení/prohlížeče, zdroj návštěvy). Ani jeden nástroj se nenačte, dokud souhlas neudělíte, a souhlas můžete kdykoli odvolat (viz "Cookies" níže).',
				},
			},
			whyWeProcess: {
				heading: "Proč údaje zpracováváme",
				text: "Údaje z kontaktního formuláře zpracováváme, abychom reagovali na váš dotaz, a případně abychom na vaši žádost učinili kroky směřující k uzavření smlouvy (čl. 6 odst. 1 písm. b) GDPR), nebo na základě našeho oprávněného zájmu na vyřizování obchodních poptávek (čl. 6 odst. 1 písm. f)). Analytická data zpracováváme výhradně na základě vašeho souhlasu (čl. 6 odst. 1 písm. a)), který můžete kdykoli odvolat, aniž by to mělo vliv na zákonnost zpracování provedeného před jeho odvoláním.",
			},
			whoWeShare: {
				heading: "S kým údaje sdílíme",
				intro: "Využíváme následující zpracovatele, z nichž každý jedná podle vlastních podmínek zpracování dat:",
				processors: {
					emailjs: {
						name: "EmailJS",
						text: "doručuje odeslané kontaktní formuláře do naší schránky.",
					},
					googleAnalytics: {
						name: "Google Analytics",
						text: "webová analytika, načítá se až po udělení souhlasu.",
					},
					engageTrack: {
						name: "EngageTrack",
						text: "webová analytika, načítá se až po udělení souhlasu.",
					},
				},
				closing:
					"Osobní údaje neprodáváme a nesdílíme je s třetími stranami pro jejich vlastní marketingové účely.",
			},
			howLongWeKeep: {
				heading: "Jak dlouho údaje uchováváme",
				text: "Odeslané kontaktní formuláře uchováváme po dobu nezbytnou k vyřízení vašeho dotazu a vedení přiměřené obchodní evidence — zpravidla nejdéle 24 měsíců — pokud delší dobu nevyžaduje zákon nebo probíhající smluvní vztah. Analytická data se uchovávají podle standardních retenčních nastavení Google Analytics a EngageTrack a jsou okamžitě smazána, pokud odvoláte souhlas do budoucna.",
			},
			yourRights: {
				heading: "Vaše práva",
				before:
					"Podle GDPR máte právo na přístup ke svým osobním údajům, jejich opravu nebo výmaz, na omezení či námitku proti jejich zpracování, na přenositelnost údajů a na odvolání souhlasu kdykoli. Pro uplatnění kteréhokoli z těchto práv nás kontaktujte na ",
				after:
					". Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů, dozorového úřadu pro Českou republiku.",
			},
			cookies: {
				heading: "Cookies",
				text: "Rozlišujeme pouze mezi nezbytnými a analytickými cookies: nic nad rámec toho, co je nezbytně nutné k provozu webu, se nenačte, dokud nepřijmete cookie lištu. Svou volbu můžete kdykoli změnit.",
			},
			security: {
				heading: "Zabezpečení",
				text: "Tento web je provozován přes HTTPS a přístup k systémům, které pracují s vašimi údaji, mají pouze lidé, kteří jej potřebují ke své práci. Žádný systém není dokonale zabezpečený, ale s údaji, které nám svěříte, zacházíme se stejnou péčí, jakou navrhujeme do systémů pro naše klienty.",
			},
			changes: {
				heading: "Změny těchto zásad",
				text: 'Pokud se tyto zásady podstatně změní, aktualizujeme datum "poslední aktualizace" výše. Další používání webu po aktualizaci znamená souhlas s revidovanými zásadami.',
			},
		},
	},
};
