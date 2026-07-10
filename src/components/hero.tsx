const NODES = [
	{ x: 6, y: 18 }, { x: 18, y: 42 }, { x: 10, y: 68 }, { x: 28, y: 12 },
	{ x: 34, y: 55 }, { x: 46, y: 30 }, { x: 52, y: 74 }, { x: 62, y: 15 },
	{ x: 68, y: 48 }, { x: 78, y: 66 }, { x: 84, y: 22 }, { x: 92, y: 40 },
	{ x: 96, y: 78 }, { x: 40, y: 90 }, { x: 74, y: 92 },
];

const EDGES: [number, number][] = [
	[0, 1], [1, 2], [1, 4], [3, 5], [4, 5], [4, 6], [5, 8], [6, 13],
	[7, 8], [8, 9], [8, 10], [9, 12], [10, 11], [11, 12], [9, 14], [2, 13],
];

const ACCENT_NODES = new Set([5, 8, 11]);

/**
 * Decorative "systems map" backdrop for the instrument-canvas hero: an
 * abstract network of nodes/edges rather than stock photography, in keeping
 * with the engineered-systems metaphor. Fully static/visible by default —
 * the CSS grid overlay is the only animated layer, looped and reduced-motion
 * safe via the global media query.
 */
const HeroBackdrop = () => {
	return (
		<div className="absolute inset-0 overflow-hidden" aria-hidden="true">
			<svg
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid slice"
				className="absolute inset-0 h-full w-full opacity-[0.35]"
			>
				<g className="stroke-current text-foreground/40" strokeWidth={0.15} fill="none">
					{EDGES.map(([a, b], i) => (
						<line
							key={i}
							x1={NODES[a].x}
							y1={NODES[a].y}
							x2={NODES[b].x}
							y2={NODES[b].y}
						/>
					))}
				</g>
				{NODES.map((n, i) => (
					<circle
						key={i}
						cx={n.x}
						cy={n.y}
						r={ACCENT_NODES.has(i) ? 0.9 : 0.5}
						className={
							ACCENT_NODES.has(i)
								? "fill-signal motion-safe:animate-pulse"
								: "fill-foreground/50"
						}
						style={ACCENT_NODES.has(i) ? { animationDuration: "3s" } : undefined}
					/>
				))}
			</svg>

			{/* Animated angled grid texture */}
			<div
				className="absolute inset-[-100px] opacity-[0.06] motion-safe:animate-[grid-move_6s_linear_infinite]"
				style={{
					backgroundImage:
						"linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
					transform: "rotate(-12deg)",
					transformOrigin: "center",
				}}
			/>

			<div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/40 to-background" />
		</div>
	);
};

export default HeroBackdrop;
