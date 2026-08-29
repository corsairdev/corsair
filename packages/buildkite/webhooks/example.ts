import { logEventFromContext } from 'corsair/core';
import type { BuildkiteWebhooks } from '..';
import { createBuildkiteMatch, verifyBuildkiteWebhookSignature } from './types';

export const example: BuildkiteWebhooks['example'] = {
	match: createBuildkiteMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyBuildkiteWebhookSignature(request, ctx.key);
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
			'buildkite.webhook.example',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
