function FlowBox({
	label,
	sub,
	highlight = false,
}: {
	label: string;
	sub: string;
	highlight?: boolean;
}) {
	return (
		<div
			className={`rounded-md border px-3 py-2 text-center ${
				highlight
					? 'border-[#4a38f5]/30 bg-[#4a38f5]/5'
					: 'border-[#1c1c1c1a] bg-[#f4f4f4]'
			}`}
		>
			<p
				className={`text-xs font-medium ${
					highlight ? 'text-[#4a38f5]' : 'text-[#1c1c1c]'
				}`}
			>
				{label}
			</p>
			<p className="mt-0.5 font-[family-name:var(--landing-font-mono)] text-[10px] text-[#1c1c1c66]">
				{sub}
			</p>
		</div>
	);
}

function Arrow({ label }: { label?: string }) {
	return (
		<div className="flex flex-col items-center gap-0.5 px-1">
			<svg
				width="16"
				height="20"
				viewBox="0 0 16 20"
				fill="none"
				className="text-[#1c1c1c33]"
				aria-hidden="true"
			>
				<path
					d="M8 2v14M8 16l-4-4M8 16l4-4"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			{label ? (
				<span className="font-[family-name:var(--landing-font-mono)] text-[8px] uppercase tracking-wider text-[#1c1c1c66]">
					{label}
				</span>
			) : null}
		</div>
	);
}

function SideLabel({
	children,
	tone,
}: {
	children: string;
	tone: 'nango' | 'corsair';
}) {
	return (
		<p
			className={`mb-2 font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider ${
				tone === 'corsair' ? 'text-[#4a38f5]' : 'text-[#1c1c1c66]'
			}`}
		>
			{children}
		</p>
	);
}

export function ApiOperationsVisual() {
	return (
		<div className="space-y-6">
			<div>
				<SideLabel tone="corsair">Corsair</SideLabel>
				<div className="flex items-center justify-center gap-1">
					<FlowBox label="Your app" sub="TypeScript" highlight />
					<Arrow label="typed" />
					<FlowBox label="Corsair SDK" sub="in-process" highlight />
					<Arrow />
					<FlowBox label="Provider API" sub="Slack, GitHub…" />
				</div>
				<p className="mt-2 text-center font-[family-name:var(--landing-font-mono)] text-[10px] text-[#4a38f5]">
					corsair.slack.api.messages.post(&#123; … &#125;)
				</p>
			</div>

			<div className="border-t border-[#1c1c1c0d] pt-6">
				<SideLabel tone="nango">Nango</SideLabel>
				<div className="flex items-center justify-center gap-1">
					<FlowBox label="Your app" sub="any language" />
					<Arrow label="HTTP" />
					<FlowBox label="Nango runtime" sub="deployed functions" />
					<Arrow />
					<FlowBox label="Provider API" sub="Slack, GitHub…" />
				</div>
				<p className="mt-2 text-center font-[family-name:var(--landing-font-mono)] text-[10px] text-[#1c1c1c66]">
					triggerAction(&apos;slack&apos;, connId, &apos;post-message&apos;, …)
				</p>
			</div>
		</div>
	);
}
