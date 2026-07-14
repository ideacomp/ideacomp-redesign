"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Mail, Phone } from "lucide-react";
import { navigation, legalLinks, socialLinks, content } from "@/lib/sitemap";
import { ManageCookiePreferences } from "@/components/cookie-consent";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const { dict, locale } = useLocale();
	const pageContent = content[locale];

	return (
		<footer className="dark border-t border-border bg-background">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-12 md:grid-cols-12">
					<div className="md:col-span-6">
						<div className="mb-4 flex items-center gap-3">
							<Image src="/logo.png" alt="" width={28} height={28} className="rounded-sm" />
							<span className="font-display text-xl font-semibold uppercase tracking-tight text-foreground">
								Ideacomp
							</span>
						</div>
						<p className="max-w-sm text-sm leading-relaxed text-foreground/60">
							{dict.footer.tagline}
						</p>
						<div className="mt-6 flex flex-col gap-2 text-sm text-foreground/60">
							<a href="mailto:info@ideacomp.cz" className="flex items-center gap-2 hover:text-foreground">
								<Mail size={15} className="text-signal" aria-hidden="true" /> info@ideacomp.cz
							</a>
							{pageContent.contact.phone && (
								<a href={`tel:${pageContent.contact.phone}`} className="flex items-center gap-2 hover:text-foreground">
									<Phone size={15} className="text-signal" aria-hidden="true" /> {pageContent.contact.phone}
								</a>
							)}
							<p className="flex items-center gap-2">
								<Clock size={15} className="text-signal" aria-hidden="true" /> {dict.contactInfo.officeHoursFooter}
							</p>
						</div>
					</div>

					<div className="md:col-span-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
							{dict.footer.navigationHeading}
						</h3>
						<ul className="mt-4 space-y-2">
							{navigation.map((item) => (
								<li key={item.key}>
									<Link href={item.href} className="text-sm text-foreground/60 transition-colors hover:text-signal">
										{dict.nav[item.key]}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="md:col-span-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
							{dict.footer.elsewhereHeading}
						</h3>
						<ul className="mt-4 space-y-2">
							{socialLinks.map((link) => (
								<li key={link.name}>
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-signal"
									>
										<link.icon size={15} aria-hidden="true" /> {link.name}
									</a>
								</li>
							))}
						</ul>
						<div className="mt-6">
							<LanguageSwitcher />
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
					<p className="text-xs text-foreground/40">
						&copy; {currentYear} Ideacomp s.r.o. {dict.footer.allRightsReserved}
					</p>
					<div className="flex items-center gap-4 text-xs text-foreground/40">
						{legalLinks.map((link) => (
							<Link key={link.key} href={link.href} className="hover:text-foreground">
								{dict.footer.legal[link.key]}
							</Link>
						))}
						<ManageCookiePreferences className="hover:text-foreground" />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
