import type { SVGProps } from "react";
import type { DiagramKind } from "@/lib/sitemap";
import { cn } from "@/lib/utils";

interface DiagramProps extends SVGProps<SVGSVGElement> {
	className?: string;
}

const base = "w-full h-auto overflow-visible";
const line = "stroke-current text-foreground/25";
const strong = "stroke-current text-foreground/60";
const signal = "stroke-current text-signal fill-signal";
const telemetry = "stroke-current text-telemetry fill-telemetry";
const label = "fill-current text-foreground/50 font-mono text-[9px] tracking-wide";

/** A single node marker; the `pulse` node breathes gently (opacity only — never fully hidden). */
function Node({
	cx,
	cy,
	r = 4,
	pulse,
	accent,
}: {
	cx: number;
	cy: number;
	r?: number;
	pulse?: boolean;
	accent?: "signal" | "telemetry" | "none";
}) {
	const fill =
		accent === "signal" ? "fill-signal" : accent === "telemetry" ? "fill-telemetry" : "fill-foreground/70";
	return (
		<circle
			cx={cx}
			cy={cy}
			r={r}
			className={cn(fill, pulse && "motion-safe:animate-pulse")}
			style={pulse ? { animationDuration: "2.4s" } : undefined}
		/>
	);
}

function AiMl({ className, ...props }: DiagramProps) {
	return (
		<svg viewBox="0 0 480 300" className={cn(base, className)} role="img" aria-label="Diagram of scattered data inputs converging through a model into a forecast output" {...props}>
			<g className={line} strokeWidth={1.5} fill="none">
				<path d="M40 60 L200 150" />
				<path d="M40 130 L200 150" />
				<path d="M40 200 L200 150" />
				<path d="M40 240 L200 150" />
				<path d="M260 150 L400 90" />
				<path d="M260 150 L400 150" />
				<path d="M260 150 L400 210" />
			</g>
			<g className={strong} strokeWidth={2} fill="none">
				<rect x="200" y="120" width="60" height="60" rx="4" />
			</g>
			<Node cx={40} cy={60} r={3} />
			<Node cx={40} cy={130} r={3} />
			<Node cx={40} cy={200} r={3} />
			<Node cx={40} cy={240} r={3} />
			<Node cx={230} cy={150} r={5} accent="signal" pulse />
			<Node cx={400} cy={90} r={3} accent="telemetry" />
			<Node cx={400} cy={150} r={3} accent="telemetry" />
			<Node cx={400} cy={210} r={3} accent="telemetry" />
			<text x="196" y="112" className={label} textAnchor="middle">MODEL</text>
			<text x="30" y="35" className={label}>INPUT</text>
			<text x="380" y="65" className={label}>FORECAST</text>
		</svg>
	);
}

function Cybersecurity({ className, ...props }: DiagramProps) {
	return (
		<svg viewBox="0 0 480 300" className={cn(base, className)} role="img" aria-label="Diagram of a shielded perimeter filtering external nodes before reaching protected internal systems" {...props}>
			<g className={line} strokeWidth={1.5} fill="none">
				<path d="M40 70 L180 150" />
				<path d="M40 150 L180 150" />
				<path d="M40 230 L180 150" />
				<path d="M280 150 L420 80" />
				<path d="M280 150 L420 150" />
				<path d="M280 150 L420 220" />
			</g>
			<g className={strong} strokeWidth={2}>
				<path d="M230 90 L270 105 V165 C270 195 230 215 230 215 C230 215 190 195 190 165 V105 Z" fill="none" />
			</g>
			<Node cx={230} cy={150} r={5} accent="signal" pulse />
			<Node cx={40} cy={70} r={3} />
			<Node cx={40} cy={150} r={3} />
			<Node cx={40} cy={230} r={3} />
			<Node cx={420} cy={80} r={3} accent="telemetry" />
			<Node cx={420} cy={150} r={3} accent="telemetry" />
			<Node cx={420} cy={220} r={3} accent="telemetry" />
			<text x="230" y="240" className={label} textAnchor="middle">PERIMETER</text>
			<text x="30" y="45" className={label}>EXTERNAL</text>
			<text x="440" y="150" className={label} textAnchor="end">PROTECTED</text>
		</svg>
	);
}

