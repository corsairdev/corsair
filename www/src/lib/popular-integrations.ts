import type { IntegrationCatalogEntry } from '@/lib/integrations-catalog.types';

/** Recognizable integrations shown first on `/integrations`. Order is intentional. */
export const POPULAR_INTEGRATION_IDS = [
	'slack',
	'github',
	'gmail',
	'notion',
	'stripe',
	'linear',
	'jira',
	'hubspot',
	'salesforce',
	'googlecalendar',
	'googlesheets',
	'googledrive',
	'discord',
	'telegram',
	'twilio',
	'sendgrid',
	'mailchimp',
	'airtable',
	'asana',
	'trello',
	'zoom',
	'dropbox',
	'onedrive',
	'outlook',
	'teams',
	'linkedin',
	'instagram',
	'facebook',
	'youtube',
	'spotify',
	'supabase',
	'vercel',
	'datadog',
	'sentry',
	'openai',
	'intercom',
	'zendesk',
	'calendly',
	'figma',
	'monday',
] as const;

export type PopularIntegrationId = (typeof POPULAR_INTEGRATION_IDS)[number];

const POPULAR_ID_SET = new Set<string>(POPULAR_INTEGRATION_IDS);

export function isPopularIntegration(id: string): id is PopularIntegrationId {
	return POPULAR_ID_SET.has(id);
}

export function partitionIntegrations(
	integrations: IntegrationCatalogEntry[],
): {
	popular: IntegrationCatalogEntry[];
	rest: IntegrationCatalogEntry[];
} {
	const byId = new Map(
		integrations.map((integration) => [integration.id, integration]),
	);

	const popular = POPULAR_INTEGRATION_IDS.map((id) => byId.get(id)).filter(
		(integration): integration is IntegrationCatalogEntry =>
			integration !== undefined,
	);

	const rest = integrations
		.filter((integration) => !POPULAR_ID_SET.has(integration.id))
		.sort((a, b) => a.displayName.localeCompare(b.displayName));

	return { popular, rest };
}
