"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { content } from "@/lib/sitemap";
import { cn } from "@/lib/utils";
import type { ChoiceOption } from "./use-contact-form";

/**
 * Pieces shared by all three contact-form variants. Anything that carries
 * meaning (labels, errors, choice semantics, the delivered/failed states) lives
 * here; the variants only decide arrangement.
 */

/** Mono micro-label. The one typographic tell the form borrows from the rest of
 * the site — the process timeline's step numbers use the same family — so field
 * labels read as instrument annotations rather than as a generic form. */
export const labelClass =
	"font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground";

/**
 * The "optional" marker. Set in the body face at normal tracking so it reads as
 * an annotation *about* the label rather than more of the label, and given its
 * own breathing room — pushed up against tracked uppercase it looks like a
 * fourth word in the field name.
 */
export function OptionalTag({ className }: { className?: string }) {
	const { dict } = useLocale();
	return (
		<span
			className={cn(
				"font-sans text-xs normal-case tracking-normal text-muted-foreground",
				className
			)}
		>
			{dict.contactForm.optional}
		</span>
	);
}

export function FieldLabel({
	htmlFor,
	children,
	optional,
	className,
}: {
	htmlFor: string;
	children: ReactNode;
	optional?: boolean;
	className?: string;
}) {
	return (
		<label htmlFor={htmlFor} className={cn(labelClass, "flex items-baseline gap-3", className)}>
			<span className="text-foreground/80">{children}</span>
			{optional ? <OptionalTag /> : null}
		</label>
	);
}

export function FieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p id={id} role="alert" className="mt-2 text-sm text-destructive">
			{message}
		</p>
	);
}

/**
 * Off-screen decoy. Kept out of the tab order and hidden from assistive tech, so
 * only automated fillers ever reach it.
 */
export function Honeypot({ valueRef }: { valueRef: RefObject<string> }) {
	return (
		<div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] size-px overflow-hidden">
			<label htmlFor="contact-website">Website</label>
			<input
				id="contact-website"
				name="website"
				type="text"
				tabIndex={-1}
				autoComplete="off"
				defaultValue=""
				onChange={(event) => {
					valueRef.current = event.target.value;
				}}
			/>
		</div>
	);
}

/**
 * Replaces what used to be a native `<select>`. Every option is visible at once,
 * which is the whole point on a page whose job is to lower the cost of making
 * contact — and it removes an element that could never be styled consistently
 * across the light and dark surfaces this site alternates between.
 */
export function ChoiceGroup({
	label,
	name,
	value,
	options,
	optional,
	error,
	onChange,
	onBlur,
	firstOptionRef,
	className,
}: {
	label: string;
	name: string;
	value: string;
	options: ChoiceOption[];
	optional?: boolean;
	error?: string;
	onChange: (value: string) => void;
	onBlur?: () => void;
	firstOptionRef?: (node: HTMLInputElement | null) => void;
	className?: string;
}) {
	const errorId = `${name}-error`;

	return (
		<fieldset className={className} aria-describedby={error ? errorId : undefined}>
			<legend className={cn(labelClass, "mb-3 flex items-baseline gap-3")}>
				<span className="text-foreground/80">{label}</span>
				{optional ? <OptionalTag /> : null}
			</legend>
			<div className="flex flex-wrap gap-2">
				{options.map((option, index) => (
					<label key={option.value} className="cursor-pointer">
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={value === option.value}
							onChange={() => onChange(option.value)}
							onBlur={onBlur}
							ref={index === 0 ? firstOptionRef : undefined}
							className="peer sr-only"
						/>
						<span
							className={cn(
								"inline-flex select-none items-center rounded-md border border-border px-3.5 py-2 text-sm text-muted-foreground",
								"transition-colors motion-safe:duration-200",
								"hover:border-foreground/40 hover:text-foreground",
								"peer-checked:border-signal peer-checked:bg-signal/10 peer-checked:text-foreground",
								"peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50"
							)}
						>
							{option.label}
						</span>
					</label>
				))}
			</div>
			<FieldError id={errorId} message={error} />
		</fieldset>
	);
}

export function PrivacyNote({ className }: { className?: string }) {
	const { dict } = useLocale();
	const note = dict.contactForm.privacyNote;
	return (
		<p className={cn("text-sm leading-relaxed text-muted-foreground", className)}>
			{note.before}
			<Link
				href="/privacy"
				className="text-foreground underline decoration-signal decoration-2 underline-offset-4 hover:text-signal"
			>
				{note.link}
			</Link>
			{note.after}
		</p>
	);
}

/**
 * What the visitor gets instead of a banner that disappears after eight seconds.
 * The form is gone, the reference is quotable, and the way back is explicit.
 */
export function SuccessPanel({
	reference,
	onReset,
	className,
}: {
	reference: string | null;
	onReset: () => void;
	className?: string;
}) {
	const { dict } = useLocale();
	const headingRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		headingRef.current?.focus();
	}, []);

	return (
		<div role="status" className={cn("border-t-2 border-signal pt-8", className)}>
			<span className="inline-flex size-9 items-center justify-center rounded-md bg-signal/15 text-signal">
				<Check size={18} aria-hidden="true" />
			</span>
			<h3
				ref={headingRef}
				tabIndex={-1}
				className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground outline-none"
			>
				{dict.contactForm.successHeading}
			</h3>
			<p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
				{dict.contactForm.successMessage}
			</p>
			{reference ? (
				<p className="mt-6 font-mono text-sm text-muted-foreground">
					<span className={labelClass}>{dict.contactForm.referenceLabel}</span>{" "}
					<span className="text-signal">{reference}</span>
				</p>
			) : null}
			<Button variant="outline" className="mt-8" onClick={onReset}>
				{dict.contactForm.sendAnother}
			</Button>
		</div>
	);
}

/** Persistent — a failed send is not something to hide after a timeout. */
export function ErrorPanel({ className }: { className?: string }) {
	const { dict } = useLocale();
	return (
		<div
			role="alert"
			className={cn("border-t-2 border-destructive bg-destructive/5 p-5", className)}
		>
			<p className="font-medium text-foreground">{dict.contactForm.errorHeading}</p>
			<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
				{dict.contactForm.errorMessage}
			</p>
		</div>
	);
}

/** The "who you are reaching" block beside the form. */
export function ContactCoordinates({ className }: { className?: string }) {
	const { dict, locale } = useLocale();
	const phone = content[locale].contact.phone;

	const rows = [
		{
			icon: Mail,
			node: (
				<a href="mailto:info@ideacomp.cz" className="text-foreground hover:text-signal">
					info@ideacomp.cz
				</a>
			),
		},
		phone
			? {
					icon: Phone,
					node: (
						<a href={`tel:${phone}`} className="text-foreground hover:text-signal">
							{phone}
						</a>
					),
				}
			: null,
		{ icon: MapPin, node: <span>{dict.contactInfo.address}</span> },
		{ icon: Clock, node: <span>{dict.contactInfo.officeHours}</span> },
	].filter(Boolean) as { icon: typeof Mail; node: ReactNode }[];

	return (
		<ul className={cn("divide-y divide-border border-y border-border", className)}>
			{rows.map((row, index) => {
				const Icon = row.icon;
				return (
					<li key={index} className="flex items-center gap-3 py-3 text-sm text-muted-foreground">
						<Icon size={15} className="shrink-0 text-signal" aria-hidden="true" />
						{row.node}
					</li>
				);
			})}
		</ul>
	);
}
