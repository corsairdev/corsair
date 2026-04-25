import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubBoundEndpoints, GithubEndpoints } from '../index';
import type {
	RepositoriesListResponse,
	RepositoryBranchesListResponse,
	RepositoryCommitsListResponse,
	RepositoryContentGetResponse,
	RepositoryGetResponse,
} from './types';

export const list: GithubEndpoints['repositoriesList'] = async (ctx, input) => {
	const { owner, type, ...queryParams } = input;
	let endpoint = owner ? `/users/${owner}/repos` : '/user/repos';
	let result: RepositoriesListResponse;

	result = await makeGithubRequest<RepositoriesListResponse>(
		endpoint,
		ctx.key,
		{
			query: { ...queryParams, type },
		},
	);

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
	const result = await makeGithubRequest<RepositoryGetResponse>(
		endpoint,
		ctx.key,
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
		ctx.key,
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
		ctx.key,
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
		ctx.key,
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
