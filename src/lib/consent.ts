export type ConsentValue = "granted" | "denied";

const STORAGE_KEY = "ideacomp-consent";
export const CONSENT_EVENT = "ideacomp-consent-change";

export function getConsent(): ConsentValue | null {
	if (typeof window === "undefined") return null;
	const value = window.localStorage.getItem(STORAGE_KEY);
	return value === "granted" || value === "denied" ? value : null;
}

export function setConsent(value: ConsentValue) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, value);
	window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Clears the stored choice so the banner reappears (used by "Manage cookie preferences"). */
export function resetConsent() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(STORAGE_KEY);
	window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}
