import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const watchStarted: GithubWebhooks['watchStarted'] = {
	match: createGithubEventMatch('watch', 'started'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'started') return { success: false, data: undefined };
		console.log('GitHub Repository Watch Started:', {
			repository: event.repository.full_name,
			watcher: event.sender.login,
		});
		return { success: true, data: event };
	},
};
