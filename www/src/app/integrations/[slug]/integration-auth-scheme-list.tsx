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
		return <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>;
	}

	return (
		<ul className="mt-1 divide-y divide-border/50">
			{items.map((item) => (
				<li key={item.id} className="py-3.5 first:pt-2">
					<span className="text-sm font-medium">
						{formatAuthModeLabel(item.mode, item.name)}
					</span>
				</li>
			))}
		</ul>
	);
}
