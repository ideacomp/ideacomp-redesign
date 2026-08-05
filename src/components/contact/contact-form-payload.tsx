"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import {
	ChoiceGroup,
	ContactCoordinates,
	ErrorPanel,
	FieldError,
	Honeypot,
	OptionalTag,
	PrivacyNote,
	SuccessPanel,
	labelClass,
} from "./form-parts";
import {
	MESSAGE_MIN_LENGTH,
	useBudgetOptions,
	useContactForm,
	useProjectTypeOptions,
	useValueLabels,
	type ContactField,
	type ContactFormApi,
} from "./use-contact-form";

/**
 * Variant C — "Request payload".
 *
 * The form is a key/value table, and beside it the exact record that will land
 * in our inbox assembles itself as you type. It is the site's "show the system,
 * don't decorate it" principle applied to the one interaction that matters, and
 * it doubles as a privacy statement: what you can see is all there is.
 */

const rowField = cn(
	"w-full rounded-sm bg-transparent px-2 py-1.5 text-base text-foreground",
	"placeholder:text-muted-foreground outline-none",
	"transition-colors motion-safe:duration-200",
	"focus-visible:bg-foreground/[0.06] focus-visible:ring-[3px] focus-visible:ring-ring/50",
	"aria-[invalid=true]:ring-[3px] aria-[invalid=true]:ring-destructive/40"
);

function Row({
	label,
	htmlFor,
	children,
	optional,
	align = "baseline",
}: {
	label: string;
	htmlFor?: string;
	children: React.ReactNode;
	optional?: boolean;
	align?: "baseline" | "start";
}) {
	// The label sits in a narrow gutter and wraps, so the "optional" marker gets
	// its own line underneath rather than trailing the last wrapped word — where
	// it collided with the field name and read as part of it.
	const labelBody = (
		<>
			<span className="block text-foreground/80">{label}</span>
			{optional ? <OptionalTag className="mt-1.5 block" /> : null}
		</>
	);

	return (
		<div
			className={cn(
				"grid gap-x-6 gap-y-2 border-t border-border py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)]",
				align === "baseline" ? "sm:items-baseline" : "sm:items-start"
			)}
		>
			{htmlFor ? (
				<label htmlFor={htmlFor} className={cn(labelClass, "sm:pt-2.5")}>
					{labelBody}
				</label>
			) : (
				<span className={cn(labelClass, "block sm:pt-2.5")}>{labelBody}</span>
			)}
			<div className="min-w-0">{children}</div>
		</div>
	);
}

