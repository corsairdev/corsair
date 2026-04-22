import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

async function upsertRepository(
	ctx: Parameters<GithubWebhooks['repositoryCreated']['handler']>[0],
	repo: Parameters<
		GithubWebhooks['repositoryCreated']['handler']
	>[1]['payload']['repository'],
	deletedAt?: Date | null,
) {
	if (!ctx.db.repositories) return;
	await ctx.db.repositories.upsertByEntityId(repo.id.toString(), {
		id: repo.id,
		nodeId: repo.node_id,
		name: repo.name,
		fullName: repo.full_name,
		private: repo.private,
		htmlUrl: repo.html_url,
		description: repo.description,
		fork: repo.fork,
		url: repo.url,
		createdAt: repo.created_at ? new Date(repo.created_at) : null,
		updatedAt: repo.updated_at ? new Date(repo.updated_at) : null,
		pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
		defaultBranch: repo.default_branch,
		deletedAt: deletedAt ?? null,
	});
}

export const repositoryCreated: GithubWebhooks['repositoryCreated'] = {
	match: createGithubEventMatch('repository', 'created'),
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
		console.log('GitHub Repository Created:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to save repository to database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryDeleted: GithubWebhooks['repositoryDeleted'] = {
	match: createGithubEventMatch('repository', 'deleted'),
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
		console.log('GitHub Repository Deleted:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository, new Date());
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryArchived: GithubWebhooks['repositoryArchived'] = {
	match: createGithubEventMatch('repository', 'archived'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'archived') return { success: false, data: undefined };
		console.log('GitHub Repository Archived:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryUnarchived: GithubWebhooks['repositoryUnarchived'] = {
	match: createGithubEventMatch('repository', 'unarchived'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'unarchived')
			return { success: false, data: undefined };
		console.log('GitHub Repository Unarchived:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryRenamed: GithubWebhooks['repositoryRenamed'] = {
	match: createGithubEventMatch('repository', 'renamed'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'renamed') return { success: false, data: undefined };
		console.log('GitHub Repository Renamed:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryPublicized: GithubWebhooks['repositoryPublicized'] = {
	match: createGithubEventMatch('repository', 'publicized'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'publicized')
			return { success: false, data: undefined };
		console.log('GitHub Repository Publicized:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryPrivatized: GithubWebhooks['repositoryPrivatized'] = {
	match: createGithubEventMatch('repository', 'privatized'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'privatized')
			return { success: false, data: undefined };
		console.log('GitHub Repository Privatized:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};

export const repositoryTransferred: GithubWebhooks['repositoryTransferred'] = {
	match: createGithubEventMatch('repository', 'transferred'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		if (event.action !== 'transferred')
			return { success: false, data: undefined };
		console.log('GitHub Repository Transferred:', {
			name: event.repository.full_name,
		});
		try {
			await upsertRepository(ctx, event.repository);
		} catch (error) {
			console.warn('Failed to update repository in database:', error);
		}
		return { success: true, data: event };
	},
};
