const ROWS = [
	{ label: 'OAuth / connect', nango: true, corsair: true },
	{
		label: 'API calls without deploying functions',
		nango: false,
		corsair: true,
	},
	{ label: 'Custom function runtime', nango: true, corsair: false },
	{ label: 'Cached data in your database', nango: false, corsair: true },
] as const;

function Cell({ ok, brand }: { ok: boolean; brand: 'nango' | 'corsair' }) {
	if (ok) {
		return (
			<span
				className={`flex size-7 items-center justify-center rounded-full ${
					brand === 'corsair'
						? 'bg-[#4a38f5]/10 text-[#4a38f5]'
						: 'bg-[#f4f4f4] text-[#1c1c1c]'
				}`}
				aria-label="Included"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M2 6l2.5 2.5L10 3"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		);
	}

	return (
		<span
			className="flex size-7 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626]"
			aria-label="Not included"
		>
			<svg
				width="10"
				height="10"
				viewBox="0 0 10 10"
				fill="none"
				aria-hidden="true"
			>
				<path
					d="M2 2l6 6M8 2L2 8"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		</span>
	);
}

export function IntegrationSurfaceVisual() {
	return (
		<div className="space-y-3">
			<div className="grid grid-cols-[1fr_56px_56px] items-center gap-2 border-b border-[#1c1c1c1a] pb-2">
				<span />
				<span className="text-center font-[family-name:var(--landing-font-mono)] text-[9px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Nango
				</span>
				<span className="text-center font-[family-name:var(--landing-font-mono)] text-[9px] font-semibold uppercase tracking-wider text-[#4a38f5]">
					Corsair
				</span>
			</div>

			{ROWS.map((row) => (
				<div
					key={row.label}
					className="grid grid-cols-[1fr_56px_56px] items-center gap-2"
				>
					<p className="text-xs text-[#1c1c1c99]">{row.label}</p>
					<div className="flex justify-center">
						<Cell ok={row.nango} brand="nango" />
					</div>
					<div className="flex justify-center">
						<Cell ok={row.corsair} brand="corsair" />
					</div>
				</div>
			))}

			<p className="pt-2 text-xs leading-relaxed text-[#1c1c1c66]">
				Nango&apos;s strength is a hosted function runtime. Corsair ships ~40
				typed operations per plugin for the API work you&apos;d otherwise deploy
				yourself.
			</p>
		</div>
	);
}
