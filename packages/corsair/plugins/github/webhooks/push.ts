import type { GithubWebhooks } from '..';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const push: GithubWebhooks['push'] = {
	match: createGithubEventMatch('push'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyGithubWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		console.log('📤 GitHub Push Event:', {
			ref: event.ref,
			before: event.before,
			after: event.after,
			commits: event.commits.length,
			repository: event.repository.full_name,
		});

		return {
			success: true,
			data: event,
		};
	},
};
