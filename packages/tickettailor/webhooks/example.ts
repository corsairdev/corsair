import { logEventFromContext } from 'corsair/core';
import type { TicketTailorWebhooks } from '..';
import { createTicketTailorMatch, verifyTicketTailorWebhookSignature } from './types';

export const example: TicketTailorWebhooks['example'] = {
	match: createTicketTailorMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyTicketTailorWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.type !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'tickettailor.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
