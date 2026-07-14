import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ManageCookiePreferences } from "@/components/cookie-consent";
import { content } from "@/lib/sitemap";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"How Ideacomp s.r.o. collects, uses, and protects personal data submitted through this site, including contact form data and consent-gated analytics.",
	alternates: {
		canonical: "https://ideacomp.cz/privacy",
	},
	robots: {
		index: true,
		follow: true,
	},
};

const Privacy = () => {
	return (
		<div className="min-h-screen bg-background">
			<Header />

			<section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<h1 className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
						{content.privacy.hero.title}
					</h1>
					<p className="mt-3 text-sm text-muted-foreground">{content.privacy.hero.subtitle}</p>

					<div className="prose-ink mt-12 max-w-[70ch] space-y-10 text-foreground/85">
						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Who we are</h2>
							<p className="mt-3 leading-relaxed">
								Ideacomp s.r.o. ("Ideacomp", "we", "us"), based in Prague, Czech
								Republic, is the data controller for the personal data described in
								this policy. For any privacy question or request, contact us at{" "}
								<a href="mailto:info@ideacomp.cz" className="underline underline-offset-4 hover:text-signal">
									info@ideacomp.cz
								</a>
								.
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">What we collect</h2>
							<p className="mt-3 leading-relaxed">
								<strong className="text-foreground">Contact form.</strong> When you
								submit the form on our Contact page, we collect the information you
								provide: name, email address, company/organization (optional),
								project type, budget range, and your message. We use this only to
								respond to your inquiry.
							</p>
							<p className="mt-3 leading-relaxed">
								<strong className="text-foreground">Analytics — only after you
								consent.</strong> If you accept the cookie banner, we load Google
								Analytics and EngageTrack, which collect standard web analytics data
								(pages visited, approximate location, device/browser type, referral
								source). Neither loads before you accept, and you can withdraw
								consent at any time (see "Cookies" below).
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Why we process it</h2>
							<p className="mt-3 leading-relaxed">
								Contact form data is processed to respond to your inquiry and, where
								relevant, to take steps toward a contract at your request (GDPR
								Art. 6(1)(b)) or on the basis of our legitimate interest in
								responding to business inquiries (Art. 6(1)(f)). Analytics data is
								processed solely on the basis of your consent (Art. 6(1)(a)), which
								you may withdraw at any time without affecting the lawfulness of
								processing before withdrawal.
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Who we share it with</h2>
							<p className="mt-3 leading-relaxed">
								We use the following processors, each acting under its own data
								processing terms:
							</p>
							<ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
								<li>
									<strong className="text-foreground">EmailJS</strong> — delivers
									contact form submissions to our inbox.
								</li>
								<li>
									<strong className="text-foreground">Google Analytics</strong> —
									website analytics, loaded only after consent.
								</li>
								<li>
									<strong className="text-foreground">EngageTrack</strong> — website
									analytics, loaded only after consent.
								</li>
							</ul>
							<p className="mt-3 leading-relaxed">
								We do not sell personal data, and we do not share it with third
								parties for their own marketing purposes.
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">How long we keep it</h2>
							<p className="mt-3 leading-relaxed">
								Contact form submissions are retained for as long as necessary to
								respond to your inquiry and maintain reasonable business records —
								typically no more than 24 months — unless a longer period is
								required by law or an ongoing contractual relationship. Analytics
								data is retained per Google Analytics' and EngageTrack's standard
								retention settings and is deleted immediately if you withdraw
								consent going forward.
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Your rights</h2>
							<p className="mt-3 leading-relaxed">
								Under the GDPR, you have the right to access, correct, or erase your
								personal data, to restrict or object to its processing, to data
								portability, and to withdraw consent at any time. To exercise any of
								these rights, contact us at{" "}
								<a href="mailto:info@ideacomp.cz" className="underline underline-offset-4 hover:text-signal">
									info@ideacomp.cz
								</a>
								. You also have the right to lodge a complaint with the Czech Office
								for Personal Data Protection (Úřad pro ochranu osobních údajů), the
								supervisory authority for the Czech Republic.
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Cookies</h2>
							<p className="mt-3 leading-relaxed">
								We use a single essential-vs-analytics distinction: nothing beyond
								what's strictly necessary to run the site loads until you accept the
								cookie banner. You can change your choice at any time.
							</p>
							<ManageCookiePreferences className="mt-3 inline-block text-sm font-medium text-signal underline underline-offset-4" />
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Security</h2>
							<p className="mt-3 leading-relaxed">
								This site is served over HTTPS, and access to systems that handle
								your data is restricted to the people who need it to do their job.
								No system is perfectly secure, but we treat the data you share with
								the same care we design into the systems we build for clients.
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">Changes to this policy</h2>
							<p className="mt-3 leading-relaxed">
								We'll update the "last updated" date above if this policy changes
								materially. Continued use of the site after an update constitutes
								acceptance of the revised policy.
							</p>
						</section>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Privacy;
