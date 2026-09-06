import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import { CannyEndpointInputSchemas, CannyEndpointOutputSchemas } from './types';

export const list: CannyEndpoints['commentsList'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.commentsList.parse(input);
	const raw = await makeCannyRequest<unknown>('comments/list', ctx.key, {
		method: 'POST',
		body: parsedInput ? { ...parsedInput } : {},
	});
	const response = CannyEndpointOutputSchemas.commentsList.parse(raw);

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
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const create: CannyEndpoints['commentsCreate'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.commentsCreate.parse(input);
	const raw = await makeCannyRequest<unknown>('comments/create', ctx.key, {
		method: 'POST',
		body: { ...parsedInput },
	});
	const response = CannyEndpointOutputSchemas.commentsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'canny.comments.create',
		{ ...parsedInput, id: response.id },
		'completed',
	);
	return response;
};

export const deleteComment: CannyEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const parsedInput = CannyEndpointInputSchemas.commentsDelete.parse(input);
	const raw = await makeCannyRequest<unknown>('comments/delete', ctx.key, {
		method: 'POST',
		body: { commentID: parsedInput.commentID },
	});
	const response = CannyEndpointOutputSchemas.commentsDelete.parse(raw);

	if (ctx.db.comments) {
		try {
			await ctx.db.comments.deleteByEntityId(parsedInput.commentID);
		} catch (error) {
			console.warn('Failed to delete comment from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.comments.delete',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const Comments = {
	list,
	create,
	delete: deleteComment,
};
