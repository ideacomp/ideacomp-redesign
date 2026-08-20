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
		scrollToContent: string;
		meetTheTeam: string;
		carouselRoleDescription: string;
		goToSlide: string;
		previousSlide: string;
		nextSlide: string;
		pauseSlideshow: string;
		playSlideshow: string;
		/** The showcase below has its own set rather than reusing the four
		 *  above: those name their subject ("Previous photo"), and announcing a
		 *  client site as a photo is wrong. */
		showcaseRoleDescription: string;
		goToProject: string;
		previousProject: string;
		nextProject: string;
		visitSite: string;
		opensInNewTab: string;
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
		intro: string;
		/** Tag on the two fields that aren't required, so nothing needs an asterisk. */
		optional: string;
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
		/** Same six ranges, abbreviated to fit a chip. */
		budgetShortOptions: {
			under10k: string;
			range10to25: string;
			range25to50: string;
			range50to100: string;
			over100: string;
			discuss: string;
		};
		projectDetails: string;
		projectDetailsPlaceholder: string;
		projectDetailsHint: string;
		submitIdle: string;
		submitSending: string;
		submitAriaIdle: string;
		submitAriaSending: string;
		successHeading: string;
		successMessage: string;
		referenceLabel: string;
		sendAnother: string;
		errorHeading: string;
		errorMessage: string;
		validation: {
			name: string;
			email: string;
			emailFormat: string;
			projectType: string;
			message: string;
			messageShort: string;
		};
		privacyNote: { before: string; link: string; after: string };
		steps: {
			progress: string;
			next: string;
			back: string;
			scope: { title: string; hint: string };
			brief: { title: string; hint: string };
			identity: { title: string; hint: string };
		};
		payload: {
			title: string;
			note: string;
			empty: string;
			receivedAt: string;
			status: {
				draft: string;
				ready: string;
				sending: string;
				sent: string;
				failed: string;
			};
			fields: {
				name: string;
				email: string;
				company: string;
				projectType: string;
				budget: string;
				message: string;
			};
		};
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
			scrollToContent: "Scroll to what we build",
			meetTheTeam: "Meet the team",
			carouselRoleDescription: "Photo carousel",
			goToSlide: "Go to photo",
			previousSlide: "Previous photo",
			nextSlide: "Next photo",
			pauseSlideshow: "Pause the photo carousel",
			playSlideshow: "Resume the photo carousel",
			showcaseRoleDescription: "Project showcase",
			goToProject: "Go to project",
			previousProject: "Previous project",
			nextProject: "Next project",
			visitSite: "Visit site",
			opensInNewTab: "opens in a new tab",
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
			intro:
				"We read every inquiry ourselves — no sales queue in between. The more concrete you are, the more concrete our answer.",
			optional: "optional",
			name: "Name",
			// Sample values, not restatements of the label — the same register as
			// the email placeholder, so a glance shows the shape of the answer.
			namePlaceholder: "Jane Novak",
			email: "Email",
			emailPlaceholder: "your@email.com",
			company: "Company / organization",
			companyPlaceholder: "Acme Corporation",
			projectType: "What are we building",
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
			budget: "Budget range",
			budgetOptions: {
				placeholder: "Select budget range",
				under10k: "Under $10,000",
				range10to25: "$10,000 - $25,000",
				range25to50: "$25,000 - $50,000",
				range50to100: "$50,000 - $100,000",
				over100: "$100,000+",
				discuss: "Let's discuss",
			},
			budgetShortOptions: {
				under10k: "Under $10k",
				range10to25: "$10–25k",
				range25to50: "$25–50k",
				range50to100: "$50–100k",
				over100: "$100k+",
				discuss: "Let's discuss",
			},
			projectDetails: "The problem, in your words",
			projectDetailsPlaceholder:
				"What has to work, by when, and what it has to fit into…",
			projectDetailsHint:
				"Goals, constraints, deadlines, systems it has to talk to — whatever you already know.",
			submitIdle: "Send Message",
			submitSending: "Sending Message...",
			submitAriaIdle: "Send your message to Ideacomp",
			submitAriaSending: "Sending your message, please wait",
			successHeading: "Request received.",
			successMessage:
				"Message sent successfully. We'll get back to you within one business day.",
			referenceLabel: "Reference",
			sendAnother: "Send another request",
			errorHeading: "That didn't go through.",
			errorMessage:
				"Failed to send message. Please try again or email us directly at info@ideacomp.cz.",
			validation: {
				name: "Please tell us who you are.",
				email: "We need an email address to reply to.",
				emailFormat: "That doesn't look like a valid email address.",
				projectType: "Pick the closest match — we'll sort out the details.",
				message: "Tell us briefly what you're building.",
				messageShort:
					"A sentence or two, please — enough for us to give you a useful answer.",
			},
			privacyNote: {
				before: "What you send reaches our inbox and nowhere else. See the ",
				link: "privacy policy",
				after: ".",
			},
			steps: {
				progress: "Step {current} of {total}",
				next: "Continue",
				back: "Back",
				scope: { title: "Scope", hint: "What are we building, and how big is it?" },
				brief: { title: "Brief", hint: "The problem in your words." },
				identity: { title: "You", hint: "Where do we send the answer?" },
			},
			payload: {
				title: "inquiry.request",
				note: "This is exactly what reaches our inbox. Nothing else is collected.",
				empty: "—",
				receivedAt: "received",
				status: {
					draft: "draft",
					ready: "ready to send",
					sending: "transmitting",
					sent: "delivered",
					failed: "failed",
				},
				fields: {
					name: "name",
					email: "email",
					company: "company",
					projectType: "scope",
					budget: "budget",
					message: "brief",
				},
			},
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
				"Driven by Ideas. Vyvíjíme software, AI a infrastrukturu pro organizace, které si nemohou dovolit riskovat výběr dodavatele.",
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
			scrollToContent: "Přejít níž na to, co vyvíjíme",
			meetTheTeam: "Poznejte náš tým",
			carouselRoleDescription: "Fotogalerie",
			goToSlide: "Přejít na fotografii",
			previousSlide: "Předchozí fotografie",
			nextSlide: "Další fotografie",
			pauseSlideshow: "Pozastavit fotogalerii",
			playSlideshow: "Spustit fotogalerii",
			showcaseRoleDescription: "Přehled projektů",
			goToProject: "Přejít na projekt",
			previousProject: "Předchozí projekt",
			nextProject: "Další projekt",
			visitSite: "Otevřít web",
			opensInNewTab: "otevře se v novém okně",
		},
		contactInfo: {
			address: "Praha, Česká republika",
			officeHours: "Po–Pá, 9:00–17:00 (UTC+1)",
			officeHoursFooter: "Po–Pá, 9:00–17:00 (UTC+1) · Praha, ČR",
			replyNote:
				"Každou zprávu čteme osobně. Do jednoho pracovního dne se ozveme a napíšeme na rovinu, co si myslíme o rozsahu, termínech i tom, jestli jsme pro vás ten správný tým.",
		},
		about: {
			founded: "Založeno",
			teamSize: "Velikost týmu",
			disciplines: "Obory",
			industriesServed: "Odvětví",
			challenge: "Zadání: ",
			approach: "Přístup: ",
			outcome: "Výsledek: ",
		},
		notFound: {
			title: "Stránka nenalezena (404) – Ideacomp",
			heading: "Stránka nenalezena",
			subtitle:
				"Stránka se nejspíš přesunula, byla smazána, nebo je adresa špatně. Tudy vede cesta zpátky.",
			goHome: "Zpět domů",
			ariaError: "Chyba 404",
			ariaGoHome: "Návrat na domovskou stránku Ideacomp",
			links: {
				solutions: {
					title: "Naše řešení",
					description: "AI a strojové učení, kybernetická bezpečnost, vývoj softwaru, cloud a DevOps.",
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
			intro:
				"Každou poptávku čteme my sami, neputuje přes žádné obchodní oddělení. Čím konkrétnější dotaz, tím konkrétnější odpověď.",
			optional: "nepovinné",
			name: "Jméno",
			namePlaceholder: "Jan Novák",
			email: "E-mail",
			emailPlaceholder: "vas@email.cz",
			company: "Firma / organizace",
			companyPlaceholder: "Acme s.r.o.",
			projectType: "Co budeme vyvíjet",
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
				under10k: "Méně než 10 000 $",
				range10to25: "10 000 – 25 000 $",
				range25to50: "25 000 – 50 000 $",
				range50to100: "50 000 – 100 000 $",
				over100: "100 000 $ a více",
				discuss: "Domluvíme se",
			},
			budgetShortOptions: {
				under10k: "Do 10 tis. $",
				range10to25: "10–25 tis. $",
				range25to50: "25–50 tis. $",
				range50to100: "50–100 tis. $",
				over100: "100 tis. $ a více",
				discuss: "Domluvíme se",
			},
			projectDetails: "Problém vašimi slovy",
			projectDetailsPlaceholder:
				"Co má fungovat, do kdy a do čeho to musí zapadnout…",
			projectDetailsHint:
				"Cíle, omezení, termíny, systémy, se kterými se to musí propojit — cokoli už víte.",
			submitIdle: "Odeslat zprávu",
			submitSending: "Odesíláme zprávu…",
			submitAriaIdle: "Odeslat zprávu společnosti Ideacomp",
			submitAriaSending: "Odesíláme zprávu, čekejte prosím",
			successHeading: "Poptávku máme.",
			successMessage:
				"Zpráva byla úspěšně odeslána. Ozveme se vám do jednoho pracovního dne.",
			referenceLabel: "Referenční číslo",
			sendAnother: "Odeslat další poptávku",
			errorHeading: "Odeslání se nezdařilo.",
			errorMessage:
				"Odeslání zprávy se nezdařilo. Zkuste to prosím znovu, nebo nám napište přímo na info@ideacomp.cz.",
			validation: {
				name: "Napište nám prosím, kdo jste.",
				email: "Bez e-mailu vám nemůžeme odpovědět.",
				emailFormat: "Tohle nevypadá jako platná e-mailová adresa.",
				projectType: "Vyberte nejbližší možnost — detaily doladíme.",
				message: "Napište stručně, co chystáte.",
				messageShort:
					"Stačí věta nebo dvě, ať vám můžeme odpovědět k věci.",
			},
			privacyNote: {
				before: "Co odešlete, dorazí do naší schránky a nikam jinam. Viz ",
				link: "zásady ochrany osobních údajů",
				after: ".",
			},
			steps: {
				progress: "Krok {current} ze {total}",
				next: "Pokračovat",
				back: "Zpět",
				scope: { title: "Rozsah", hint: "Co budeme vyvíjet a v jakém rozsahu?" },
				brief: { title: "Zadání", hint: "Problém vašimi slovy." },
				identity: { title: "Vy", hint: "Kam máme poslat odpověď?" },
			},
			payload: {
				title: "poptavka.request",
				note: "Přesně tohle dorazí do naší schránky. Nic dalšího neshromažďujeme.",
				empty: "—",
				receivedAt: "přijato",
				status: {
					draft: "rozpracováno",
					ready: "připraveno k odeslání",
					sending: "odesílání",
					sent: "doručeno",
					failed: "chyba",
				},
				fields: {
					name: "jméno",
					email: "e-mail",
					company: "firma",
					projectType: "rozsah",
					budget: "rozpočet",
					message: "zadání",
				},
			},
		},
		privacy: {
			whoWeAre: {
				heading: "Kdo jsme",
				before:
					"Ideacomp s.r.o. (dále jen „Ideacomp“ nebo „my“), se sídlem v Praze, je správcem osobních údajů popsaných v těchto zásadách. S jakýmkoli dotazem nebo žádostí týkající se ochrany osobních údajů se na nás obraťte na adrese ",
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
					text: "Pokud v cookie liště udělíte souhlas, načteme Google Analytics a EngageTrack, které shromažďují standardní webová analytická data (navštívené stránky, přibližná poloha, typ zařízení a prohlížeče, zdroj návštěvy). Ani jeden nástroj se bez vašeho souhlasu nenačte a souhlas můžete kdykoli odvolat (viz oddíl „Cookies“ níže).",
				},
			},
			whyWeProcess: {
				heading: "Proč údaje zpracováváme",
				text: "Údaje z kontaktního formuláře zpracováváme, abychom reagovali na váš dotaz, a případně abychom na vaši žádost učinili kroky směřující k uzavření smlouvy (čl. 6 odst. 1 písm. b) GDPR), nebo na základě našeho oprávněného zájmu na vyřizování obchodních poptávek (čl. 6 odst. 1 písm. f)). Analytická data zpracováváme výhradně na základě vašeho souhlasu (čl. 6 odst. 1 písm. a)), který můžete kdykoli odvolat, aniž by to mělo vliv na zákonnost zpracování provedeného před jeho odvoláním.",
			},
			whoWeShare: {
				heading: "S kým údaje sdílíme",
				intro: "Využíváme následující zpracovatele, z nichž každý postupuje podle vlastních podmínek zpracování osobních údajů:",
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
				text: "Odeslané kontaktní formuláře uchováváme po dobu nezbytnou k vyřízení vašeho dotazu a vedení přiměřené obchodní evidence — zpravidla nejdéle 24 měsíců — pokud delší dobu nevyžaduje zákon nebo probíhající smluvní vztah. Analytická data se uchovávají podle standardních nastavení retence Google Analytics a EngageTrack; pokud souhlas odvoláte, od té chvíle je přestaneme sbírat.",
			},
			yourRights: {
				heading: "Vaše práva",
				before:
					"Podle GDPR máte právo na přístup ke svým osobním údajům, na jejich opravu nebo výmaz, na omezení zpracování, právo vznést proti zpracování námitku, právo na přenositelnost údajů a právo kdykoli odvolat souhlas. Kterékoli z těchto práv u nás můžete uplatnit na adrese ",
				after:
					". Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů, dozorového úřadu pro Českou republiku.",
			},
			cookies: {
				heading: "Cookies",
				text: "Rozlišujeme pouze mezi nezbytnými a analytickými cookies: dokud v cookie liště neudělíte souhlas, nenačte se nic nad rámec toho, co je nezbytně nutné k provozu webu. Svou volbu můžete kdykoli změnit.",
			},
			security: {
				heading: "Zabezpečení",
				text: "Tento web běží výhradně přes HTTPS a přístup k systémům, které pracují s vašimi údaji, mají jen lidé, kteří ho ke své práci potřebují. Žádný systém není dokonale zabezpečený, ale s údaji, které nám svěříte, zacházíme stejně pečlivě, jako když navrhujeme systémy pro naše klienty.",
			},
			changes: {
				heading: "Změny těchto zásad",
				text: "Pokud se tyto zásady podstatně změní, aktualizujeme datum „poslední aktualizace“ uvedené výše. Pokud web používáte i po takové aktualizaci, vyjadřujete tím souhlas s upravenými zásadami.",
			},
		},
	},
};
