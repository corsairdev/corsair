import { logEventFromContext } from 'corsair/core';
import { GithubAPIError, makeGithubRequest } from '../client';
import type { GithubBoundEndpoints, GithubEndpoints } from '../index';
import type {
	RepositoriesListResponse,
	RepositoriesListStargazersResponse,
	RepositoryBranchesListResponse,
	RepositoryCommitsListResponse,
	RepositoryContentGetResponse,
	RepositoryGetResponse,
} from './types';

export const list: GithubEndpoints['repositoriesList'] = async (ctx, input) => {
	const { owner, type, ...queryParams } = input;
	let endpoint = owner ? `/users/${owner}/repos` : '/user/repos';
	let result: RepositoriesListResponse;

	result = await makeGithubRequest<RepositoriesListResponse>(endpoint, ctx, {
		query: { ...queryParams, type },
	});

	if (result && ctx.db.repositories) {
		try {
			for (const repo of result) {
				await ctx.db.repositories.upsertByEntityId(repo.id.toString(), repo);
			}
		} catch (error) {
			console.warn('Failed to save repositories to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.repositories.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['repositoriesGet'] = async (ctx, input) => {
	const { owner, repo } = input;
	const endpoint = `/repos/${owner}/${repo}`;
	const result = await makeGithubRequest<RepositoryGetResponse>(endpoint, ctx);

	if (result && ctx.db.repositories) {
		try {
			await ctx.db.repositories.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save repository to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.repositories.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const listBranches: GithubEndpoints['repositoriesListBranches'] = async (
	ctx,
	input,
) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/branches`;
	const result = await makeGithubRequest<RepositoryBranchesListResponse>(
		endpoint,
		ctx,
		{ query: queryParams },
	);

	const endpoints = ctx.endpoints as GithubBoundEndpoints;
	const repoData = await endpoints.repositories.get({ owner, repo });

	if (result && ctx.db.branches && repoData?.id) {
		try {
			for (const branch of result) {
				const entityId = `${repoData.id}:${branch.name}`;
				await ctx.db.branches.upsertByEntityId(entityId, {
					repositoryId: repoData.id,
					repositoryFullName: repoData.fullName ?? `${owner}/${repo}`,
					name: branch.name,
					sha: branch.commit.sha,
					protected: branch.protected,
				});
			}
		} catch (error) {
			console.warn('Failed to save branches to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.repositories.listBranches',
		{ ...input },
		'completed',
	);
	return result;
};

export const listCommits: GithubEndpoints['repositoriesListCommits'] = async (
	ctx,
	input,
) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/commits`;
	const result = await makeGithubRequest<RepositoryCommitsListResponse>(
		endpoint,
		ctx,
		{ query: queryParams },
	);

	const endpoints = ctx.endpoints as GithubBoundEndpoints;
	await endpoints.repositories.get({
		owner,
		repo,
	});

	await logEventFromContext(
		ctx,
		'github.repositories.listCommits',
		{ ...input },
		'completed',
	);
	return result;
};

export const getContent: GithubEndpoints['repositoriesGetContent'] = async (
	ctx,
	input,
) => {
	const { owner, repo, path, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/contents/${path}`;
	const result = await makeGithubRequest<RepositoryContentGetResponse>(
		endpoint,
		ctx,
		{ query: queryParams },
	);

	const endpoints = ctx.endpoints as GithubBoundEndpoints;
	await endpoints.repositories.get({
		owner,
		repo,
	});

	await logEventFromContext(
		ctx,
		'github.repositories.getContent',
		{ ...input },
		'completed',
	);
	return result;
};

/** Star a repository for the authenticated user (PUT /user/starred/{owner}/{repo}). */
export const star: GithubEndpoints['repositoriesStar'] = async (ctx, input) => {
	const { owner, repo } = input;
	const endpoint = `/user/starred/${owner}/${repo}`;
	await makeGithubRequest<void>(endpoint, ctx, { method: 'PUT' });

	await logEventFromContext(
		ctx,
		'github.repositories.star',
		{ ...input },
		'completed',
	);
	return true;
};

/** Unstar a repository for the authenticated user (DELETE /user/starred/{owner}/{repo}). */
export const unstar: GithubEndpoints['repositoriesUnstar'] = async (
	ctx,
	input,
) => {
	const { owner, repo } = input;
	const endpoint = `/user/starred/${owner}/${repo}`;
	await makeGithubRequest<void>(endpoint, ctx, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'github.repositories.unstar',
		{ ...input },
		'completed',
	);
	return true;
};

/**
 * Whether the authenticated user has starred the repo (GET /user/starred/{owner}/{repo}).
 * 204 = starred; 404 = not starred.
 */
export const checkStarred: GithubEndpoints['repositoriesCheckStarred'] = async (
	ctx,
	input,
) => {
	const { owner, repo } = input;
	const endpoint = `/user/starred/${owner}/${repo}`;
	try {
		await makeGithubRequest<void>(endpoint, ctx);
		await logEventFromContext(
			ctx,
			'github.repositories.checkStarred',
			{ ...input },
			'completed',
		);
		return { starred: true };
	} catch (error) {
		if (error instanceof GithubAPIError && error.code === 404) {
			await logEventFromContext(
				ctx,
				'github.repositories.checkStarred',
				{ ...input },
				'completed',
			);
			return { starred: false };
		}
		throw error;
	}
};

/** List repositories starred by the authenticated user (GET /user/starred). */
export const listStarred: GithubEndpoints['repositoriesListStarred'] = async (
	ctx,
	input,
) => {
	const { sort, direction, perPage, page } = input;
	const result = await makeGithubRequest<RepositoriesListResponse>(
		'/user/starred',
		ctx,
		{
			query: {
				sort,
				direction,
				per_page: perPage,
				page,
			},
		},
	);

	if (result && ctx.db.repositories) {
		try {
			for (const repo of result) {
				await ctx.db.repositories.upsertByEntityId(repo.id.toString(), repo);
			}
		} catch (error) {
			console.warn('Failed to save starred repositories to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.repositories.listStarred',
		{ ...input },
		'completed',
	);
	return result;
};

/** List users who have starred a repository (GET /repos/{owner}/{repo}/stargazers). */
export const listStargazers: GithubEndpoints['repositoriesListStargazers'] =
	async (ctx, input) => {
		const { owner, repo, perPage, page } = input;
		const endpoint = `/repos/${owner}/${repo}/stargazers`;
		const result = await makeGithubRequest<RepositoriesListStargazersResponse>(
			endpoint,
			ctx,
			{
				query: {
					per_page: perPage,
					page,
				},
				accept: 'application/vnd.github.v3.star+json',
			},
		);

		await logEventFromContext(
			ctx,
			'github.repositories.listStargazers',
			{ ...input },
			'completed',
		);
		return result;
	};
