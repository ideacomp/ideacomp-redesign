"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONSENT_EVENT, getConsent, resetConsent, setConsent } from "@/lib/consent";
import { useLocale } from "@/lib/i18n/locale-context";

export function CookieConsentBanner() {
	const [visible, setVisible] = useState(false);
	const { dict } = useLocale();

	useEffect(() => {
		const sync = () => setVisible(getConsent() === null);
		sync();
		window.addEventListener(CONSENT_EVENT, sync);
		return () => window.removeEventListener(CONSENT_EVENT, sync);
	}, []);

	if (!visible) return null;

	return (
		<div
			role="dialog"
			aria-live="polite"
			aria-label="Cookie consent"
			className="dark fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/98 backdrop-blur-md"
		>
			<div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
				<p className="text-sm leading-relaxed text-foreground/80">
					{dict.cookieBanner.text}{" "}
					<Link href="/privacy" className="underline underline-offset-4 hover:text-signal">
						{dict.footer.legal.privacy}
					</Link>
				</p>
				<div className="flex shrink-0 gap-3">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setConsent("denied");
							setVisible(false);
						}}
					>
						{dict.cookieBanner.reject}
					</Button>
					<Button
						variant="signal"
						size="sm"
						onClick={() => {
							setConsent("granted");
							setVisible(false);
						}}
					>
						{dict.cookieBanner.accept}
					</Button>
				</div>
			</div>
		</div>
	);
}

/** Reopens the banner — used by the footer's "Manage cookie preferences" link. */
export function ManageCookiePreferences({ className }: { className?: string }) {
	const { dict } = useLocale();
	return (
		<button type="button" onClick={() => resetConsent()} className={className}>
			{dict.footer.managePreferences}
		</button>
	);
}
