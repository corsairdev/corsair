import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubEndpoints } from '../index';
import type {
	SearchIssuesResponse,
	SearchRepositoriesResponse,
	SearchUsersResponse,
} from './types';

export const issues: GithubEndpoints['searchIssues'] = async (ctx, input) => {
	const result = await makeGithubRequest<SearchIssuesResponse>(
		'/search/issues',
		ctx.key,
		{ query: input },
	);

	if (result.items && ctx.db.issues) {
		try {
			for (const issue of result.items) {
				// Remove search-specific fields before persisting
				const { score, pull_request, repository, ...issueData } = issue;
				await ctx.db.issues.upsertByEntityId(issue.id.toString(), issueData);
			}
		} catch (error) {
			console.warn('Failed to save searched issues to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.search.issues',
		{ ...input },
		'completed',
	);
	return result;
};

export const repositories: GithubEndpoints['searchRepositories'] = async (
	ctx,
	input,
) => {
	const result = await makeGithubRequest<SearchRepositoriesResponse>(
		'/search/repositories',
		ctx.key,
		{ query: input },
	);

	if (result.items && ctx.db.repositories) {
		try {
			for (const repository of result.items) {
				// Remove search-specific fields before persisting
				const { score, watchers, ...repoData } = repository;
				await ctx.db.repositories.upsertByEntityId(
					repository.id.toString(),
					repoData,
				);
			}
		} catch (error) {
			console.warn('Failed to save searched repositories to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.search.repositories',
		{ ...input },
		'completed',
	);
	return result;
};

export const users: GithubEndpoints['searchUsers'] = async (ctx, input) => {
	const result = await makeGithubRequest<SearchUsersResponse>(
		'/search/users',
		ctx.key,
		{ query: input },
	);

	if (result.items && ctx.db.users) {
		try {
			for (const user of result.items) {
				// Remove search-specific fields before persisting
				const { score, ...userData } = user;
				await ctx.db.users.upsertByEntityId(user.id.toString(), {
					...userData,
					lowercaseUsername: user.login.toLowerCase(),
				});
			}
		} catch (error) {
			console.warn('Failed to save searched users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.search.users',
		{ ...input },
		'completed',
	);
	return result;
};
