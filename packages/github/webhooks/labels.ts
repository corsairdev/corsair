import type { GithubWebhooks } from '..';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const labelCreated: GithubWebhooks['labelCreated'] = {
	match: createGithubEventMatch('label', 'created'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'created') return { success: false, data: undefined };
		console.log('GitHub Label Created:', {
			name: event.label.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const labelEdited: GithubWebhooks['labelEdited'] = {
	match: createGithubEventMatch('label', 'edited'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'edited') return { success: false, data: undefined };
		console.log('GitHub Label Edited:', {
			name: event.label.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const labelDeleted: GithubWebhooks['labelDeleted'] = {
	match: createGithubEventMatch('label', 'deleted'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'deleted') return { success: false, data: undefined };
		console.log('GitHub Label Deleted:', {
			name: event.label.name,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};
