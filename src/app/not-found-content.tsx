"use client";

import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";

const NotFoundContent = () => {
	const { dict } = useLocale();

	const links = [
		{ href: "/solutions", ...dict.notFound.links.solutions },
		{ href: "/contact", ...dict.notFound.links.contact },
		{ href: "/", ...dict.notFound.links.home },
	];

	return (
		<div className="dark flex min-h-screen flex-col bg-background">
			<Header />

			<main className="flex flex-grow items-center justify-center px-4 pb-12 pt-32 sm:px-6 lg:px-8">
				<article className="w-full max-w-2xl text-center">
					<h1 className="font-display text-8xl font-semibold text-signal" aria-label={dict.notFound.ariaError}>
						404
					</h1>
					<h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
						{dict.notFound.heading}
					</h2>
					<p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-foreground/70">
						{dict.notFound.subtitle}
					</p>

					<div className="mt-10 flex justify-center">
						<Button asChild variant="signal" size="lg">
							<Link href="/" aria-label={dict.notFound.ariaGoHome}>
								<Home size={18} aria-hidden="true" />
								{dict.notFound.goHome}
							</Link>
						</Button>
					</div>

					<div className="mx-auto mt-12 grid max-w-xl gap-6 sm:grid-cols-3">
						{links.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="group border-t border-border pt-4 text-left transition-colors"
							>
								<h3 className="font-semibold text-foreground group-hover:text-signal">
									{link.title}
								</h3>
								<p className="mt-1 text-sm leading-relaxed text-foreground/60">
									{link.description}
								</p>
								<ArrowRight
									size={16}
									className="mt-2 text-signal transition-transform group-hover:translate-x-1"
									aria-hidden="true"
								/>
							</Link>
						))}
					</div>
				</article>
			</main>

			<Footer />
		</div>
	);
};

export default NotFoundContent;
