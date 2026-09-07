import type { Metadata } from 'next';

import { IntegrationsGrid } from '@/components/integrations/integrations-grid';
import { getCatalogIntegrationsList } from '@/server/catalog-integration-cache';

export const metadata: Metadata = {
	title: 'Integrations',
	description:
		'Browse 250+ typed Corsair integrations for AI agents — OAuth, webhooks, MCP, and local DB sync for Gmail, Slack, GitHub, Notion, and more.',
	alternates: {
		canonical: '/integrations',
	},
	openGraph: {
		title: 'Corsair Integrations — Plug every app into your agents',
		description:
			'Browse 250+ typed Corsair integrations for AI agents — OAuth, webhooks, MCP, and local DB sync.',
		url: 'https://corsair.dev/integrations',
	},
};

export default async function IntegrationsPage() {
	const integrations = await getCatalogIntegrationsList();

	return (
		<main>
			<IntegrationsGrid integrations={integrations} />
		</main>
	);
}
