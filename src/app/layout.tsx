import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Big_Shoulders, Public_Sans, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/structured-data";
import GoogleAnalytics from "@/components/google-analytics";
import EngageTrackScript from "@/components/engagetrack-script";
import { ConsentGate } from "@/components/consent-gate";
import { CookieConsentBanner } from "@/components/cookie-consent";
import { MotionProvider } from "@/components/motion-provider";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { LOCALE_COOKIE } from "@/lib/i18n/constants";
import type { Locale } from "@/lib/i18n/dictionaries";

const bigShoulders = Big_Shoulders({
	subsets: ["latin"],
	variable: "--font-big-shoulders",
	display: "swap",
});

const publicSans = Public_Sans({
	subsets: ["latin"],
	variable: "--font-public-sans",
	display: "swap",
});

const splineSansMono = Spline_Sans_Mono({
	subsets: ["latin"],
	variable: "--font-spline-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "Ideacomp: Driven by Ideas | Custom Software & Digital Solutions",
		template: "%s | Ideacomp - Custom Software Development"
	},
	description:
		"Ideacomp engineers custom software, AI & machine learning, cybersecurity, and cloud/DevOps systems for healthcare, government, manufacturing, education, media, and non-profit organizations. Prague-based, built to hold up under scrutiny.",
	keywords: [
		"software development",
		"mobile app development",
		"web applications",
		"DevOps solutions",
		"machine learning",
		"AI development",
		"cybersecurity",
		"custom software",
		"digital transformation",
		"cloud solutions",
		"technology consulting",
		"scalable applications",
		"enterprise software",
		"government software vendor",
		"healthcare software development",
		"Czech Republic software company",
		"Prague software development",
		"European tech company"
	],
	authors: [{ name: "Ideacomp", url: "https://ideacomp.cz" }],
	creator: "Ideacomp s.r.o.",
	publisher: "Ideacomp s.r.o.",
	category: "Technology",
	classification: "Software Development Company",
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
	},
	metadataBase: new URL("https://ideacomp.cz"),
	alternates: {
		canonical: "https://ideacomp.cz/",
		languages: {
			'en': 'https://ideacomp.cz/',
			'x-default': 'https://ideacomp.cz/'
		}
	},
	openGraph: {
		title: "Ideacomp: Driven by Ideas | Custom Software Development",
		description:
			"Custom software, AI & machine learning, cybersecurity, and cloud/DevOps for organizations that can't afford to gamble on a vendor. Prague-based, serving healthcare, government, manufacturing, education, media, and non-profit clients.",
		url: "https://ideacomp.cz",
		siteName: "Ideacomp",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "/landscape_logo.png",
				width: 1996,
				height: 868,
				alt: "Ideacomp - Custom Software Development Company - Driven by Ideas",
				type: "image/png"
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@ideacomp",
		creator: "@ideacomp",
		title: "Ideacomp: Driven by Ideas | Custom Software Development",
		description:
			"Custom software, AI & machine learning, cybersecurity, and cloud/DevOps for organizations that can't afford to gamble on a vendor.",
		images: {
			url: "/landscape_logo.png",
			alt: "Ideacomp - Custom Software Development Company"
		},
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
		other: {
			"msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
		}
	},
	other: {
		"geo.region": "CZ",
		"geo.placename": "Prague",
		"geo.position": "50.0755;14.4378",
		"ICBM": "50.0755, 14.4378",
		"theme-color": "#24252b",
		"msapplication-TileColor": "#24252b",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "black-translucent",
		"mobile-web-app-capable": "yes"
	}
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const initialLocale: Locale = cookieStore.get(LOCALE_COOKIE)?.value === "cs" ? "cs" : "en";

	return (
		<html
			lang={initialLocale}
			className={`${bigShoulders.variable} ${publicSans.variable} ${splineSansMono.variable}`}
		>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
				<link rel="canonical" href="https://ideacomp.cz/" />
				
				{/* Preconnect to external domains */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://images.unsplash.com" />
				<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
				<link rel="dns-prefetch" href="https://api.emailjs.com" />
				
				{/* Preload critical resources */}
				<link rel="preload" href="/landscape_logo.png" as="image" type="image/png" />
				<link rel="preload" href="/logo.png" as="image" type="image/png" />
				
				{/* Favicon and app icons */}
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/logo.png" type="image/png" />
				<link rel="apple-touch-icon" href="/logo.png" />
				<link rel="manifest" href="/manifest.json" />
				
				{/* Additional meta tags for better SEO */}
				<meta name="application-name" content="Ideacomp" />
				<meta name="apple-mobile-web-app-title" content="Ideacomp" />
				<meta name="format-detection" content="telephone=yes, date=no, email=yes, address=yes" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="theme-color" content="#24252b" />
				<meta name="msapplication-TileColor" content="#24252b" />
				<meta name="color-scheme" content="light" />
			</head>
			<body className="font-sans antialiased">
				<ConsentGate>
					<GoogleAnalytics />
					<EngageTrackScript />
				</ConsentGate>
				<StructuredData />
				<LocaleProvider initialLocale={initialLocale}>
					<MotionProvider>{children}</MotionProvider>
					<CookieConsentBanner />
				</LocaleProvider>
			</body>
		</html>
	);
}
