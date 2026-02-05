import { logEventFromContext } from '../../utils/events';
import type { GithubBoundEndpoints, GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type {
	PullRequestGetResponse,
	PullRequestReviewCreateResponse,
	PullRequestReviewListResponse,
	PullRequestsListResponse,
} from './types';

export const list: GithubEndpoints['pullRequestsList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/pulls`;
	const result = await makeGithubRequest<PullRequestsListResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	if (result && ctx.db.pullRequests) {
		try {
			for (const pr of result) {
				await ctx.db.pullRequests.upsertByEntityId(pr.id.toString(), pr);
			}
		} catch (error) {
			console.warn('Failed to save pull requests to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.pullRequests.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['pullRequestsGet'] = async (ctx, input) => {
	const { owner, repo, pullNumber } = input;
	const endpoint = `/repos/${owner}/${repo}/pulls/${pullNumber}`;
	const result = await makeGithubRequest<PullRequestGetResponse>(
		endpoint,
		ctx.options.token,
	);

	if (result && ctx.db.pullRequests) {
		try {
			await ctx.db.pullRequests.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save pull request to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.pullRequests.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const listReviews: GithubEndpoints['pullRequestsListReviews'] = async (
	ctx,
	input,
) => {
	const { owner, repo, pullNumber, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`;
	const result = await makeGithubRequest<PullRequestReviewListResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	const endpoints = ctx.endpoints as GithubBoundEndpoints;
	await endpoints.pullRequests.get({
		owner,
		repo,
		pullNumber,
	});

	await logEventFromContext(
		ctx,
		'github.pullRequests.listReviews',
		{ ...input },
		'completed',
	);
	return result;
};

export const createReview: GithubEndpoints['pullRequestsCreateReview'] = async (
	ctx,
	input,
) => {
	const { owner, repo, pullNumber, ...body } = input;
	const endpoint = `/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`;
	const result = await makeGithubRequest<PullRequestReviewCreateResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	const endpoints = ctx.endpoints as GithubBoundEndpoints;
	await endpoints.pullRequests.get({
		owner,
		repo,
		pullNumber,
	});

	await logEventFromContext(
		ctx,
		'github.pullRequests.createReview',
		{ ...input },
		'completed',
	);
	return result;
};
