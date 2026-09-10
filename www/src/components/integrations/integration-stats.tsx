import { LightningIcon, PlugsIcon } from '@phosphor-icons/react/dist/ssr';

import type { IntegrationCatalogEntry } from '@/lib/integrations-catalog.types';

export function IntegrationStats({
	counts,
}: {
	counts: IntegrationCatalogEntry['counts'];
}) {
	return (
		<p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--landing-font-mono)] text-[11px] text-[#1c1c1c66]">
			<span className="inline-flex items-center gap-1">
				<PlugsIcon size={12} aria-hidden />
				{counts.api} {counts.api === 1 ? 'operation' : 'operations'}
			</span>
			<span className="inline-flex items-center gap-1">
				<LightningIcon size={12} aria-hidden />
				{counts.webhooks} {counts.webhooks === 1 ? 'webhook' : 'webhooks'}
			</span>
		</p>
	);
}
