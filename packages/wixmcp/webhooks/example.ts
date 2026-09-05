import { logEventFromContext } from 'corsair/core';
import type { WixMcpWebhooks } from '..';
import { createWixMcpMatch, verifyWixMcpWebhookSignature } from './types';

export const example: WixMcpWebhooks['example'] = {
	match: createWixMcpMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyWixMcpWebhookSignature(request, ctx.key);
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

		await logEventFromContext(ctx, 'wixmcp.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
