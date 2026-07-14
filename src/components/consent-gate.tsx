"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

/** Renders children only once the visitor has granted cookie consent. */
export function ConsentGate({ children }: { children: ReactNode }) {
	const [granted, setGranted] = useState(false);

	useEffect(() => {
		setGranted(getConsent() === "granted");
		const handler = () => setGranted(getConsent() === "granted");
		window.addEventListener(CONSENT_EVENT, handler);
		return () => window.removeEventListener(CONSENT_EVENT, handler);
	}, []);

	if (!granted) return null;
	return <>{children}</>;
}
