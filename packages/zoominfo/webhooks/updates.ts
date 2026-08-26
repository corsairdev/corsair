import { logEventFromContext } from 'corsair/core';
import type { ZoominfoWebhooks } from '..';
import {
	CompanyUpdateEventSchema,
	ContactUpdateEventSchema,
	createZoominfoMatch,
	verifyZoominfoWebhookSignature,
} from './types';

export const contactUpdate: ZoominfoWebhooks['contactUpdate'] = {
	match: createZoominfoMatch('contact'),

	handler: async (ctx, request) => {
		const verification = verifyZoominfoWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Signature verification failed',
			};
		}

		const event = ContactUpdateEventSchema.parse(request.payload);

		// Contact deliveries carry names and email addresses, so only the counts
		// and the changed field names go to the event log.
		await logEventFromContext(
			ctx,
			'zoominfo.webhook.contactUpdate',
			{
				webhookId: event.webhookDetails.id,
				eventType: event.webhookDetails.eventType,
				recordCount: event.data.length,
				changedAttributes: [
					...new Set(event.data.flatMap((r) => r.changedAttributes ?? [])),
				].sort(),
			},
			'completed',
		);

		return { success: true, data: event };
	},
};

export const companyUpdate: ZoominfoWebhooks['companyUpdate'] = {
	match: createZoominfoMatch('company'),

	handler: async (ctx, request) => {
		const verification = verifyZoominfoWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Signature verification failed',
			};
		}

		const event = CompanyUpdateEventSchema.parse(request.payload);

		await logEventFromContext(
			ctx,
			'zoominfo.webhook.companyUpdate',
			{
				webhookId: event.webhookDetails.id,
				eventType: event.webhookDetails.eventType,
				recordCount: event.data.length,
				changedAttributes: [
					...new Set(event.data.flatMap((r) => r.changedAttributes ?? [])),
				].sort(),
			},
			'completed',
		);

		return { success: true, data: event };
	},
};
