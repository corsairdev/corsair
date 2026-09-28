import Link from 'next/link';

import { IntegrationLogo } from '@/components/integrations/integration-logo';
import { IntegrationStats } from '@/components/integrations/integration-stats';
import { integrationPageUrl } from '@/lib/integrations-catalog';
import type { IntegrationCatalogEntry } from '@/lib/integrations-catalog.types';

export function IntegrationCard({
	integration,
}: {
	integration: IntegrationCatalogEntry;
}) {
	return (
		<Link
			href={integrationPageUrl(integration.id)}
			className="group flex h-full flex-col rounded-sm border border-[#1c1c1c]/10 bg-white p-4 no-underline transition-colors hover:border-[#1c1c1c]/20 hover:bg-[#fafafa]"
		>
			<div className="flex items-start gap-3">
				<IntegrationLogo
					id={integration.id}
					displayName={integration.displayName}
					size={40}
				/>
				<div className="min-w-0 flex-1">
					<h3 className="truncate text-[15px] font-medium text-[#1c1c1c] group-hover:text-[#4a38f5]">
						{integration.displayName}
					</h3>
					<IntegrationStats counts={integration.counts} />
				</div>
			</div>

			<p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#1c1c1c99]">
				{integration.description}
			</p>
		</Link>
	);
}
