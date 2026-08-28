import { logEventFromContext } from 'corsair/core';
import type { SourcegraphWebhooks } from '..';
import {
	createSourcegraphMatch,
	verifySourcegraphWebhookSignature,
} from './types';

export const example: SourcegraphWebhooks['example'] = {
	match: createSourcegraphMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifySourcegraphWebhookSignature(request, ctx.key);
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
			'sourcegraph.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
