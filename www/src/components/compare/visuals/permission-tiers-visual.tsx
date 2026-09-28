import Link from 'next/link';

import { DOCS_URL } from '@/lib/site-links';

const MODES = [
	{
		mode: 'open',
		destructive: 'Runs immediately',
		highlight: false,
	},
	{
		mode: 'cautious',
		destructive: 'Needs approval',
		highlight: true,
	},
	{
		mode: 'strict',
		destructive: 'Blocked',
		highlight: false,
	},
	{
		mode: 'readonly',
		destructive: 'Blocked',
		highlight: false,
	},
] as const;

export function PermissionTiersVisual() {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-2">
				{MODES.map((item) => (
					<div
						key={item.mode}
						className={`rounded-lg border px-3 py-3 ${
							item.highlight
								? 'border-[#4a38f5]/30 bg-[#4a38f5]/5'
								: 'border-[#1c1c1c1a] bg-[#f4f4f4]'
						}`}
					>
						<div className="flex items-center gap-2">
							<code
								className={`font-[family-name:var(--landing-font-mono)] text-[11px] font-medium ${
									item.highlight ? 'text-[#4a38f5]' : 'text-[#1c1c1c]'
								}`}
							>
								{item.mode}
							</code>
							{item.highlight ? (
								<span className="rounded bg-[#4a38f5] px-1.5 py-0.5 font-[family-name:var(--landing-font-mono)] text-[8px] font-semibold uppercase tracking-wider text-white">
									Default
								</span>
							) : null}
						</div>
						<p className="mt-2 text-[10px] leading-relaxed text-[#1c1c1c66]">
							Destructive calls:{' '}
							<span className="font-medium text-[#1c1c1c]">
								{item.destructive}
							</span>
						</p>
					</div>
				))}
			</div>

			<div className="rounded-lg border border-[#1c1c1c1a] bg-white px-3 py-2.5">
				<p className="font-[family-name:var(--landing-font-mono)] text-[10px] text-[#1c1c1c99]">
					agent → <span className="text-[#f59e0b]">channels.archive</span>
					{' → '}
					<span className="rounded bg-[#f59e0b]/10 px-1 text-[#92400e]">
						approval required
					</span>
				</p>
			</div>

			<p className="text-xs leading-relaxed text-[#1c1c1c66]">
				Per-endpoint overrides at the SDK — no provider scope changes.{' '}
				<Link
					href={`${DOCS_URL}/concepts/permissions`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-[#4a38f5] underline decoration-[#4a38f533] underline-offset-2 hover:decoration-[#4a38f5]"
				>
					Permissions docs
				</Link>
			</p>
		</div>
	);
}
