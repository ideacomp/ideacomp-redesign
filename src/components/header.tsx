"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/sitemap";
import Logo from "@/components/logo";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";

interface HeaderProps {
	/**
	 * Sit transparently on the section below until the page is scrolled.
	 *
	 * Opt-in per page rather than derived from the route: it is only right over
	 * a section that is both dark and *not* graphite. On the graphite heroes the
	 * solid bar is indistinguishable from the hero anyway, and over a light first
	 * section (`/privacy`) it would put this bar's light nav on near-white.
	 */
	overlay?: boolean;
}

const Header = ({ overlay = false }: HeaderProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const pathname = usePathname();
	const { dict } = useLocale();

	const isActive = (path: string) => pathname === path;

	useEffect(() => {
		if (!overlay) return;
		const onScroll = () => setScrolled(window.scrollY > 8);
		// Run once: a reload restores the scroll position before this mounts.
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [overlay]);

	// The open mobile menu needs a ground of its own regardless of scroll.
	const solid = !overlay || scrolled || isMenuOpen;

	return (
		<header
			className={`dark fixed top-0 z-40 w-full border-b transition-colors motion-safe:duration-300 ${
				solid
					? "border-border bg-background/95 backdrop-blur-md"
					: "border-transparent bg-transparent"
			}`}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-4">
					{/* One <Logo>, not a mark plus typed name: the wordmark is part of the
					    artwork. Height is set here, width follows from the viewBox. */}
					<Link href="/" className="flex items-center text-foreground">
						<Logo className="h-8" />
					</Link>

					<div className="hidden md:flex md:items-center md:gap-4">
						<nav className="flex items-center gap-1" aria-label="Primary">
							{navigation.map((item) => (
								<Link
									key={item.key}
									href={item.href}
									aria-current={isActive(item.href) ? "page" : undefined}
									className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
										isActive(item.href)
											? "text-signal"
											: "text-foreground/70 hover:text-foreground"
									}`}
								>
									{dict.nav[item.key]}
								</Link>
							))}
						</nav>
						<LanguageSwitcher className="border-l border-border pl-4" />
					</div>

					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher />
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="flex size-11 items-center justify-center rounded-md text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
							aria-label={isMenuOpen ? dict.common.closeMenu : dict.common.openMenu}
							aria-expanded={isMenuOpen}
						>
							{isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
						</button>
					</div>
				</div>

				{isMenuOpen && (
					<nav className="border-t border-border pb-4 md:hidden" aria-label="Mobile">
						<div className="flex flex-col gap-1 pt-2">
							{navigation.map((item) => (
								<Link
									key={item.key}
									href={item.href}
									aria-current={isActive(item.href) ? "page" : undefined}
									className={`rounded-md px-3 py-2 text-base font-medium transition-colors ${
										isActive(item.href)
											? "bg-secondary text-signal"
											: "text-foreground/70 hover:bg-secondary hover:text-foreground"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{dict.nav[item.key]}
								</Link>
							))}
						</div>
					</nav>
				)}
			</div>
		</header>
	);
};

export default Header;
