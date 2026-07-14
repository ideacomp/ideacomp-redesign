"use client";

import { Mail, Clock, MapPin, Phone, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import emailjs from "@emailjs/browser";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { content, faqs } from "@/lib/sitemap";
import { useLocale } from "@/lib/i18n/locale-context";

const Contact = () => {
	const { dict, locale } = useLocale();
	const pageContent = content[locale];
	const shouldReduceMotion = useReducedMotion();
	const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});

	const toggleFaq = (index: number) => {
		setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
	};
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		company: "",
		projectType: "",
		budget: "",
		message: "",
	});
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showErrorMessage, setShowErrorMessage] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setShowErrorMessage(false);
		setShowSuccessMessage(false);
		try {
			const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
			const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
			const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

			if (!serviceId || !templateId || !publicKey) {
				throw new Error(
					"EmailJS configuration is missing. Please check your environment variables."
				);
			}

			const templateParams = {
				from_name: formData.name,
				from_email: formData.email,
				company: formData.company,
				project_type: formData.projectType,
				budget: formData.budget,
				message: formData.message,
				to_email: "info@ideacomp.cz",
			};

			await emailjs.send(serviceId, templateId, templateParams, publicKey);

			setFormData({
				name: "",
				email: "",
				company: "",
				projectType: "",
				budget: "",
				message: "",
			});
			setShowSuccessMessage(true);

			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 8000);
		} catch (error) {
			console.error("Email sending failed:", error);
			setShowErrorMessage(true);

			setTimeout(() => {
				setShowErrorMessage(false);
			}, 8000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero */}
			<section
				className="dark relative flex min-h-[320px] items-center overflow-hidden bg-background px-4 pt-32 pb-16 sm:px-6 lg:px-8"
				aria-labelledby="hero-heading"
			>
				<HeroBackdrop />
				<div className="relative mx-auto max-w-4xl">
					<h1
						id="hero-heading"
						className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground"
					>
						{pageContent.contact.hero.title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
						{pageContent.contact.hero.subtitle}
					</p>
				</div>
			</section>

			{/* FAQ */}
			<section className="px-4 pt-20 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
				<div className="mx-auto max-w-3xl">
					<Reveal>
						<h2 id="faq-heading" className="font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
							{dict.faq.heading}
						</h2>
						<p className="mt-3 text-base text-muted-foreground">{dict.faq.subtitle}</p>
					</Reveal>

					<div className="mt-8 divide-y divide-border">
						{faqs[locale].map((item, i) => {
							const isOpen = !!openFaqs[i];
							return (
								<Reveal key={item.question} delay={i * 0.04}>
									<div className="py-5">
										<button
											type="button"
											onClick={() => toggleFaq(i)}
											aria-expanded={isOpen}
											aria-controls={`faq-answer-${i}`}
											className="flex w-full cursor-pointer items-center justify-between gap-4 text-left font-medium text-foreground"
										>
											{item.question}
											<ChevronDown
												className={`size-4 shrink-0 text-signal transition-transform duration-300 ${
													isOpen ? "rotate-180" : ""
												}`}
												aria-hidden="true"
											/>
										</button>
										<AnimatePresence initial={false}>
											{isOpen && (
												<motion.div
													id={`faq-answer-${i}`}
													key="content"
													initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
													transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
													className="overflow-hidden"
												>
													<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
														{item.answer}
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</Reveal>
							);
						})}
					</div>
				</div>
			</section>

			{/* Contact */}
			<section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="form-heading">
				<div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
					{/* Trust sidebar */}
					<div>
						<h2 id="form-heading" className="font-display text-2xl font-semibold tracking-[-0.01em] text-foreground">
							Ideacomp s.r.o.
						</h2>
						<div className="mt-6 space-y-4 text-sm text-muted-foreground">
							<a href="mailto:info@ideacomp.cz" className="flex items-start gap-3 hover:text-foreground">
								<Mail size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
								info@ideacomp.cz
							</a>
							{pageContent.contact.phone && (
								<a href={`tel:${pageContent.contact.phone}`} className="flex items-start gap-3 hover:text-foreground">
									<Phone size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
									{pageContent.contact.phone}
								</a>
							)}
							<p className="flex items-start gap-3">
								<MapPin size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
								{dict.contactInfo.address}
							</p>
							<p className="flex items-start gap-3">
								<Clock size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
								{dict.contactInfo.officeHours}
							</p>
						</div>
						<p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
							{dict.contactInfo.replyNote}
						</p>
					</div>

					{/* Form */}
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">{dict.contactForm.heading}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{showSuccessMessage && (
								<div
									role="status"
									className="rounded-lg border border-signal/30 bg-signal/10 p-4 text-sm text-foreground"
								>
									{dict.contactForm.successMessage}
								</div>
							)}

							{showErrorMessage && (
								<div
									role="alert"
									className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground"
								>
									{dict.contactForm.errorMessage}
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="name">{dict.contactForm.name}</Label>
										<Input
											id="name"
											name="name"
											type="text"
											value={formData.name}
											onChange={handleInputChange}
											placeholder={dict.contactForm.namePlaceholder}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">{dict.contactForm.email}</Label>
										<Input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder={dict.contactForm.emailPlaceholder}
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="company">{dict.contactForm.company}</Label>
									<Input
										id="company"
										name="company"
										type="text"
										value={formData.company}
										onChange={handleInputChange}
										placeholder={dict.contactForm.companyPlaceholder}
									/>
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="projectType">{dict.contactForm.projectType}</Label>
										<select
											id="projectType"
											name="projectType"
											value={formData.projectType}
											onChange={handleInputChange}
											className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
											required
										>
											<option value="">{dict.contactForm.projectTypeOptions.placeholder}</option>
											<option value="web-app">{dict.contactForm.projectTypeOptions.webApp}</option>
											<option value="mobile-app">{dict.contactForm.projectTypeOptions.mobileApp}</option>
											<option value="ai-ml">{dict.contactForm.projectTypeOptions.aiMl}</option>
											<option value="cybersecurity">{dict.contactForm.projectTypeOptions.cybersecurity}</option>
											<option value="cloud-devops">{dict.contactForm.projectTypeOptions.cloudDevops}</option>
											<option value="outsourcing">{dict.contactForm.projectTypeOptions.outsourcing}</option>
											<option value="other">{dict.contactForm.projectTypeOptions.other}</option>
										</select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="budget">{dict.contactForm.budget}</Label>
										<select
											id="budget"
											name="budget"
											value={formData.budget}
											onChange={handleInputChange}
											className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
										>
											<option value="">{dict.contactForm.budgetOptions.placeholder}</option>
											<option value="under-10k">{dict.contactForm.budgetOptions.under10k}</option>
											<option value="10k-25k">{dict.contactForm.budgetOptions.range10to25}</option>
											<option value="25k-50k">{dict.contactForm.budgetOptions.range25to50}</option>
											<option value="50k-100k">{dict.contactForm.budgetOptions.range50to100}</option>
											<option value="100k-plus">{dict.contactForm.budgetOptions.over100}</option>
											<option value="discuss">{dict.contactForm.budgetOptions.discuss}</option>
										</select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="message">{dict.contactForm.projectDetails}</Label>
									<Textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleInputChange}
										rows={5}
										placeholder={dict.contactForm.projectDetailsPlaceholder}
										required
									/>
								</div>

								<Button
									type="submit"
									disabled={isSubmitting}
									variant="signal"
									size="lg"
									className="w-full"
									aria-label={
										isSubmitting
											? dict.contactForm.submitAriaSending
											: dict.contactForm.submitAriaIdle
									}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="animate-spin" size={18} aria-hidden="true" />
											{dict.contactForm.submitSending}
										</>
									) : (
										<>
											{dict.contactForm.submitIdle}
											<ArrowRight size={18} aria-hidden="true" />
										</>
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Contact;
