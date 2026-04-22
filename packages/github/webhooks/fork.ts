import type { GithubWebhooks } from '../index';
import { createGithubEventMatch, verifyGithubWebhookSignature } from './types';

export const forked: GithubWebhooks['forked'] = {
	match: createGithubEventMatch('fork'),
	handler: async (ctx, request) => {
		const v = verifyGithubWebhookSignature(request, ctx.key);
		if (!v.valid)
			return {
				success: false,
				statusCode: 401,
				error: v.error || 'Signature verification failed',
			};
		const event = request.payload;
		const { forkee, repository } = event;

		console.log('GitHub Repository Forked:', {
			fork: forkee.full_name,
			source: repository.full_name,
			by: event.sender.login,
		});

		try {
			// Save the forked repo itself to repositories
			if (ctx.db.repositories) {
				await ctx.db.repositories.upsertByEntityId(forkee.id.toString(), {
					id: forkee.id,
					nodeId: forkee.node_id,
					name: forkee.name,
					fullName: forkee.full_name,
					private: forkee.private,
					htmlUrl: forkee.html_url,
					description: forkee.description,
					fork: forkee.fork,
					url: forkee.url,
					defaultBranch: forkee.default_branch,
					createdAt: forkee.created_at ? new Date(forkee.created_at) : null,
					updatedAt: forkee.updated_at ? new Date(forkee.updated_at) : null,
					pushedAt: forkee.pushed_at ? new Date(forkee.pushed_at) : null,
				});
			}

			// Save the fork relationship
			if (ctx.db.forks) {
				await ctx.db.forks.upsertByEntityId(forkee.id.toString(), {
					id: forkee.id,
					nodeId: forkee.node_id,
					fullName: forkee.full_name,
					htmlUrl: forkee.html_url,
					description: forkee.description,
					private: forkee.private,
					fork: forkee.fork,
					url: forkee.url,
					sourceRepoId: repository.id,
					sourceRepoFullName: repository.full_name,
					defaultBranch: forkee.default_branch,
					createdAt: forkee.created_at ? new Date(forkee.created_at) : null,
					updatedAt: forkee.updated_at ? new Date(forkee.updated_at) : null,
					pushedAt: forkee.pushed_at ? new Date(forkee.pushed_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save fork to database:', error);
		}

		return { success: true, data: event };
	},
};