function WebDev({ className, ...props }: DiagramProps) {
	const layers = [
		{ y: 60, w: 260, name: "FRONTEND" },
		{ y: 130, w: 320, name: "API" },
		{ y: 200, w: 220, name: "DATA" },
	];
	return (
		<svg viewBox="0 0 480 300" className={cn(base, className)} role="img" aria-label="Diagram of a layered frontend, API, and data architecture" {...props}>
			<g className={line} strokeWidth={1.5}>
				<path d="M120 90 V130" />
				<path d="M120 160 V200" />
			</g>
			{layers.map((l, i) => (
				<g key={l.name}>
					<rect
						x={60}
						y={l.y}
						width={l.w}
						height={40}
						rx={3}
						className={i === 1 ? strong : line}
						strokeWidth={i === 1 ? 2 : 1.5}
						fill="none"
					/>
					<text x={72} y={l.y + 25} className={label}>{l.name}</text>
					<Node cx={60 + l.w - 16} cy={l.y + 20} r={3} accent={i === 1 ? "signal" : "none"} pulse={i === 1} />
				</g>
			))}
			<Node cx={400} cy={150} r={3} accent="telemetry" />
			<path d="M380 150 L340 150" className={line} strokeWidth={1.5} fill="none" />
			<text x="410" y="154" className={label}>CLIENT</text>
		</svg>
	);
}

function Outsourcing({ className, ...props }: DiagramProps) {
	const spokes = [
		{ x: 380, y: 60 },
		{ x: 420, y: 150 },
		{ x: 380, y: 240 },
		{ x: 100, y: 60 },
		{ x: 60, y: 150 },
		{ x: 100, y: 240 },
	];
	return (
		<svg viewBox="0 0 480 300" className={cn(base, className)} role="img" aria-label="Diagram of a central workflow hub connected to multiple integrated team nodes" {...props}>
			<g className={line} strokeWidth={1.5}>
				{spokes.map((s, i) => (
					<line key={i} x1={240} y1={150} x2={s.x} y2={s.y} />
				))}
			</g>
			<Node cx={240} cy={150} r={7} accent="signal" pulse />
			{spokes.map((s, i) => (
				<Node key={i} cx={s.x} cy={s.y} r={3} accent={i % 2 === 0 ? "telemetry" : "none"} />
			))}
			<text x="240" y="130" className={label} textAnchor="middle">YOUR WORKFLOW</text>
		</svg>
	);
}

function Mobile({ className, ...props }: DiagramProps) {
	return (
		<svg viewBox="0 0 480 300" className={cn(base, className)} role="img" aria-label="Diagram of a device screen flow with connected states" {...props}>
			<rect x="170" y="40" width="140" height="220" rx="14" className={strong} strokeWidth={2} fill="none" />
			<line x1="210" y1="52" x2="270" y2="52" className={line} strokeWidth={2} />
			<g className={line} strokeWidth={1.5} fill="none">
				<rect x="190" y="80" width="100" height="28" rx="3" />
				<rect x="190" y="118" width="100" height="28" rx="3" />
				<rect x="190" y="156" width="60" height="28" rx="3" />
			</g>
			<Node cx={290} cy={94} r={3} accent="signal" pulse />
			<path d="M310 150 L360 150" className={line} strokeWidth={1.5} />
			<path d="M360 150 L360 90" className={line} strokeWidth={1.5} fill="none" />
			<path d="M360 150 L360 220" className={line} strokeWidth={1.5} fill="none" />
			<Node cx={360} cy={90} r={3} accent="telemetry" />
			<Node cx={360} cy={220} r={3} accent="telemetry" />
			<text x="360" y="75" className={label} textAnchor="middle">ONLINE</text>
			<text x="360" y="240" className={label} textAnchor="middle">OFFLINE</text>
		</svg>
	);
}

function CloudDevops({ className, ...props }: DiagramProps) {
	const stages = ["COMMIT", "BUILD", "TEST", "DEPLOY", "MONITOR"];
	return (
		<svg viewBox="0 0 480 300" className={cn(base, className)} role="img" aria-label="Diagram of a continuous delivery pipeline from commit through monitoring" {...props}>
			<path
				d="M60 210 C60 150 110 150 130 150 L350 150 C370 150 420 150 420 90"
				className={strong}
				strokeWidth={2}
				fill="none"
			/>
			{stages.map((s, i) => {
				const x = 70 + i * 85;
				return (
					<g key={s}>
						<Node cx={x} cy={150} r={5} accent={i === 3 ? "signal" : "telemetry"} pulse={i === 3} />
						<text x={x} y="180" className={label} textAnchor="middle">{s}</text>
					</g>
				);
			})}
		</svg>
	);
}

const DIAGRAMS: Record<DiagramKind, (props: DiagramProps) => ReturnType<typeof AiMl>> = {
	"ai-ml": AiMl,
	cybersecurity: Cybersecurity,
	"web-dev": WebDev,
	outsourcing: Outsourcing,
	mobile: Mobile,
	"cloud-devops": CloudDevops,
};

export function SchematicDiagram({ kind, className, ...props }: { kind: DiagramKind } & DiagramProps) {
	const Diagram = DIAGRAMS[kind];
	return <Diagram className={className} {...props} />;
}
