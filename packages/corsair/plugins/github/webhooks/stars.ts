import type { GithubWebhooks } from '..';
import type { StarCreatedEvent, StarDeletedEvent } from './types';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

function createGithubMatch(eventName: string, action?: string) {
	return (request: import('../../../core/webhooks').RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		const headers = request.headers as Record<string, string | undefined>;
		const githubEvent = headers['x-github-event'];
		return (
			githubEvent === eventName &&
			(!action || (parsedBody.action as string) === action)
		);
	};
}

export const starCreated: GithubWebhooks['starCreated'] = {
	match: createGithubMatch('star', 'created'),

	handler: async (ctx, request) => {
		const event = request.payload as StarCreatedEvent;

		if (event.action !== 'created') {
			return {
				success: false,
				data: undefined,
			};
		}

		console.log('⭐ GitHub Star Created:', {
			repository: event.repository.full_name,
			user: event.sender.login,
		});

		return {
			success: true,
			data: event,
		};
	},
};

export const starDeleted: GithubWebhooks['starDeleted'] = {
	match: createGithubMatch('star', 'deleted'),

	handler: async (ctx, request) => {
		const event = request.payload as StarDeletedEvent;

		if (event.action !== 'deleted') {
			return {
				success: false,
				 data: undefined
			};
		}

		console.log('⭐ GitHub Star Deleted:', {
			repository: event.repository.full_name,
			user: event.sender.login,
		});

		return {
			success: true,
			data: event,
		};
	},
};
