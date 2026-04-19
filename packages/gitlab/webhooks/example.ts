import { logEventFromContext } from 'corsair/core';
import type { GitlabWebhooks } from '..';
import { createGitlabMatch, verifyGitlabWebhookSignature } from './types';

export const example: GitlabWebhooks['example'] = {
	match: createGitlabMatch('example'),

	handler: async (ctx, request) => {
		const verification = verifyGitlabWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.object_kind !== 'example') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(ctx, 'gitlab.webhook.example', { ...event }, 'completed');

		return { success: true, data: event };
	},
};
