import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const memberAdded: GithubWebhooks['memberAdded'] = {
	match: createGithubEventMatch('member', 'added'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'added') return { success: false, data: undefined };
		console.log('GitHub Member Added:', {
			member: event.member?.login,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const memberRemoved: GithubWebhooks['memberRemoved'] = {
	match: createGithubEventMatch('member', 'removed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'removed') return { success: false, data: undefined };
		console.log('GitHub Member Removed:', {
			member: event.member?.login,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const membershipAdded: GithubWebhooks['membershipAdded'] = {
	match: createGithubEventMatch('membership', 'added'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'added') return { success: false, data: undefined };
		console.log('GitHub Membership Added:', {
			member: event.member?.login,
			team: event.team.name,
		});
		return { success: true, data: event };
	},
};

export const membershipRemoved: GithubWebhooks['membershipRemoved'] = {
	match: createGithubEventMatch('membership', 'removed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'removed') return { success: false, data: undefined };
		console.log('GitHub Membership Removed:', {
			member: event.member?.login,
			team: event.team.name,
		});
		return { success: true, data: event };
	},
};
