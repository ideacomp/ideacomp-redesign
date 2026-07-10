import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Detects if the user is using Firefox browser
 * @returns true if Firefox is detected, false otherwise
 */
export function isFirefox(): boolean {
	if (typeof window === "undefined") {
		return false;
	}

	return navigator.userAgent.toLowerCase().includes("firefox");
}
