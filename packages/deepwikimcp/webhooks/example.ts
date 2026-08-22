import { logEventFromContext } from 'corsair/core';
import type { DeepwikiMcpWebhooks } from '..';
import {
	createDeepwikiMcpMatch,
	verifyDeepwikiMcpWebhookSignature,
} from './types';

export const example: DeepwikiMcpWebhooks['example'] = {
	match: createDeepwikiMcpMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyDeepwikiMcpWebhookSignature(request, ctx.key);
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
			'deepwikimcp.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
