'use client';

import { CompareHtmlContent } from '@/components/compare/compare-html-content';
import {
	NangoIntegrationsCatalogProvider,
	NangoIntegrationsCountLink,
	NangoIntegrationsModalTrigger,
} from '@/components/compare/nango-integrations-modal';
import catalog from '@/content/compare/nango-integrations.json';
import type { NangoIntegrationsCatalog } from '@/content/compare/nango-integrations.types';

const { stats } = catalog as NangoIntegrationsCatalog;

export function NangoLimitedApiOperationsSection({
	bodyHtml,
}: {
	bodyHtml: string;
}) {
	return (
		<NangoIntegrationsCatalogProvider>
			<p>
				Nango lists hundreds of integrations, but{' '}
				{stats.percentWithoutOperations}% of them stop at OAuth and a generic
				requests proxy (
				<NangoIntegrationsCountLink />
				). You connect the account, then call provider endpoints yourself with
				raw paths and manual request wiring. There are no pre-built syncs or
				actions, and you build your own if you need more.
			</p>
			<CompareHtmlContent html={bodyHtml} />
			<NangoIntegrationsModalTrigger />
		</NangoIntegrationsCatalogProvider>
	);
}
