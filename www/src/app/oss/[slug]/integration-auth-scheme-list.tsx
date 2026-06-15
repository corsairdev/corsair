import { formatAuthModeLabel } from '@/lib/format-auth-mode-label';

type AuthSchemeItem = {
	id: string;
	mode: string;
	name: string;
};

export function IntegrationAuthSchemeList({
	items,
	emptyMessage,
}: {
	items: AuthSchemeItem[];
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
					className="px-4 py-3 sm:px-6"
				>
					<span className="text-[15px] font-medium text-[#1c1c1c]">
						{formatAuthModeLabel(item.mode, item.name)}
					</span>
				</li>
			))}
		</ul>
	);
}
