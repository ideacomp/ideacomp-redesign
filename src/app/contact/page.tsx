"use client";

import { Mail, Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { content } from "@/lib/sitemap";

const Contact = () => {
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
						{content.contact.hero.title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
						{content.contact.hero.subtitle}
					</p>
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
							<p className="flex items-start gap-3">
								<MapPin size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
								Prague, Czech Republic
							</p>
							<p className="flex items-start gap-3">
								<Clock size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden="true" />
								Mon&ndash;Fri, 09:00&ndash;17:00 (UTC+1)
							</p>
						</div>
						<p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
							We read every submission personally. Expect a reply within one
							business day with a straight answer on scope, timeline, and fit.
						</p>
					</div>

					{/* Form */}
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">Tell Us About Your Project</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{showSuccessMessage && (
								<div
									role="status"
									className="rounded-lg border border-signal/30 bg-signal/10 p-4 text-sm text-foreground"
								>
									Message sent successfully. We&apos;ll get back to you within
									one business day.
								</div>
							)}

							{showErrorMessage && (
								<div
									role="alert"
									className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground"
								>
									Failed to send message. Please try again or email us
									directly at info@ideacomp.cz.
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="name">Name *</Label>
										<Input
											id="name"
											name="name"
											type="text"
											value={formData.name}
											onChange={handleInputChange}
											placeholder="Your full name"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email *</Label>
										<Input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder="your@email.com"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="company">Company/Organization</Label>
									<Input
										id="company"
										name="company"
										type="text"
										value={formData.company}
										onChange={handleInputChange}
										placeholder="Your company name (optional)"
									/>
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="projectType">Project Type *</Label>
										<select
											id="projectType"
											name="projectType"
											value={formData.projectType}
											onChange={handleInputChange}
											className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
											required
										>
											<option value="">Select project type</option>
											<option value="web-app">Web Application</option>
											<option value="mobile-app">Mobile App</option>
											<option value="ai-ml">AI/ML Solution</option>
											<option value="cybersecurity">Cybersecurity</option>
											<option value="cloud-devops">Cloud/DevOps</option>
											<option value="outsourcing">Outsourcing / Team Augmentation</option>
											<option value="other">Other</option>
										</select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="budget">Budget Range</Label>
										<select
											id="budget"
											name="budget"
											value={formData.budget}
											onChange={handleInputChange}
											className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
										>
											<option value="">Select budget range</option>
											<option value="under-10k">Under $10,000</option>
											<option value="10k-25k">$10,000 - $25,000</option>
											<option value="25k-50k">$25,000 - $50,000</option>
											<option value="50k-100k">$50,000 - $100,000</option>
											<option value="100k-plus">$100,000+</option>
											<option value="discuss">Let&apos;s discuss</option>
										</select>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="message">Project Details *</Label>
									<Textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleInputChange}
										rows={5}
										placeholder="Tell us about your project goals, timeline, and any specific requirements..."
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
											? "Sending your message, please wait"
											: "Send your message to Ideacomp"
									}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="animate-spin" size={18} aria-hidden="true" />
											Sending Message...
										</>
									) : (
										<>
											Send Message
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
