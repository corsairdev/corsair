import { logEventFromContext } from 'corsair/core';
import type { GithubEndpoints } from '..';
import { makeGithubRequest } from '../client';
import type { DiscussionGetResponse, DiscussionsListResponse } from './types';

export const list: GithubEndpoints['discussionsList'] = async (ctx, input) => {
	const { owner, repo, ...queryParams } = input;
	const endpoint = `/repos/${owner}/${repo}/discussions`;
	const result = await makeGithubRequest<DiscussionsListResponse>(
		endpoint,
		ctx.key,
		{ query: queryParams },
	);

	if (result && ctx.db.discussions) {
		try {
			for (const discussion of result) {
				await ctx.db.discussions.upsertByEntityId(discussion.id.toString(), {
					id: discussion.id,
					nodeId: discussion.nodeId,
					htmlUrl: discussion.htmlUrl,
					repositoryUrl: discussion.repositoryUrl,
					number: discussion.number,
					title: discussion.title,
					body: discussion.body,
					state: discussion.state,
					locked: discussion.locked,
					comments: discussion.comments,
					authorAssociation: discussion.authorAssociation,
					categoryId: discussion.category?.id,
					categoryName: discussion.category?.name,
					createdAt: discussion.createdAt
						? new Date(discussion.createdAt)
						: null,
					updatedAt: discussion.updatedAt
						? new Date(discussion.updatedAt)
						: null,
					answerChosenAt: discussion.answerChosenAt
						? new Date(discussion.answerChosenAt)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to save discussions to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.discussions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['discussionsGet'] = async (ctx, input) => {
	const { owner, repo, discussionNumber } = input;
	const endpoint = `/repos/${owner}/${repo}/discussions/${discussionNumber}`;
	const result = await makeGithubRequest<DiscussionGetResponse>(
		endpoint,
		ctx.key,
	);

	if (result && ctx.db.discussions) {
		try {
			await ctx.db.discussions.upsertByEntityId(result.id.toString(), {
				id: result.id,
				nodeId: result.nodeId,
				htmlUrl: result.htmlUrl,
				repositoryUrl: result.repositoryUrl,
				number: result.number,
				title: result.title,
				body: result.body,
				state: result.state,
				locked: result.locked,
				comments: result.comments,
				authorAssociation: result.authorAssociation,
				categoryId: result.category?.id,
				categoryName: result.category?.name,
				createdAt: result.createdAt ? new Date(result.createdAt) : null,
				updatedAt: result.updatedAt ? new Date(result.updatedAt) : null,
				answerChosenAt: result.answerChosenAt
					? new Date(result.answerChosenAt)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save discussion to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.discussions.get',
		{ ...input },
		'completed',
	);
	return result;
};
