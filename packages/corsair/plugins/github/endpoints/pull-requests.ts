import { logEventFromContext } from '../../utils/events';
import type { GithubEndpoints } from '..';
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
				await ctx.db.pullRequests.upsert(pr.id.toString(), {
					id: pr.id,
					nodeId: pr.nodeId,
					url: pr.url,
					htmlUrl: pr.htmlUrl,
					diffUrl: pr.diffUrl,
					patchUrl: pr.patchUrl,
					issueUrl: pr.issueUrl,
					number: pr.number,
					state: pr.state,
					locked: pr.locked,
					title: pr.title,
					body: pr.body,
					createdAt: new Date(pr.createdAt),
					updatedAt: new Date(pr.updatedAt),
					closedAt: pr.closedAt ? new Date(pr.closedAt) : null,
					mergedAt: pr.mergedAt ? new Date(pr.mergedAt) : null,
					mergeCommitSha: pr.mergeCommitSha,
					draft: pr.draft,
					merged: pr.merged,
					mergeable: pr.mergeable,
					comments: pr.comments,
					reviewComments: pr.reviewComments,
					commits: pr.commits,
					additions: pr.additions,
					deletions: pr.deletions,
					changedFiles: pr.changedFiles,
				});
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
			await ctx.db.pullRequests.upsert(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				url: result.url,
				htmlUrl: result.htmlUrl,
				diffUrl: result.diffUrl,
				patchUrl: result.patchUrl,
				issueUrl: result.issueUrl,
				number: result.number,
				state: result.state,
				locked: result.locked,
				title: result.title,
				body: result.body,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				closedAt: result.closedAt ? new Date(result.closedAt) : null,
				mergedAt: result.mergedAt ? new Date(result.mergedAt) : null,
				mergeCommitSha: result.mergeCommitSha,
				draft: result.draft,
				merged: result.merged,
				mergeable: result.mergeable,
				comments: result.comments,
				reviewComments: result.reviewComments,
				commits: result.commits,
				additions: result.additions,
				deletions: result.deletions,
				changedFiles: result.changedFiles,
			});
		} catch (error) {
			console.warn('Failed to save pull request to database:', error);
		}
	}

	await logEventFromContext(ctx, 'github.pullRequests.get', { ...input }, 'completed');
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

	await logEventFromContext(
		ctx,
		'github.pullRequests.createReview',
		{ ...input },
		'completed',
	);
	return result;
};
