"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroBackdrop from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { ContactFormSection } from "@/components/contact";
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
			<section className="px-4 py-24 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
				<div className="mx-auto max-w-3xl">
					<Reveal>
						<h2
							id="faq-heading"
							className="font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl"
						>
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

			{/* The form closes the page: the FAQ above it answers the objections a
			    visitor arrives with, and this is what they do once it has. */}
			<ContactFormSection />

			<Footer />
		</div>
	);
};

export default Contact;
