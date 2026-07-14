"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type Locale, type Dictionary } from "./dictionaries";
import { LOCALE_COOKIE } from "./constants";

interface LocaleContextValue {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	dict: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
	children,
	initialLocale,
}: {
	children: ReactNode;
	initialLocale: Locale;
}) {
	const [locale, setLocaleState] = useState<Locale>(initialLocale);

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	const setLocale = (next: Locale) => {
		setLocaleState(next);
		document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
	};

	return (
		<LocaleContext.Provider value={{ locale, setLocale, dict: dictionaries[locale] }}>
			{children}
		</LocaleContext.Provider>
	);
}

export function useLocale() {
	const ctx = useContext(LocaleContext);
	if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
	return ctx;
}
