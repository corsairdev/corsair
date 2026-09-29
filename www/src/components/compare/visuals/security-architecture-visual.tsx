function DbBox({
	label,
	sub,
	tone,
}: {
	label: string;
	sub: string;
	tone: 'bad' | 'good';
}) {
	const styles =
		tone === 'bad'
			? 'border-[#fecaca] bg-[#fef2f2] text-[#991b1b]'
			: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]';

	return (
		<div
			className={`flex flex-1 flex-col items-center rounded-lg border px-4 py-6 ${styles}`}
		>
			<div className="mb-3 flex size-12 items-center justify-center rounded-md border border-current/20 bg-white/60">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					aria-hidden="true"
				>
					<ellipse cx="12" cy="6" rx="8" ry="3" />
					<path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
					<path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
				</svg>
			</div>
			<p className="text-sm font-medium">{label}</p>
			<p className="mt-1 text-xs opacity-70">{sub}</p>
		</div>
	);
}

export function SecurityArchitectureVisual() {
	return (
		<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
			<DbBox label="Their database" sub="All customer secrets" tone="bad" />
			<span className="shrink-0 font-[family-name:var(--landing-font-mono)] text-lg text-[#1c1c1c33]">
				vs
			</span>
			<DbBox label="Your database" sub="Nothing on ours" tone="good" />
		</div>
	);
}
