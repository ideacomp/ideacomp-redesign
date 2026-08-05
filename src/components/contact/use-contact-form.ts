"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * One source of truth for the contact form: values, validation, submission and
 * the resulting status. The three visual variants under `components/contact/`
 * differ only in how they lay this out — none of them owns any of it, so a fix
 * to validation or delivery cannot apply to one variant and miss the others.
 */

export const REQUIRED_FIELDS = ["name", "email", "projectType", "message"] as const;
export type RequiredField = (typeof REQUIRED_FIELDS)[number];
export type ContactField = RequiredField | "company" | "budget";

export type ContactValues = Record<ContactField, string>;

export type FormStatus = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactValues = {
	name: "",
	email: "",
	company: "",
	projectType: "",
	budget: "",
	message: "",
};

/* Deliberately permissive: the address is verified by us replying to it, so the
   only job here is catching a typo before the visitor walks away thinking they
   sent something. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Below this a message carries no information we could answer usefully. */
export const MESSAGE_MIN_LENGTH = 20;

export interface ChoiceOption {
	value: string;
	label: string;
}

type FocusableField = HTMLInputElement | HTMLTextAreaElement | HTMLElement;

function makeReference() {
	const stamp = Date.now().toString(36).toUpperCase();
	const salt = Math.random().toString(36).slice(2, 5).toUpperCase();
	return `IDC-${stamp}-${salt}`;
}

export function useContactForm() {
	const { dict } = useLocale();
	const validation = dict.contactForm.validation;

	const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
	// What was actually delivered, kept after `values` is cleared so a receipt
	// can show the visitor the record we hold rather than an emptied form.
	const [submitted, setSubmitted] = useState<ContactValues | null>(null);
	const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
	const [status, setStatus] = useState<FormStatus>("idle");
	const [reference, setReference] = useState<string | null>(null);
	const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
	const [activeField, setActiveField] = useState<ContactField | null>(null);

	// Bots fill everything they find. A real visitor never sees this input, so
	// anything in it means the submission is machine-written: we drop it and
	// report success rather than tell the bot what gave it away.
	const honeypot = useRef("");
	const fieldRefs = useRef<Partial<Record<ContactField, FocusableField | null>>>({});

	const errors = useMemo(() => {
		const next: Partial<Record<RequiredField, string>> = {};
		if (!values.name.trim()) next.name = validation.name;
		if (!values.email.trim()) next.email = validation.email;
		else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = validation.emailFormat;
		if (!values.projectType) next.projectType = validation.projectType;
		const message = values.message.trim();
		if (!message) next.message = validation.message;
		else if (message.length < MESSAGE_MIN_LENGTH) next.message = validation.messageShort;
		return next;
	}, [values, validation]);

	/** Errors the visitor has earned the right to see — never while first typing. */
	const visibleErrors = useMemo(() => {
		const next: Partial<Record<RequiredField, string>> = {};
		for (const field of REQUIRED_FIELDS) {
			if (touched[field] && errors[field]) next[field] = errors[field];
		}
		return next;
	}, [errors, touched]);

	const isComplete = Object.keys(errors).length === 0;

	const setField = useCallback((field: ContactField, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	}, []);

	const touchField = useCallback((field: ContactField) => {
		setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
	}, []);

	const registerField = useCallback((field: ContactField, node: FocusableField | null) => {
		fieldRefs.current[field] = node;
	}, []);

	const focusField = useCallback((field: ContactField) => {
		fieldRefs.current[field]?.focus();
	}, []);

	/**
	 * Reveals the errors for a subset of fields and moves focus to the first one
	 * that fails. Used both by the single-page variants on submit and by the
	 * staged variant on each step boundary.
	 */
	const revealErrors = useCallback(
		(fields: readonly ContactField[] = REQUIRED_FIELDS) => {
			setTouched((prev) => {
				const next = { ...prev };
				for (const field of fields) next[field] = true;
				return next;
			});
			const firstInvalid = fields.find((field) =>
				REQUIRED_FIELDS.includes(field as RequiredField)
					? errors[field as RequiredField]
					: undefined
			);
			if (firstInvalid) {
				// After the error text has been rendered, so screen readers announce
				// the message together with the focus move.
				requestAnimationFrame(() => focusField(firstInvalid));
				return false;
			}
			return true;
		},
		[errors, focusField]
	);

	const reset = useCallback(() => {
		setValues(EMPTY_VALUES);
		setSubmitted(null);
		setTouched({});
		setStatus("idle");
		setReference(null);
		setSubmittedAt(null);
		honeypot.current = "";
	}, []);

	const submit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();
			if (status === "submitting") return;

			if (honeypot.current.trim()) {
				setStatus("success");
				setValues(EMPTY_VALUES);
				return;
			}

			if (!revealErrors()) return;

			setStatus("submitting");
			const ticket = makeReference();

			try {
				const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
				const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
				const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

				if (!serviceId || !templateId || !publicKey) {
					throw new Error(
						"EmailJS configuration is missing. Please check your environment variables."
					);
				}

				await emailjs.send(
					serviceId,
					templateId,
					{
						from_name: values.name,
						from_email: values.email,
						company: values.company,
						project_type: values.projectType,
						budget: values.budget,
						message: values.message,
						reference: ticket,
						to_email: "info@ideacomp.cz",
					},
					publicKey
				);

				setReference(ticket);
				setSubmittedAt(new Date());
				setSubmitted(values);
				setValues(EMPTY_VALUES);
				setTouched({});
				setStatus("success");
			} catch (error) {
				console.error("Email sending failed:", error);
				setStatus("error");
			}
		},
		[revealErrors, status, values]
	);

	return {
		values,
		submitted,
		errors,
		visibleErrors,
		isComplete,
		status,
		reference,
		submittedAt,
		activeField,
		setActiveField,
		setField,
		touchField,
		registerField,
		revealErrors,
		focusField,
		submit,
		reset,
		honeypotRef: honeypot,
	};
}

export type ContactFormApi = ReturnType<typeof useContactForm>;

export function useProjectTypeOptions(): ChoiceOption[] {
	const { dict } = useLocale();
	const options = dict.contactForm.projectTypeOptions;
	return [
		{ value: "web-app", label: options.webApp },
		{ value: "mobile-app", label: options.mobileApp },
		{ value: "ai-ml", label: options.aiMl },
		{ value: "cybersecurity", label: options.cybersecurity },
		{ value: "cloud-devops", label: options.cloudDevops },
		{ value: "outsourcing", label: options.outsourcing },
		{ value: "other", label: options.other },
	];
}

export function useBudgetOptions(): ChoiceOption[] {
	const { dict } = useLocale();
	const options = dict.contactForm.budgetShortOptions;
	return [
		{ value: "under-10k", label: options.under10k },
		{ value: "10k-25k", label: options.range10to25 },
		{ value: "25k-50k", label: options.range25to50 },
		{ value: "50k-100k", label: options.range50to100 },
		{ value: "100k-plus", label: options.over100 },
		{ value: "discuss", label: options.discuss },
	];
}

/** Long-form label for a stored value — used by the live payload panel. */
export function useValueLabels() {
	const projectTypes = useProjectTypeOptions();
	const budgets = useBudgetOptions();
	return useCallback(
		(field: ContactField, value: string) => {
			if (!value) return "";
			if (field === "projectType") {
				return projectTypes.find((option) => option.value === value)?.label ?? value;
			}
			if (field === "budget") {
				return budgets.find((option) => option.value === value)?.label ?? value;
			}
			return value;
		},
		[budgets, projectTypes]
	);
}
