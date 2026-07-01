import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const list: InstagramEndpoints['GetComments'] = async (ctx, input) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetComments']
	>(`/${input.media_id}/comments`, ctx, {
		method: 'GET',
		query: {
			fields: input.q,
		},
	});

	if (result.data) {
		try {
			for (const cm of result.data) {
				await ctx.db.comments.upsertByEntityId(cm.id, {
					...cm,
				});
			}
		} catch (err) {
			console.warn('faild to save comments into database', err);
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.comments.list',
		{ ...input },
		'completed',
	);

	return result;
};

export const reply: InstagramEndpoints['ReplyComments'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['ReplyComments']
	>(`/${input.comment_id}/replies`, ctx, {
		method: 'POST',
		body: {
			message: input.message,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.comments.reply',
		{ ...input },
		'completed',
	);

	return result;
};

export const send: InstagramEndpoints['SendComments'] = async (ctx, input) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['SendComments']
	>(`/${input.media_id}/comments`, ctx, {
		method: 'POST',
		body: {
			message: input.message,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.comments.send',
		{ ...input },
		'completed',
	);

	return result;
};

export const get: InstagramEndpoints['GetCommentsDetails'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetCommentsDetails']
	>(`/${input.comment_id}`, ctx, {
		method: 'GET',
		query: {
			fields: input.q,
		},
	});

	if (result.id) {
		try {
			await ctx.db.comments.upsertByEntityId(result.id, {
				id: result.id,
				text: result.text,
				timestamp: result.timestamp,
				username: result.username,
			});
		} catch (err) {
			console.warn('faild to save comments into database', err);
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.comments.getDetails',
		{ ...input },
		'completed',
	);

	return result;
};

export const update: InstagramEndpoints['UpdateComments'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['UpdateComments']
	>(`/${input.comment_id}`, ctx, {
		method: 'POST',
		body: {
			hide: input.hide,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.comments.update',
		{ ...input },
		'completed',
	);

	return result;
};

export const remove: InstagramEndpoints['DeleteComment'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['DeleteComment']
	>(`/${input.comment_id}`, ctx, {
		method: 'DELETE',
	});

	if (result.success) {
		await ctx.db.comments.deleteByEntityId(input.comment_id);
	}

	await logEventFromContext(
		ctx,
		'instagram.comments.delete',
		{ ...input },
		'completed',
	);

	return result;
};
