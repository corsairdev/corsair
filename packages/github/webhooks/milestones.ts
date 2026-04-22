import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const milestoneCreated: GithubWebhooks['milestoneCreated'] = {
	match: createGithubEventMatch('milestone', 'created'),
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
		console.log('GitHub Milestone Created:', {
			title: event.milestone.title,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const milestoneClosed: GithubWebhooks['milestoneClosed'] = {
	match: createGithubEventMatch('milestone', 'closed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'closed') return { success: false, data: undefined };
		console.log('GitHub Milestone Closed:', {
			title: event.milestone.title,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const milestoneOpened: GithubWebhooks['milestoneOpened'] = {
	match: createGithubEventMatch('milestone', 'opened'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'opened') return { success: false, data: undefined };
		console.log('GitHub Milestone Opened:', {
			title: event.milestone.title,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const milestoneEdited: GithubWebhooks['milestoneEdited'] = {
	match: createGithubEventMatch('milestone', 'edited'),
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
		console.log('GitHub Milestone Edited:', {
			title: event.milestone.title,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const milestoneDeleted: GithubWebhooks['milestoneDeleted'] = {
	match: createGithubEventMatch('milestone', 'deleted'),
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
		console.log('GitHub Milestone Deleted:', {
			title: event.milestone.title,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};
