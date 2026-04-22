import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubEndpoints } from '../index';
import type { ForksListResponse } from './types';

export const list: GithubEndpoints['forksList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/forks`;
	const result = await makeGithubRequest<ForksListResponse>(endpoint, ctx.key, {
		query: queryParams,
	});

	if (result && result.length > 0) {
		try {
			for (const fork of result) {
				// Save each fork as a repository entry
				if (ctx.db.repositories && fork.id) {
					await ctx.db.repositories.upsertByEntityId(fork.id.toString(), {
						id: fork.id,
						nodeId: fork.nodeId,
						name: fork.name,
						fullName: fork.fullName,
						private: fork.private,
						htmlUrl: fork.htmlUrl,
						description: fork.description,
						fork: fork.fork,
						url: fork.url,
						defaultBranch: fork.defaultBranch,
						createdAt: fork.createdAt ? new Date(fork.createdAt) : null,
						updatedAt: fork.updatedAt ? new Date(fork.updatedAt) : null,
						pushedAt: fork.pushedAt ? new Date(fork.pushedAt) : null,
					});
				}

				// Save the fork relationship
				if (ctx.db.forks && fork.id && fork.fullName) {
					await ctx.db.forks.upsertByEntityId(fork.id.toString(), {
						id: fork.id,
						nodeId: fork.nodeId,
						fullName: fork.fullName,
						htmlUrl: fork.htmlUrl,
						description: fork.description,
						private: fork.private,
						fork: fork.fork,
						url: fork.url,
						sourceRepoId: 0, // populated via webhook; not available in list response
						sourceRepoFullName: `${owner}/${repo}`,
						defaultBranch: fork.defaultBranch,
						createdAt: fork.createdAt ? new Date(fork.createdAt) : null,
						updatedAt: fork.updatedAt ? new Date(fork.updatedAt) : null,
						pushedAt: fork.pushedAt ? new Date(fork.pushedAt) : null,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save forks to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.forks.list',
		{ ...input },
		'completed',
	);
	return result;
};
