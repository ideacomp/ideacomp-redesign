"use client";

import { ContactFormDatasheet } from "./contact-form-datasheet";
import { ContactFormPayload } from "./contact-form-payload";
import { ContactFormStaged } from "./contact-form-staged";

/**
 * Three arrangements of the same form. All share `use-contact-form.ts` and
 * `form-parts.tsx`, so picking one is a layout decision only — validation,
 * delivery, spam handling and the success/failure states are identical.
 *
 * Compare them side by side at /contact/variants.
 */
export const CONTACT_FORM_VARIANTS = {
	/** Ruled spec-sheet on the light surface. The quiet, document-like option. */
	datasheet: ContactFormDatasheet,
	/** Three steps on the dark surface, with the process timeline's filling track. */
	staged: ContactFormStaged,
	/** Key/value form beside the live record of what will be sent. */
	payload: ContactFormPayload,
} as const;

export type ContactFormVariant = keyof typeof CONTACT_FORM_VARIANTS;

/** The variant the live /contact page ships. Change this one word to switch. */
export const ACTIVE_CONTACT_FORM_VARIANT: ContactFormVariant = "payload";

export function ContactFormSection({
	variant = ACTIVE_CONTACT_FORM_VARIANT,
}: {
	variant?: ContactFormVariant;
}) {
	const Variant = CONTACT_FORM_VARIANTS[variant];
	return <Variant />;
}

export { ContactFormDatasheet, ContactFormPayload, ContactFormStaged };
