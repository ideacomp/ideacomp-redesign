"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
	type ContactField,
} from "./use-contact-form";

/**
 * Variant B — "Staged intake".
 *
 * Three questions instead of one wall of six fields, in the order a technical
 * conversation actually starts: what, then why, then who. The filling track at
 * the top is the same device the "How We Work" timeline uses, so progress on
 * this form reads as the same system as progress through a project.
 */

const panelField = cn(
	"w-full rounded-md border border-input bg-foreground/[0.04] px-4 py-3.5",
	"text-base text-foreground placeholder:text-muted-foreground outline-none",
	"transition-[color,box-shadow,border-color] motion-safe:duration-200",
	"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
	"aria-[invalid=true]:border-destructive"
);

export function ContactFormStaged() {
	const { dict } = useLocale();
	const copy = dict.contactForm;
	const projectTypes = useProjectTypeOptions();
	const budgets = useBudgetOptions();
	const form = useContactForm();
	const { values, visibleErrors, setField, touchField, registerField, status } = form;

	const shouldReduceMotion = useReducedMotion();
	// `useReducedMotion` is null until hydration; branching the rendered tree on
	// it would make the server and client disagree. Read it only once mounted.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const animate = mounted && !shouldReduceMotion;

	const [step, setStep] = useState(0);
	const stepHeadingRef = useRef<HTMLParagraphElement>(null);
	const hasNavigated = useRef(false);

	const steps: { key: string; title: string; hint: string; fields: ContactField[] }[] = [
		{ ...copy.steps.scope, key: "scope", fields: ["projectType", "budget"] },
		{ ...copy.steps.brief, key: "brief", fields: ["message", "company"] },
		{ ...copy.steps.identity, key: "identity", fields: ["name", "email"] },
	];
	const lastStep = steps.length - 1;
	const current = steps[step];

	useEffect(() => {
		if (!hasNavigated.current) return;
		stepHeadingRef.current?.focus();
	}, [step]);

	const goTo = (next: number) => {
		hasNavigated.current = true;
		setStep(next);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (step < lastStep) {
			if (form.revealErrors(current.fields)) goTo(step + 1);
			return;
		}
		form.submit(event);
	};

	const messageLength = values.message.trim().length;
	const slide = animate ? 24 : 0;

	return (
		<section
			id="contact"
			className="dark scroll-mt-24 bg-background px-4 py-24 sm:px-6 lg:px-8"
			aria-labelledby="contact-form-heading"
		>
			<div className="mx-auto grid max-w-6xl gap-x-16 gap-y-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
				<div>
					<h2
						id="contact-form-heading"
						className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground"
					>
						{copy.heading}
					</h2>
					<p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70">
						{copy.intro}
					</p>

					{status === "success" ? (
						<SuccessPanel className="mt-12" reference={form.reference} onReset={form.reset} />
					) : (
						<form onSubmit={handleSubmit} noValidate className="relative mt-12">
							<Honeypot valueRef={form.honeypotRef} />

							{/* Progress track — the filling rule from the process timeline, laid flat. */}
							<div className="flex gap-1.5" aria-hidden="true">
								{steps.map((entry, index) => (
									<span key={entry.key} className="h-0.5 flex-1 overflow-hidden bg-border">
										<motion.span
											className="block h-full origin-left bg-signal"
											initial={false}
											animate={{ scaleX: index <= step ? 1 : 0 }}
											transition={
												animate ? { duration: 0.5, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }
											}
										/>
									</span>
								))}
							</div>

							<div className="mt-4 flex items-baseline justify-between gap-4">
								<p ref={stepHeadingRef} tabIndex={-1} className="text-lg font-medium text-foreground outline-none">
									{current.title}
									<span className="ml-3 text-sm font-normal text-foreground/60">{current.hint}</span>
								</p>
								<span className={cn(labelClass, "shrink-0 tabular-nums")}>
									{copy.steps.progress
										.replace("{current}", String(step + 1))
										.replace("{total}", String(steps.length))}
								</span>
							</div>

							<div className="mt-8 min-h-[15rem]">
								<AnimatePresence mode="wait" initial={false}>
									<motion.div
										key={current.key}
										initial={{ opacity: 0, x: slide }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -slide }}
										transition={{ duration: animate ? 0.32 : 0, ease: [0.16, 1, 0.3, 1] }}
										className="space-y-8"
									>
										{step === 0 ? (
											<>
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
											</>
										) : null}

										{step === 1 ? (
											<>
												<div>
													<FieldLabel htmlFor="message" className="mb-2">
														{copy.projectDetails}
													</FieldLabel>
													<textarea
														id="message"
														name="message"
														rows={6}
														required
														value={values.message}
														onChange={(event) => setField("message", event.target.value)}
														onBlur={() => touchField("message")}
														ref={(node) => registerField("message", node)}
														aria-invalid={!!visibleErrors.message}
														aria-describedby={
															visibleErrors.message
																? "message-error message-hint"
																: "message-hint"
														}
														placeholder={copy.projectDetailsPlaceholder}
														className={cn(panelField, "min-h-40 resize-y")}
													/>
													<div className="mt-2 flex items-start justify-between gap-6">
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
												</div>
												<div>
													<FieldLabel htmlFor="company" className="mb-2" optional>
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
														className={panelField}
													/>
												</div>
											</>
										) : null}

										{step === 2 ? (
											<>
												<div className="grid gap-8 sm:grid-cols-2">
													<div>
														<FieldLabel htmlFor="name" className="mb-2">
															{copy.name}
														</FieldLabel>
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
															className={panelField}
														/>
														<FieldError id="name-error" message={visibleErrors.name} />
													</div>
													<div>
														<FieldLabel htmlFor="email" className="mb-2">
															{copy.email}
														</FieldLabel>
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
															className={panelField}
														/>
														<FieldError id="email-error" message={visibleErrors.email} />
													</div>
												</div>
												{status === "error" ? <ErrorPanel /> : null}
												<PrivacyNote className="max-w-md" />
											</>
										) : null}
									</motion.div>
								</AnimatePresence>
							</div>

							<div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-8">
								<Button
									type="button"
									variant="ghost"
									onClick={() => goTo(step - 1)}
									disabled={step === 0}
									className={step === 0 ? "invisible" : ""}
								>
									<ArrowLeft size={18} aria-hidden="true" />
									{copy.steps.back}
								</Button>

								{step < lastStep ? (
									<Button type="submit" variant="signal" size="lg">
										{copy.steps.next}
										<ArrowRight size={18} aria-hidden="true" />
									</Button>
								) : (
									<Button
										type="submit"
										variant="signal"
										size="lg"
										disabled={status === "submitting"}
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
								)}
							</div>
						</form>
					)}
				</div>

				<aside className="lg:sticky lg:top-28 lg:self-start">
					<h3 className="font-display text-2xl font-semibold tracking-[-0.01em] text-foreground">
						Ideacomp s.r.o.
					</h3>
					<ContactCoordinates className="mt-6" />
					<p className="mt-6 text-sm leading-relaxed text-foreground/60">
						{dict.contactInfo.replyNote}
					</p>
				</aside>
			</div>
		</section>
	);
}
