"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { ManageCookiePreferences } from "@/components/cookie-consent";
import { content } from "@/lib/sitemap";
import { useLocale } from "@/lib/i18n/locale-context";

const PrivacyContent = () => {
	const { dict, locale } = useLocale();
	const pageContent = content[locale];
	const p = dict.privacy;

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<h1 className="font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
						{pageContent.privacy.hero.title}
					</h1>
					<p className="mt-3 text-sm text-muted-foreground">{pageContent.privacy.hero.subtitle}</p>

					<div className="prose-ink mt-12 max-w-[70ch] space-y-10 text-foreground/85">
						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.whoWeAre.heading}</h2>
							<p className="mt-3 leading-relaxed">
								{p.whoWeAre.before}
								<a href="mailto:info@ideacomp.cz" className="underline underline-offset-4 hover:text-signal">
									info@ideacomp.cz
								</a>
								{p.whoWeAre.after}
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.whatWeCollect.heading}</h2>
							<p className="mt-3 leading-relaxed">
								<strong className="text-foreground">{p.whatWeCollect.contactForm.label}</strong>{" "}
								{p.whatWeCollect.contactForm.text}
							</p>
							<p className="mt-3 leading-relaxed">
								<strong className="text-foreground">{p.whatWeCollect.analytics.label}</strong>{" "}
								{p.whatWeCollect.analytics.text}
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.whyWeProcess.heading}</h2>
							<p className="mt-3 leading-relaxed">{p.whyWeProcess.text}</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.whoWeShare.heading}</h2>
							<p className="mt-3 leading-relaxed">{p.whoWeShare.intro}</p>
							<ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
								<li>
									<strong className="text-foreground">{p.whoWeShare.processors.emailjs.name}</strong> —{" "}
									{p.whoWeShare.processors.emailjs.text}
								</li>
								<li>
									<strong className="text-foreground">{p.whoWeShare.processors.googleAnalytics.name}</strong> —{" "}
									{p.whoWeShare.processors.googleAnalytics.text}
								</li>
								<li>
									<strong className="text-foreground">{p.whoWeShare.processors.engageTrack.name}</strong> —{" "}
									{p.whoWeShare.processors.engageTrack.text}
								</li>
							</ul>
							<p className="mt-3 leading-relaxed">{p.whoWeShare.closing}</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.howLongWeKeep.heading}</h2>
							<p className="mt-3 leading-relaxed">{p.howLongWeKeep.text}</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.yourRights.heading}</h2>
							<p className="mt-3 leading-relaxed">
								{p.yourRights.before}
								<a href="mailto:info@ideacomp.cz" className="underline underline-offset-4 hover:text-signal">
									info@ideacomp.cz
								</a>
								{p.yourRights.after}
							</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.cookies.heading}</h2>
							<p className="mt-3 leading-relaxed">{p.cookies.text}</p>
							<ManageCookiePreferences className="mt-3 inline-block text-sm font-medium text-signal underline underline-offset-4" />
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.security.heading}</h2>
							<p className="mt-3 leading-relaxed">{p.security.text}</p>
						</section>

						<section>
							<h2 className="font-display text-2xl font-semibold text-foreground">{p.changes.heading}</h2>
							<p className="mt-3 leading-relaxed">{p.changes.text}</p>
						</section>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default PrivacyContent;
