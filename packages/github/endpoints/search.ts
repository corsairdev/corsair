import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubEndpoints } from '../index';
import { convertQueryKeysToSnakeCase } from '../utils';
import type {
	SearchIssuesResponse,
	SearchRepositoriesResponse,
	SearchUsersResponse,
} from './types';

// The plugin exposes camelCase inputs (perPage) for internal consistency;
// GitHub's Search API expects snake_case query keys, so convert at the wire
// boundary right before the request. Central makeGithubRequest already does
// this, but search also strips internal-only fields (advancedSearch,
// searchType) that must never go out to GitHub.
type StringRecord = Record<string, string | number | boolean | undefined>;

/**
 * Build the wire query for GitHub Search.
 *
 * Strips plugin-internal controls (`advancedSearch`, `searchType`) that the
 * REST API would silently ignore, then converts the remaining camelCase
 * keys (`perPage`) to the snake_case form GitHub expects (`per_page`).
 */
export function toSearchQuery(
	input: StringRecord & { advancedSearch?: boolean; searchType?: string },
): StringRecord {
	const { advancedSearch: _advanced, searchType: _type, ...rest } = input;
	return convertQueryKeysToSnakeCase(rest);
}

function loggableInput(input: StringRecord): StringRecord {
	// GitHub search queries can carry sensitive qualifiers (author emails,
	// org names); log only the structural fields, not the query string.
	const { q: _q, ...rest } = input;
	return rest;
}

export const issues: GithubEndpoints['searchIssues'] = async (ctx, input) => {
	const result = await makeGithubRequest<SearchIssuesResponse>(
		'/search/issues',
		ctx,
		{ query: toSearchQuery(input) },
	);

	if (result.items && ctx.db.issues) {
		try {
			for (const issue of result.items) {
				// Strip search-specific enrichment before persisting so the row
				// matches the canonical Issue entity shape.
				const raw = issue as Record<string, unknown>;
				const { score, pullRequest, repository, ...issueData } = raw;
				await ctx.db.issues.upsertByEntityId(
					String(issue.id),
					issueData as Parameters<typeof ctx.db.issues.upsertByEntityId>[1],
				);
			}
		} catch (error) {
			console.warn('Failed to save searched issues to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.search.issues',
		loggableInput(input),
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
		ctx,
		{ query: toSearchQuery(input) },
	);

	if (result.items && ctx.db.repositories) {
		try {
			for (const repository of result.items) {
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
		loggableInput(input),
		'completed',
	);
	return result;
};

export const users: GithubEndpoints['searchUsers'] = async (ctx, input) => {
	const result = await makeGithubRequest<SearchUsersResponse>(
		'/search/users',
		ctx,
		{ query: toSearchQuery(input) },
	);

	if (result.items && ctx.db.users) {
		try {
			for (const user of result.items) {
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
		loggableInput(input),
		'completed',
	);
	return result;
};
