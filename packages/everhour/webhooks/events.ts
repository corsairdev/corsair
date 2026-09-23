import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { EverhourContext } from '../index';
import type { EverhourWebhookPayload, EverhourWebhooks } from './types';
import { createEverhourMatch, verifyEverhourWebhookSignature } from './types';

type EverhourEventHandler = EverhourWebhooks[keyof EverhourWebhooks];

const createEventHandler = (eventName: string): EverhourEventHandler => ({
	match: createEverhourMatch(eventName),
	handler: async (
		ctx: EverhourContext,
		request: WebhookRequest<EverhourWebhookPayload>,
	) => {
		const verification = verifyEverhourWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const loggedEvent = await logEventFromContext(
			ctx,
			`everhour.webhook.${eventName.replace('api:', '').replace(':', '_')}`,
			{ ...event },
			'completed',
		);

		if (loggedEvent === null) {
			return {
				success: false,
				statusCode: 500,
				error: 'Failed to persist webhook event',
			};
		}

		return { success: true, data: event };
	},
});

export const EverhourEvents = {
	'api:time:updated': createEventHandler('api:time:updated'),
	'api:timer:started': createEventHandler('api:timer:started'),
	'api:timer:stopped': createEventHandler('api:timer:stopped'),
	'api:project:created': createEventHandler('api:project:created'),
	'api:project:updated': createEventHandler('api:project:updated'),
	'api:project:removed': createEventHandler('api:project:removed'),
	'api:task:created': createEventHandler('api:task:created'),
	'api:task:updated': createEventHandler('api:task:updated'),
	'api:task:removed': createEventHandler('api:task:removed'),
	'api:task:recovered': createEventHandler('api:task:recovered'),
	'api:estimate:updated': createEventHandler('api:estimate:updated'),
	'api:section:created': createEventHandler('api:section:created'),
	'api:section:updated': createEventHandler('api:section:updated'),
	'api:section:removed': createEventHandler('api:section:removed'),
	'api:section:recovered': createEventHandler('api:section:recovered'),
	'api:client:created': createEventHandler('api:client:created'),
	'api:client:updated': createEventHandler('api:client:updated'),
	'api:invoice:created': createEventHandler('api:invoice:created'),
	'api:invoice:updated': createEventHandler('api:invoice:updated'),
	'api:invoice:deleted': createEventHandler('api:invoice:deleted'),
};
