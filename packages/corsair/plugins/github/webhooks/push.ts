import type { GithubWebhooks } from '..';
import type { PushEventType } from './types';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

function createGithubMatch(eventName: string) {
	return (request: import('../../../core/webhooks').RawWebhookRequest) => {
		const headers = request.headers as Record<string, string | undefined>;
		const githubEvent = headers['x-github-event'];
		return githubEvent === eventName;
	};
}

export const push: GithubWebhooks['push'] = {
	match: createGithubMatch('push'),

	handler: async (ctx, request) => {
		const event = request.payload as PushEventType;

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
