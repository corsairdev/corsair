import { logEventFromContext } from 'corsair/core';
import type { DevinMcpWebhooks } from '..';
import { createDevinMcpMatch, verifyDevinMcpWebhookSignature } from './types';

export const example: DevinMcpWebhooks['example'] = {
	match: createDevinMcpMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDevinMcpWebhookSignature(request, ctx.key);
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

		await logEventFromContext(
			ctx,
			'devinmcp.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
