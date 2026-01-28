import { logEventFromContext } from '../../utils/events';
import type { GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	RepositoryBranchesListResponse,
	RepositoryCommitsListResponse,
	RepositoryContentGetResponse,
	RepositoryGetResponse,
	RepositoriesListResponse,
} from './types';

export const list: GithubEndpoints['repositoriesList'] = async (ctx, input) => {
	const { owner, type, ...queryParams } = input;
	const endpoint = owner
		? `/orgs/${owner}/repos`
		: '/user/repos';
	const result = await makeGithubRequest<RepositoriesListResponse>(
		endpoint,
		ctx.options.token,
		{ query: { ...queryParams, type } },
	);

	if (result && ctx.db.repositories) {
		try {
			for (const repo of result) {
				await ctx.db.repositories.upsert(repo.id.toString(), {
					id: repo.id,
					nodeId: repo.nodeId,
					name: repo.name,
					fullName: repo.fullName,
					private: repo.private,
					htmlUrl: repo.htmlUrl,
					description: repo.description,
					fork: repo.fork,
					url: repo.url,
					createdAt: repo.createdAt ? new Date(repo.createdAt) : undefined,
					updatedAt: repo.updatedAt ? new Date(repo.updatedAt) : undefined,
					pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
					defaultBranch: repo.defaultBranch,
					language: repo.language,
					stargazersCount: repo.stargazersCount,
					watchersCount: repo.watchersCount,
					forksCount: repo.forksCount,
					openIssuesCount: repo.openIssuesCount,
					archived: repo.archived,
					disabled: repo.disabled,
				});
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
		ctx.options.token,
	);

	if (result && ctx.db.repositories) {
		try {
			await ctx.db.repositories.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				name: result.name,
				fullName: result.fullName,
				private: result.private,
				htmlUrl: result.htmlUrl,
				description: result.description,
				fork: result.fork,
				url: result.url,
				createdAt: result.createdAt ? new Date(result.createdAt) : undefined,
				updatedAt: result.updatedAt ? new Date(result.updatedAt) : undefined,
				pushedAt: result.pushedAt ? new Date(result.pushedAt) : null,
				defaultBranch: result.defaultBranch,
				language: result.language,
				stargazersCount: result.stargazersCount,
				watchersCount: result.watchersCount,
				forksCount: result.forksCount,
				openIssuesCount: result.openIssuesCount,
				archived: result.archived,
				disabled: result.disabled,
			});
		} catch (error) {
			console.warn('Failed to save repository to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.repositories.get', { ...input }, 'completed');
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

	await logEventFromContext(
		ctx,
		'github.repositories.getContent',
		{ ...input },
		'completed',
	);
	return result;
};
