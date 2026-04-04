import { logEventFromContext } from 'corsair/core';
import type { TodoistEndpoints } from '..';
import { makeTodoistRequest } from '../client';
import type { TodoistEndpointOutputs } from './types';

export const create: TodoistEndpoints['commentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsCreate']
	>('comments', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (ctx.db.comments) {
		await ctx.db.comments.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteComment: TodoistEndpoints['commentsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsDelete']
	>(`comments/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.comments) {
		await ctx.db.comments.deleteByEntityId(input.id);
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['commentsGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsGet']
	>(`comments/${input.id}`, ctx.key, {
		method: 'GET',
	});

	if (ctx.db.comments) {
		await ctx.db.comments.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: TodoistEndpoints['commentsGetMany'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsGetMany']
	>('comments', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (Array.isArray(result) && ctx.db.comments) {
		for (const comment of result) {
			await ctx.db.comments.upsertByEntityId(comment.id, {
				...comment,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['commentsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsUpdate']
	>(`comments/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.comments) {
		await ctx.db.comments.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.comments.update',
		{ ...input },
		'completed',
	);
	return result;
};
