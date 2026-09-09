import { logEventFromContext } from 'corsair/core';
import type { TursoWebhooks } from '..';
import { createTursoMatch, verifyTursoWebhookSignature } from './types';

export const example: TursoWebhooks['example'] = {
	match: createTursoMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyTursoWebhookSignature(request, ctx.key);
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
			'turso.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
