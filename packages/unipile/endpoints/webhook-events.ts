import { defineOperation } from './call';

// List all Webhook Conversations (GET /v2/webhooks/conversations/)
export const listDeliveries = defineOperation(
	'webhookEventsListDeliveries',
	'webhookEvents.listDeliveries',
	{
		method: 'GET',
		path: '/v2/webhooks/conversations/',
		query: [
			'endpoint_id',
			'event_id',
			'account_id',
			'event_type',
			'status',
			'created_after',
			'created_before',
			'offset',
			'limit',
		],
	},
);

// Replay a Webhook Event (POST /v2/webhooks/events/{id}/replay)
export const replay = defineOperation(
	'webhookEventsReplay',
	'webhookEvents.replay',
	{
		method: 'POST',
		path: '/v2/webhooks/events/{id}/replay',
		query: ['endpoint_id'],
	},
);