export function ContactFormPayload() {
	const { dict } = useLocale();
	const copy = dict.contactForm;
	const projectTypes = useProjectTypeOptions();
	const budgets = useBudgetOptions();
	const form = useContactForm();
	const { values, visibleErrors, setField, touchField, registerField, setActiveField, status } =
		form;

	const messageLength = values.message.trim().length;

	const focusProps = (field: ContactField) => ({
		onFocus: () => setActiveField(field),
		onBlur: () => {
			setActiveField(null);
			touchField(field);
		},
	});

	return (
		<section
			id="contact"
			className="dark scroll-mt-24 bg-background px-4 py-24 sm:px-6 lg:px-8"
			aria-labelledby="contact-form-heading"
		>
			<div className="mx-auto max-w-6xl">
				<h2
					id="contact-form-heading"
					className="max-w-2xl font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground"
				>
					{copy.heading}
				</h2>
				<p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70">{copy.intro}</p>

				<div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
					<div>
						{status === "success" ? (
							<SuccessPanel reference={form.reference} onReset={form.reset} />
						) : (
							<form onSubmit={form.submit} noValidate className="relative">
								<Honeypot valueRef={form.honeypotRef} />

								<Row label={copy.name} htmlFor="name">
									<input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										required
										value={values.name}
										onChange={(event) => setField("name", event.target.value)}
										{...focusProps("name")}
										ref={(node) => registerField("name", node)}
										aria-invalid={!!visibleErrors.name}
										aria-describedby={visibleErrors.name ? "name-error" : undefined}
										className={rowField}
									/>
									<FieldError id="name-error" message={visibleErrors.name} />
								</Row>

								<Row label={copy.email} htmlFor="email">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										value={values.email}
										onChange={(event) => setField("email", event.target.value)}
										{...focusProps("email")}
										ref={(node) => registerField("email", node)}
										aria-invalid={!!visibleErrors.email}
										aria-describedby={visibleErrors.email ? "email-error" : undefined}
										placeholder={copy.emailPlaceholder}
										className={rowField}
									/>
									<FieldError id="email-error" message={visibleErrors.email} />
								</Row>

								<Row label={copy.company} htmlFor="company" optional>
									<input
										id="company"
										name="company"
										type="text"
										autoComplete="organization"
										value={values.company}
										onChange={(event) => setField("company", event.target.value)}
										{...focusProps("company")}
										ref={(node) => registerField("company", node)}
										className={rowField}
									/>
								</Row>

								<Row label={copy.projectType} align="start">
									<ChoiceGroup
										label={copy.projectType}
										name="projectType"
										value={values.projectType}
										options={projectTypes}
										error={visibleErrors.projectType}
										onChange={(value) => {
											setField("projectType", value);
											touchField("projectType");
										}}
										onBlur={() => setActiveField(null)}
										firstOptionRef={(node) => registerField("projectType", node)}
										className="[&_legend]:sr-only"
									/>
								</Row>

								<Row label={copy.budget} optional align="start">
									<ChoiceGroup
										label={copy.budget}
										name="budget"
										value={values.budget}
										options={budgets}
										onChange={(value) => setField("budget", value)}
										onBlur={() => setActiveField(null)}
										className="[&_legend]:sr-only"
									/>
								</Row>

								<Row label={copy.projectDetails} htmlFor="message" align="start">
									<textarea
										id="message"
										name="message"
										rows={6}
										required
										value={values.message}
										onChange={(event) => setField("message", event.target.value)}
										{...focusProps("message")}
										ref={(node) => registerField("message", node)}
										aria-invalid={!!visibleErrors.message}
										aria-describedby={
											visibleErrors.message ? "message-error message-hint" : "message-hint"
										}
										placeholder={copy.projectDetailsPlaceholder}
										className={cn(rowField, "min-h-36 resize-y")}
									/>
									<div className="mt-2 flex items-start justify-between gap-6 px-2">
										<p id="message-hint" className="text-sm leading-relaxed text-foreground/60">
											{copy.projectDetailsHint}
										</p>
										{messageLength < MESSAGE_MIN_LENGTH ? (
											<span
												aria-hidden="true"
												className="shrink-0 font-mono text-xs tabular-nums text-foreground/50"
											>
												{messageLength}/{MESSAGE_MIN_LENGTH}
											</span>
										) : null}
									</div>
									<FieldError id="message-error" message={visibleErrors.message} />
								</Row>

								{status === "error" ? <ErrorPanel className="mt-8" /> : null}

								<div className="mt-8 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
									<PrivacyNote className="max-w-sm" />
									<Button
										type="submit"
										variant="signal"
										size="lg"
										disabled={status === "submitting"}
										className="w-full sm:w-auto"
										aria-label={
											status === "submitting" ? copy.submitAriaSending : copy.submitAriaIdle
										}
									>
										{status === "submitting" ? (
											<>
												<Loader2 className="animate-spin" size={18} aria-hidden="true" />
												{copy.submitSending}
											</>
										) : (
											<>
												{copy.submitIdle}
												<ArrowRight size={18} aria-hidden="true" />
											</>
										)}
									</Button>
								</div>
							</form>
						)}
					</div>

					<div className="lg:sticky lg:top-28 lg:self-start">
						<PayloadPanel form={form} />
						<ContactCoordinates className="mt-10" />
						<p className="mt-6 text-sm leading-relaxed text-foreground/60">
							{dict.contactInfo.replyNote}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

/**
 * Mirrors the form's own content, so it is hidden from assistive tech: a screen
 * reader user already has every value, and hearing each field twice would be
 * noise, not information.
 */
function PayloadPanel({ form }: { form: ContactFormApi }) {
	const { dict, locale } = useLocale();
	const copy = dict.contactForm.payload;
	const labelFor = useValueLabels();
	const { status, isComplete, activeField, reference, submittedAt } = form;
	// After a successful send the live values are cleared; the panel becomes a
	// receipt for what was actually delivered.
	const values = form.submitted ?? form.values;

	const state =
		status === "submitting"
			? { text: copy.status.sending, tone: "text-signal", pulse: true }
			: status === "success"
				? { text: copy.status.sent, tone: "text-signal", pulse: false }
				: status === "error"
					? { text: copy.status.failed, tone: "text-destructive", pulse: false }
					: isComplete
						? { text: copy.status.ready, tone: "text-signal", pulse: false }
						: { text: copy.status.draft, tone: "text-foreground/50", pulse: false };

	const rows: { field: ContactField; label: string }[] = [
		{ field: "name", label: copy.fields.name },
		{ field: "email", label: copy.fields.email },
		{ field: "company", label: copy.fields.company },
		{ field: "projectType", label: copy.fields.projectType },
		{ field: "budget", label: copy.fields.budget },
		{ field: "message", label: copy.fields.message },
	];

	return (
		<div
			aria-hidden="true"
			className="overflow-hidden rounded-lg border border-border bg-foreground/[0.03] font-mono text-[0.8125rem]"
		>
			<div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
				<span className="text-foreground/70">{copy.title}</span>
				<span className={cn("flex items-center gap-2", state.tone)}>
					<span
						className={cn(
							"size-1.5 rounded-full bg-current",
							state.pulse ? "motion-safe:animate-pulse" : ""
						)}
					/>
					{state.text}
				</span>
			</div>

			<div className="divide-y divide-border/60">
				{rows.map((row) => {
					const raw = values[row.field];
					const value = labelFor(row.field, raw);
					const isActive = activeField === row.field;
					return (
						<div
							key={row.field}
							className={cn(
								"grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 px-4 py-2.5 transition-colors motion-safe:duration-200",
								isActive ? "bg-signal/10" : ""
							)}
						>
							<span className={cn("truncate", isActive ? "text-signal" : "text-foreground/40")}>
								{row.label}
							</span>
							<span
								className={cn(
									"break-words",
									value ? "text-foreground/90" : "text-foreground/25"
								)}
							>
								{value ? (
									row.field === "message" ? (
										<span className="line-clamp-4 whitespace-pre-wrap">{value}</span>
									) : (
										value
									)
								) : (
									copy.empty
								)}
							</span>
						</div>
					);
				})}

				{status === "success" && reference ? (
					<>
						<div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 px-4 py-2.5">
							<span className="text-foreground/40">ref</span>
							<span className="text-signal">{reference}</span>
						</div>
						{submittedAt ? (
							<div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 px-4 py-2.5">
								<span className="text-foreground/40">{copy.receivedAt}</span>
								<span className="text-foreground/90">
									{submittedAt.toLocaleString(locale === "cs" ? "cs-CZ" : "en-GB")}
								</span>
							</div>
						) : null}
					</>
				) : null}
			</div>

			<p className="border-t border-border px-4 py-3 font-sans text-xs leading-relaxed text-foreground/50">
				{copy.note}
			</p>
		</div>
	);
}
