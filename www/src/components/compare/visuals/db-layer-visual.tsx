function FlowRow({
	steps,
	highlight = false,
}: {
	steps: string[];
	highlight?: boolean;
}) {
	return (
		<div className="flex items-center gap-2">
			{steps.map((step, index) => (
				<div key={step} className="flex items-center gap-2">
					<span
						className={`rounded border px-2.5 py-1.5 text-xs font-medium ${
							highlight
								? 'border-[#4a38f5]/30 bg-[#4a38f5]/5 text-[#4a38f5]'
								: 'border-[#1c1c1c1a] bg-[#f4f4f4] text-[#1c1c1c99]'
						}`}
					>
						{step}
					</span>
					{index < steps.length - 1 ? (
						<svg
							width="14"
							height="10"
							viewBox="0 0 14 10"
							fill="none"
							className="shrink-0 text-[#1c1c1c33]"
							aria-hidden="true"
						>
							<path
								d="M0 5h10M10 5l-3.5-3.5M10 5l-3.5 3.5"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					) : null}
				</div>
			))}
		</div>
	);
}

export function DbLayerVisual() {
	return (
		<div className="space-y-5">
			<div>
				<p className="mb-2 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#4a38f5]">
					Corsair
				</p>
				<div className="space-y-3">
					<FlowRow highlight steps={['API call', 'Provider', 'Your DB']} />
					<FlowRow highlight steps={['Webhook', 'Same row updated']} />
				</div>
			</div>

			<div className="border-t border-[#1c1c1c0d] pt-5">
				<p className="mb-2 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider text-[#1c1c1c66]">
					Nango
				</p>
				<FlowRow steps={['Sync job', 'Records cache', 'You poll by cursor']} />
			</div>

			<p className="text-xs leading-relaxed text-[#1c1c1c66]">
				Corsair writes to your database on every API call. Webhooks patch the
				same row — no separate sync schedule to wait on.
			</p>
		</div>
	);
}
