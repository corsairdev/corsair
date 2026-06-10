import { Badge } from '@/components/ui/badge';

type IntegrationCapabilityItem = {
	id: string;
	name: string;
	slug: string;
	description: string;
	badge?: string;
};

function badgeVariant(badge?: string) {
	if (badge === 'deprecated') return 'warning' as const;
	if (badge) return 'accent' as const;
	return undefined;
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
			<p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
		);
	}

	return (
		<ul className="mt-1 divide-y divide-border/50">
			{items.map((item) => (
				<li key={item.id} className="py-3.5 first:pt-2">
					<div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3">
						<span className="text-sm font-medium">{item.name}</span>
						<div className="flex shrink-0 items-center gap-2">
							{item.badge ? (
								<Badge
									variant={badgeVariant(item.badge)}
									className="text-[10px] uppercase"
								>
									{item.badge}
								</Badge>
							) : null}
							<Badge variant="outline" className="font-mono text-[10px]">
								{item.slug}
							</Badge>
						</div>
					</div>
					{item.description ? (
						<p className="text-sm leading-relaxed text-muted-foreground">
							{item.description}
						</p>
					) : null}
				</li>
			))}
		</ul>
	);
}
