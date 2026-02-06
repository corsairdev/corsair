import type { GithubWebhooks } from '..';
import type { StarCreatedEvent, StarDeletedEvent } from './types';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const starCreated: GithubWebhooks['starCreated'] = {
	match: createGithubEventMatch('star', 'created'),

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
	match: createGithubEventMatch('star', 'deleted'),

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

		const event = request.payload as StarDeletedEvent;

		if (event.action !== 'deleted') {
			return {
				success: false,
				data: undefined,
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
