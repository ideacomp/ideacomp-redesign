"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { useLocale } from "@/lib/i18n/locale-context";
import { cn } from "@/lib/utils";
import {
	ChoiceGroup,
	ContactCoordinates,
	ErrorPanel,
	FieldError,
	FieldLabel,
	Honeypot,
	PrivacyNote,
	SuccessPanel,
	labelClass,
} from "./form-parts";
import {
	MESSAGE_MIN_LENGTH,
	useBudgetOptions,
	useContactForm,
	useProjectTypeOptions,
} from "./use-contact-form";

/**
 * Variant A — "Datasheet".
 *
 * The form as a specification sheet: no card, no boxes, every input a value
 * written onto a ruled line. Reads as a document to be filled in rather than a
 * widget to be operated, which is the register the rest of the site works in.
 */

/** Ruled line instead of a box. The rule is 2px at rest so focus can recolour it
 * without moving anything, and focus is signalled by colour + a row tint rather
 * than by a ring that would look pasted onto a borderless field. */
const ruledField = cn(
	"w-full rounded-none border-0 border-b-2 border-input bg-transparent px-0 py-2.5",
	"text-base text-foreground placeholder:text-muted-foreground outline-none",
	"transition-colors motion-safe:duration-200",
	"focus:border-signal focus:bg-foreground/[0.03]",
	"aria-[invalid=true]:border-destructive"
);

export function ContactFormDatasheet() {
	const { dict } = useLocale();
	const copy = dict.contactForm;
	const projectTypes = useProjectTypeOptions();
	const budgets = useBudgetOptions();
	const form = useContactForm();
	const { values, visibleErrors, setField, touchField, registerField, status } = form;

	const messageLength = values.message.trim().length;

	return (
		<section
			id="contact"
			className="scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8"
			aria-labelledby="contact-form-heading"
		>
			<div className="mx-auto grid max-w-6xl gap-x-16 gap-y-16 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
				<aside className="order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
					<h3 className="font-display text-2xl font-semibold tracking-[-0.01em] text-foreground">
						Ideacomp s.r.o.
					</h3>
					<ContactCoordinates className="mt-6" />
					<p className="mt-6 text-sm leading-relaxed text-muted-foreground">
						{dict.contactInfo.replyNote}
					</p>
				</aside>

				<div className="order-1 lg:order-2">
					<Reveal>
						<h2
							id="contact-form-heading"
							className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground"
						>
							{copy.heading}
						</h2>
						<p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
							{copy.intro}
						</p>
					</Reveal>

					{status === "success" ? (
						<SuccessPanel className="mt-12" reference={form.reference} onReset={form.reset} />
					) : (
						<form onSubmit={form.submit} noValidate className="relative mt-12 space-y-10">
							<Honeypot valueRef={form.honeypotRef} />

							<div className="grid gap-10 sm:grid-cols-2">
								<div>
									<FieldLabel htmlFor="name">{copy.name}</FieldLabel>
									<input
										id="name"
										name="name"
										type="text"
										autoComplete="name"
										required
										value={values.name}
										onChange={(event) => setField("name", event.target.value)}
										onBlur={() => touchField("name")}
										ref={(node) => registerField("name", node)}
										aria-invalid={!!visibleErrors.name}
										aria-describedby={visibleErrors.name ? "name-error" : undefined}
										placeholder={copy.namePlaceholder}
										className={cn(ruledField, "mt-2")}
									/>
									<FieldError id="name-error" message={visibleErrors.name} />
								</div>

								<div>
									<FieldLabel htmlFor="email">{copy.email}</FieldLabel>
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										value={values.email}
										onChange={(event) => setField("email", event.target.value)}
										onBlur={() => touchField("email")}
										ref={(node) => registerField("email", node)}
										aria-invalid={!!visibleErrors.email}
										aria-describedby={visibleErrors.email ? "email-error" : undefined}
										placeholder={copy.emailPlaceholder}
										className={cn(ruledField, "mt-2")}
									/>
									<FieldError id="email-error" message={visibleErrors.email} />
								</div>
							</div>

							<div>
								<FieldLabel htmlFor="company" optional>
									{copy.company}
								</FieldLabel>
								<input
									id="company"
									name="company"
									type="text"
									autoComplete="organization"
									value={values.company}
									onChange={(event) => setField("company", event.target.value)}
									ref={(node) => registerField("company", node)}
									placeholder={copy.companyPlaceholder}
									className={cn(ruledField, "mt-2")}
								/>
							</div>

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
								firstOptionRef={(node) => registerField("projectType", node)}
							/>

							<ChoiceGroup
								label={copy.budget}
								name="budget"
								value={values.budget}
								options={budgets}
								optional
								onChange={(value) => setField("budget", value)}
							/>

							<div>
								<FieldLabel htmlFor="message">{copy.projectDetails}</FieldLabel>
								<textarea
									id="message"
									name="message"
									rows={5}
									required
									value={values.message}
									onChange={(event) => setField("message", event.target.value)}
									onBlur={() => touchField("message")}
									ref={(node) => registerField("message", node)}
									aria-invalid={!!visibleErrors.message}
									aria-describedby={
										visibleErrors.message ? "message-error message-hint" : "message-hint"
									}
									placeholder={copy.projectDetailsPlaceholder}
									className={cn(ruledField, "mt-2 min-h-32 resize-y")}
								/>
								<div className="mt-2 flex items-start justify-between gap-6">
									<p id="message-hint" className="text-sm leading-relaxed text-muted-foreground">
										{copy.projectDetailsHint}
									</p>
									{/* Only while the message is still too short — once it is long
									    enough the counter has nothing left to say. */}
									{messageLength < MESSAGE_MIN_LENGTH ? (
										<span
											aria-hidden="true"
											className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
										>
											{messageLength}/{MESSAGE_MIN_LENGTH}
										</span>
									) : null}
								</div>
								<FieldError id="message-error" message={visibleErrors.message} />
							</div>

							{status === "error" ? <ErrorPanel /> : null}

							<div className="flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
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

							<p className={cn(labelClass, "sr-only")} aria-live="polite">
								{status === "submitting" ? copy.submitSending : ""}
							</p>
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
