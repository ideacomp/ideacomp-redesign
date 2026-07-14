"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
	const { locale, setLocale, dict } = useLocale();

	return (
		<div
			role="group"
			aria-label={dict.languageSwitcher.label}
			className={cn("flex items-center gap-1.5 text-sm font-medium", className)}
		>
			<button
				type="button"
				onClick={() => setLocale("en")}
				aria-pressed={locale === "en"}
				className={locale === "en" ? "text-signal" : "text-foreground/50 hover:text-foreground"}
			>
				EN
			</button>
			<span className="text-foreground/30" aria-hidden="true">
				/
			</span>
			<button
				type="button"
				onClick={() => setLocale("cs")}
				aria-pressed={locale === "cs"}
				className={locale === "cs" ? "text-signal" : "text-foreground/50 hover:text-foreground"}
			>
				CS
			</button>
		</div>
	);
}
