import { makePageFacebookRequest, resolvePageId } from '../client';
import type { FacebookEndpoints } from '../index';
import {
	buildPaginationQuery,
	logFacebookEvent,
	omitUndefined,
} from './shared';
import type { FacebookEndpointOutputs } from './types';

export const create: FacebookEndpoints['createComment'] = async (
	ctx,
	input,
) => {
	const { object_id, message, page_id } = input;
	const pageId = resolvePageId(page_id, object_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['createComment']
	>(`/${object_id}/comments`, ctx, pageId, {
		method: 'POST',
		body: { message },
	});

	await logFacebookEvent(ctx, 'facebook.comments.create', { ...input });
	return result;
};

export const get: FacebookEndpoints['getComment'] = async (ctx, input) => {
	const pageId = resolvePageId(input.page_id, input.comment_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getComment']
	>(`/${input.comment_id}`, ctx, pageId, {
		query: {
			fields:
				input.fields ??
				'id,message,created_time,from,is_hidden,like_count,comment_count',
		},
	});

	if (result.id) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				commentId: result.id,
				message: result.message,
				createdTime: result.created_time,
				authorId: result.from?.id,
				authorName: result.from?.name,
				isHidden: result.is_hidden,
			});
		} catch {
			// Non-fatal cache write
		}
	}

	await logFacebookEvent(ctx, 'facebook.comments.get', { ...input });
	return result;
};

export const list: FacebookEndpoints['getComments'] = async (ctx, input) => {
	const { object_id, page_id, filter, ...pagination } = input;
	const pageId = resolvePageId(page_id, object_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getComments']
	>(`/${object_id}/comments`, ctx, pageId, {
		query: {
			...buildPaginationQuery({
				fields:
					pagination.fields ??
					'id,message,created_time,from,is_hidden,like_count',
				limit: pagination.limit,
				after: pagination.after,
				before: pagination.before,
			}),
			filter,
		},
	});

	if (result.data) {
		for (const comment of result.data) {
			if (!comment.id) continue;
			try {
				await ctx.db.comments.upsertByEntityId(comment.id, {
					commentId: comment.id,
					objectId: object_id,
					message: comment.message,
					createdTime: comment.created_time,
					authorId: comment.from?.id,
					authorName: comment.from?.name,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.comments.list', { ...input });
	return result;
};

export const update: FacebookEndpoints['updateComment'] = async (
	ctx,
	input,
) => {
	const { comment_id, page_id, ...body } = input;
	const pageId = resolvePageId(page_id, comment_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['updateComment']
	>(`/${comment_id}`, ctx, pageId, {
		method: 'POST',
		body: omitUndefined(body),
	});

	await logFacebookEvent(ctx, 'facebook.comments.update', { ...input });
	return result;
};

export const remove: FacebookEndpoints['deleteComment'] = async (
	ctx,
	input,
) => {
	const pageId = resolvePageId(input.page_id, input.comment_id);
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['deleteComment']
	>(`/${input.comment_id}`, ctx, pageId, {
		method: 'DELETE',
	});

	if (result.success) {
		try {
			await ctx.db.comments.deleteByEntityId(input.comment_id);
		} catch {
			// Non-fatal cache write
		}
	}

	await logFacebookEvent(ctx, 'facebook.comments.delete', { ...input });
	return result;
};
