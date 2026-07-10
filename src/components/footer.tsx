import Link from "next/link";
import Image from "next/image";
import { Clock, Mail, Github } from "lucide-react";
import { navigation, socialLinks } from "@/lib/sitemap";

const Footer = () => {
	const currentYear = new Date().getFullYear();

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
							Driven by Ideas. We engineer software, AI, and infrastructure for
							organizations that can&apos;t afford to gamble on a vendor.
						</p>
						<div className="mt-6 flex flex-col gap-2 text-sm text-foreground/60">
							<a href="mailto:info@ideacomp.cz" className="flex items-center gap-2 hover:text-foreground">
								<Mail size={15} className="text-signal" aria-hidden="true" /> info@ideacomp.cz
							</a>
							<p className="flex items-center gap-2">
								<Clock size={15} className="text-signal" aria-hidden="true" /> Mon&ndash;Fri, 09:00&ndash;17:00 (UTC+1) &middot; Prague, CZ
							</p>
						</div>
					</div>

					<div className="md:col-span-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
							Navigation
						</h3>
						<ul className="mt-4 space-y-2">
							{navigation.map((item) => (
								<li key={item.name}>
									<Link href={item.href} className="text-sm text-foreground/60 transition-colors hover:text-signal">
										{item.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="md:col-span-3">
						<h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
							Elsewhere
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
										<Github size={15} aria-hidden="true" /> {link.name}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t border-border pt-8">
					<p className="text-center text-xs text-foreground/40">
						&copy; {currentYear} Ideacomp s.r.o. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
