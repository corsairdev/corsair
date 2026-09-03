const CAPABILITIES = [
	{ id: 'agents', label: 'Agents' },
	{ id: 'dashboards', label: 'Dashboards' },
	{ id: 'webhooks', label: 'Webhooks' },
	{ id: 'rest', label: 'REST API' },
] as const;

function CapabilityCell({
	supported,
	brand,
}: {
	supported: boolean;
	brand: 'composio' | 'corsair';
}) {
	if (supported) {
		return (
			<span
				className={`flex size-8 items-center justify-center rounded-full ${
					brand === 'corsair'
						? 'bg-[#4a38f5]/10 text-[#4a38f5]'
						: 'bg-[#f4f4f4] text-[#1c1c1c]'
				}`}
				aria-label="Supported"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M2.5 7l3 3 6-6"
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
			className="flex size-8 items-center justify-center rounded-full bg-[#fef2f2] text-[#dc2626]"
			aria-label="Not supported"
		>
			<svg
				width="12"
				height="12"
				viewBox="0 0 12 12"
				fill="none"
				aria-hidden="true"
			>
				<path
					d="M2 2l8 8M10 2l-8 8"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		</span>
	);
}

export function PlatformStackVisual() {
	return (
		<div className="space-y-5">
			<div className="grid grid-cols-4 gap-2 text-center">
				{CAPABILITIES.map((cap) => (
					<p
						key={cap.id}
						className="font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c66]"
					>
						{cap.label}
					</p>
				))}
			</div>

			<div className="space-y-3">
				<div className="flex items-center gap-3">
					<p className="w-16 shrink-0 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#dc2626]">
						Composio
					</p>
					<div className="grid flex-1 grid-cols-4 gap-2">
						{CAPABILITIES.map((cap) => (
							<div key={cap.id} className="flex justify-center">
								<CapabilityCell
									supported={cap.id === 'agents'}
									brand="composio"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="flex items-center gap-3">
					<p className="w-16 shrink-0 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#4a38f5]">
						Corsair
					</p>
					<div className="grid flex-1 grid-cols-4 gap-2">
						{CAPABILITIES.map((cap) => (
							<div key={cap.id} className="flex justify-center">
								<CapabilityCell supported brand="corsair" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
