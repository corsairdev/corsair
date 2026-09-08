import { logEventFromContext } from 'corsair/core';
import type { XeroWebhooks } from '../index';
import { createXeroEventMatch, verifyXeroWebhookSignature } from './types';

export const contactCreated: XeroWebhooks['contactCreated'] = {
	match: createXeroEventMatch('CONTACT', 'CREATE'),

	handler: async (ctx, request) => {
		const verification = verifyXeroWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'xero.webhook.contact.created',
			{ count: event.events?.length ?? 0 },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const contactUpdated: XeroWebhooks['contactUpdated'] = {
	match: createXeroEventMatch('CONTACT', 'UPDATE'),

	handler: async (ctx, request) => {
		const verification = verifyXeroWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		await logEventFromContext(
			ctx,
			'xero.webhook.contact.updated',
			{ count: event.events?.length ?? 0 },
			'completed',
		);

		return { success: true, data: event };
	},
};

export const ContactWebhooks = {
	created: contactCreated,
	updated: contactUpdated,
};
