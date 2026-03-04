import type { AirtableBoundEndpoints, AirtableWebhooks } from '..';
import type { AirtableEvent } from './types';
import { logEventFromContext } from '../../utils/events';
import {
	createAirtableMatch,
	verifyAirtableWebhookSignature,
} from './types';

export const event: AirtableWebhooks['event'] = {
	match: createAirtableMatch(),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAirtableWebhookSignature(
			request,
			webhookSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;

		if (
			!payload ||
			typeof payload !== 'object' ||
			!('base' in payload) ||
			!('webhook' in payload)
		) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event = payload

		let corsairEntityId = '';


		try {
			// Type assertion to ensure the endpoints are the correct type
			const endpoints = ctx.endpoints as AirtableBoundEndpoints;
			const payloadResponse = await endpoints.webhooks.getPayloads({
				baseId: event.base.id,
				webhookId: event.webhook.id,
				cursor: 0,
			});

			await logEventFromContext(
				ctx,
				'airtable.webhook.event',
				{ ...event, payloads: [...payloadResponse.payloads] },
				'completed',
			);
		} catch (error) {
			console.warn('Failed to fetch webhook payloads from Airtable:', error);
			await logEventFromContext(
				ctx,
				'airtable.webhook.event',
				{ ...event },
				'completed',
			);
		}

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
