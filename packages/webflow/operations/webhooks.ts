import type { WebflowOperation } from '../endpoints/operation-types';

export const webhooksOperations = [
	{
		key: 'listWebhooks',
		group: 'webhooks',
		name: 'listWebhooks',
		method: 'GET',
		path: '/sites/{site_id}/webhooks',
		pathParams: ['site_id'],
		riskLevel: 'read',
		description: 'List all app-created webhooks registered for a site',
	},
	{
		key: 'deleteWebhook',
		group: 'webhooks',
		name: 'deleteWebhook',
		method: 'DELETE',
		path: '/webhooks/{webhook_id}',
		pathParams: ['webhook_id'],
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a webhook by id',
	},
] as const satisfies readonly WebflowOperation[];
