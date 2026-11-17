import type { EndpointMeta } from './common';

export const vercelWebhooksMeta = {
	getWebhooks: {
		riskLevel: 'read',
		description:
			'List the team’s webhooks: URL, subscribed events and the projects each covers. Filter by project.',
	},
	getWebhook: {
		riskLevel: 'read',
		description: 'Get one webhook by id: URL, events and projects.',
	},
	createWebhook: {
		riskLevel: 'write',
		description:
			'Register a URL to receive Vercel events (deployments, projects, domains, env vars and more), for all projects or chosen ones. Returns the signing secret used to verify deliveries; it is shown only once, so store it.',
	},
	deleteWebhook: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook: Vercel stops sending events to its URL. A replacement gets a new id and signing secret.',
	},
} as const satisfies Record<string, EndpointMeta>;
