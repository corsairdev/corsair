import { cn } from '@/lib/utils';

type IntegrationCapabilityItem = {
	id: string;
	name: string;
	slug: string;
	description: string;
	badge?: string;
};

function badgeClassName(badge?: string) {
	if (badge === 'deprecated') {
		return 'border-[#1c1c1c1a] bg-[#1c1c1c]/[0.04] text-[#1c1c1c99]';
	}
	if (badge) {
		return 'border-[#4a38f5]/20 bg-[#4a38f5]/[0.06] text-[#4a38f5]';
	}
	return '';
}

export function IntegrationCapabilityList({
	items,
	emptyMessage,
}: {
	items: IntegrationCapabilityItem[];
	emptyMessage: string;
}) {
	if (items.length === 0) {
		return (
			<p className="px-4 py-4 font-[family-name:var(--font-landing-mono)] text-[12px] text-[#1c1c1c66] sm:px-6">
				{emptyMessage}
			</p>
		);
	}

	return (
		<ul className="m-0 divide-y divide-[#1c1c1c0d] p-0">
			{items.map((item) => (
				<li
					key={item.id}
					className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 px-4 py-3 sm:px-6"
				>
					<div className="min-w-0">
						<div className="flex flex-wrap items-baseline gap-x-2.5">
							<span className="text-[15px] font-medium text-[#1c1c1c]">
								{item.name}
							</span>
							<span className="font-[family-name:var(--font-landing-mono)] text-[11px] text-[#1c1c1c66]">
								{item.slug}
							</span>
						</div>
						{item.description ? (
							<p className="mt-1 text-[13px] leading-relaxed text-[#1c1c1c99]">
								{item.description}
							</p>
						) : null}
					</div>

					{item.badge ? (
						<span
							className={cn(
								'shrink-0 rounded-full border px-2 py-0.5 font-[family-name:var(--font-landing-mono)] text-[10px] uppercase',
								badgeClassName(item.badge),
							)}
						>
							{item.badge}
						</span>
					) : null}
				</li>
			))}
		</ul>
	);
}
