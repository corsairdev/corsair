import type { GithubWebhooks } from '../index';
import { verifyGithubWebhookSignature } from './types';

function matchBranchCreated(
	request: Parameters<GithubWebhooks['branchCreated']['match']>[0],
): boolean {
	const headers = request.headers as Record<string, string | undefined>;
	if (headers['x-github-event'] !== 'create') return false;
	try {
		const body =
			typeof request.body === 'string'
				? JSON.parse(request.body)
				: request.body;
		return (body as Record<string, unknown>).ref_type === 'branch';
	} catch {
		return false;
	}
}

function matchBranchDeleted(
	request: Parameters<GithubWebhooks['branchDeleted']['match']>[0],
): boolean {
	const headers = request.headers as Record<string, string | undefined>;
	if (headers['x-github-event'] !== 'delete') return false;
	try {
		const body =
			typeof request.body === 'string'
				? JSON.parse(request.body)
				: request.body;
		return (body as Record<string, unknown>).ref_type === 'branch';
	} catch {
		return false;
	}
}

function matchTagCreated(
	request: Parameters<GithubWebhooks['tagCreated']['match']>[0],
): boolean {
	const headers = request.headers as Record<string, string | undefined>;
	if (headers['x-github-event'] !== 'create') return false;
	try {
		const body =
			typeof request.body === 'string'
				? JSON.parse(request.body)
				: request.body;
		return (body as Record<string, unknown>).ref_type === 'tag';
	} catch {
		return false;
	}
}

function matchTagDeleted(
	request: Parameters<GithubWebhooks['tagDeleted']['match']>[0],
): boolean {
	const headers = request.headers as Record<string, string | undefined>;
	if (headers['x-github-event'] !== 'delete') return false;
	try {
		const body =
			typeof request.body === 'string'
				? JSON.parse(request.body)
				: request.body;
		return (body as Record<string, unknown>).ref_type === 'tag';
	} catch {
		return false;
	}
}

export const branchCreated: GithubWebhooks['branchCreated'] = {
	match: matchBranchCreated,
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		console.log('GitHub Branch Created:', {
			ref: event.ref,
			repository: event.repository.full_name,
		});
		try {
			if (ctx.db.branches) {
				const entityId = `${event.repository.id}:${event.ref}`;
				await ctx.db.branches.upsertByEntityId(entityId, {
					repositoryId: event.repository.id,
					repositoryFullName: event.repository.full_name,
					name: event.ref,
					protected: false,
				});
			}
		} catch (error) {
			console.warn('Failed to save branch to database:', error);
		}
		return { success: true, data: event };
	},
};

export const branchDeleted: GithubWebhooks['branchDeleted'] = {
	match: matchBranchDeleted,
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		console.log('GitHub Branch Deleted:', {
			ref: event.ref,
			repository: event.repository.full_name,
		});
		try {
			if (ctx.db.branches) {
				const entityId = `${event.repository.id}:${event.ref}`;
				await ctx.db.branches.upsertByEntityId(entityId, {
					repositoryId: event.repository.id,
					repositoryFullName: event.repository.full_name,
					name: event.ref,
					deletedAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to mark branch as deleted in database:', error);
		}
		return { success: true, data: event };
	},
};

export const tagCreated: GithubWebhooks['tagCreated'] = {
	match: matchTagCreated,
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		console.log('GitHub Tag Created:', {
			ref: event.ref,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};

export const tagDeleted: GithubWebhooks['tagDeleted'] = {
	match: matchTagDeleted,
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		console.log('GitHub Tag Deleted:', {
			ref: event.ref,
			repository: event.repository.full_name,
		});
		return { success: true, data: event };
	},
};
