import { logEventFromContext } from '../../utils/events';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const add: FigmaEndpoints['commentsAdd'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['commentsAdd']>(
		`v1/files/${input.file_key}/comments`,
		ctx.key,
		{
			method: 'POST',
			body: {
				message: input.message,
				comment_id: input.comment_id,
				// any: client_meta can be absolute coords, node-relative, or region object
				client_meta: input.client_meta as Record<string, unknown> | undefined,
			},
		},
	);

	if (result.id && ctx.db.comments) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				id: result.id,
				uuid: result.uuid,
				message: result.message,
				file_key: result.file_key,
				order_id: result.order_id,
				parent_id: result.parent_id,
				created_at: result.created_at,
				resolved_at: result.resolved_at,
				user_id: result.user?.id,
				user_handle: result.user?.handle,
			});
		} catch (error) {
			console.warn('Failed to save comment to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.comments.add', { ...input }, 'completed');
	return result;
};

export const deleteComment: FigmaEndpoints['commentsDelete'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['commentsDelete']>(
		`v1/files/${input.file_key}/comments/${input.comment_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.comments) {
		try {
			const existing = await ctx.db.comments.findByEntityId(input.comment_id);
			if (existing) {
				await ctx.db.comments.upsertByEntityId(input.comment_id, {
					...existing.data,
					resolved_at: new Date().toISOString(),
				});
			}
		} catch (error) {
			console.warn('Failed to update comment in database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.comments.delete', { ...input }, 'completed');
	return result;
};

export const list: FigmaEndpoints['commentsList'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['commentsList']>(
		`v1/files/${input.file_key}/comments`,
		ctx.key,
		{
			method: 'GET',
			query: { as_md: input.as_md },
		},
	);

	if (result.comments && ctx.db.comments) {
		try {
			for (const comment of result.comments) {
				if (comment.id) {
					await ctx.db.comments.upsertByEntityId(comment.id, {
						id: comment.id,
						uuid: comment.uuid,
						message: comment.message,
						file_key: input.file_key,
						order_id: comment.order_id,
						parent_id: comment.parent_id,
						created_at: comment.created_at,
						resolved_at: comment.resolved_at,
						user_id: comment.user?.id,
						user_handle: comment.user?.handle,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save comments to database:', error);
		}
	}

	await logEventFromContext(ctx, 'figma.comments.list', { ...input }, 'completed');
	return result;
};

export const getReactions: FigmaEndpoints['commentsGetReactions'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['commentsGetReactions']>(
		`v1/files/${input.file_key}/comments/${input.comment_id}/reactions`,
		ctx.key,
		{ method: 'GET', query: { cursor: input.cursor } },
	);

	await logEventFromContext(ctx, 'figma.comments.getReactions', { ...input }, 'completed');
	return result;
};

export const addReaction: FigmaEndpoints['commentsAddReaction'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['commentsAddReaction']>(
		`v1/files/${input.file_key}/comments/${input.comment_id}/reactions`,
		ctx.key,
		{ method: 'POST', body: { emoji: input.emoji } },
	);

	await logEventFromContext(ctx, 'figma.comments.addReaction', { ...input }, 'completed');
	return result;
};

export const deleteReaction: FigmaEndpoints['commentsDeleteReaction'] = async (ctx, input) => {
	const result = await makeFigmaRequest<FigmaEndpointOutputs['commentsDeleteReaction']>(
		`v1/files/${input.file_key}/comments/${input.comment_id}/reactions`,
		ctx.key,
		{ method: 'DELETE', query: { emoji: input.emoji } },
	);

	await logEventFromContext(ctx, 'figma.comments.deleteReaction', { ...input }, 'completed');
	return result;
};
