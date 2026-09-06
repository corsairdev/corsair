import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import type { CannyEndpointOutputs } from './types';

export const list: CannyEndpoints['commentsList'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['commentsList']>(
		'comments/list',
		ctx.key,
		{
			method: 'POST',
			body: input ? { ...input } : {},
		},
	);

	if (ctx.db.comments && response.comments) {
		for (const comment of response.comments) {
			try {
				await ctx.db.comments.upsertByEntityId(comment.id, {
					id: comment.id,
					value: comment.value,
					created: new Date(comment.created),
					postID: comment.post?.id,
					authorID: comment.author?.id,
					parentID: comment.parentID,
					internal: comment.internal,
					likeCount: comment.likeCount,
					imageURLs: comment.imageURLs,
				});
			} catch (error) {
				console.warn('Failed to persist comment to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'canny.comments.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: CannyEndpoints['commentsCreate'] = async (ctx, input) => {
	const response = await makeCannyRequest<
		CannyEndpointOutputs['commentsCreate']
	>('comments/create', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	await logEventFromContext(
		ctx,
		'canny.comments.create',
		{ ...input, id: response.id },
		'completed',
	);
	return response;
};

export const deleteComment: CannyEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeCannyRequest<
		CannyEndpointOutputs['commentsDelete']
	>('comments/delete', ctx.key, {
		method: 'POST',
		body: { commentID: input.commentID },
	});

	if (ctx.db.comments) {
		try {
			await ctx.db.comments.deleteByEntityId(input.commentID);
		} catch (error) {
			console.warn('Failed to delete comment from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.comments.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const Comments = {
	list,
	create,
	delete: deleteComment,
};
