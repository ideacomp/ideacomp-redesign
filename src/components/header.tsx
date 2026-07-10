"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/sitemap";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	return (
		<header className="dark fixed top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-4">
					<Link href="/" className="flex items-center gap-3">
						<Image
							src="/logo.png"
							alt="Ideacomp"
							width={32}
							height={32}
							className="rounded-sm"
							priority
						/>
						<span className="font-display text-2xl font-semibold uppercase tracking-tight text-foreground">
							Ideacomp
						</span>
					</Link>

					<nav className="hidden md:flex md:items-center md:gap-1" aria-label="Primary">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								aria-current={isActive(item.href) ? "page" : undefined}
								className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
									isActive(item.href)
										? "text-signal"
										: "text-foreground/70 hover:text-foreground"
								}`}
							>
								{item.name}
							</Link>
						))}
					</nav>

					<div className="md:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="flex size-11 items-center justify-center rounded-md text-foreground/80 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
							aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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
									key={item.name}
									href={item.href}
									aria-current={isActive(item.href) ? "page" : undefined}
									className={`rounded-md px-3 py-2 text-base font-medium transition-colors ${
										isActive(item.href)
											? "bg-secondary text-signal"
											: "text-foreground/70 hover:bg-secondary hover:text-foreground"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
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
