import { logEventFromContext } from '../../utils/events';
import type { GithubBoundEndpoints, GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	RepositoriesListResponse,
	RepositoryBranchesListResponse,
	RepositoryCommitsListResponse,
	RepositoryContentGetResponse,
	RepositoryGetResponse,
} from './types';

export const list: GithubEndpoints['repositoriesList'] = async (ctx, input) => {
	const { owner, type, ...queryParams } = input;
	let endpoint = owner ? `/orgs/${owner}/repos` : '/user/repos';
	let result: RepositoriesListResponse;

	result = await makeGithubRequest<RepositoriesListResponse>(
		endpoint,
		ctx.options.token,
		{ query: { ...queryParams, type } },
	);

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
	const result = await makeGithubRequest<RepositoryGetResponse>(
		endpoint,
		ctx.options.token,
	);

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
		ctx.options.token,
		{ query: queryParams },
	);

	const endpoints = ctx.endpoints as GithubBoundEndpoints;
	await endpoints.repositories.get({
		owner,
		repo,
	});

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
		ctx.options.token,
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
		ctx.options.token,
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
