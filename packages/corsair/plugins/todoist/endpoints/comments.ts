import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const create: TodoistEndpoints['commentsCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsCreate']
	>('comments', ctx.key, {
		method: 'POST',
		body: {
			task_id: input.task_id,
			project_id: input.project_id,
			content: input.content,
		},
	});

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
		query: {
			task_id: input.task_id,
			project_id: input.project_id,
		},
	});

	await logEventFromContext(
		ctx,
		'todoist.comments.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['commentsUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['commentsUpdate']
	>(`comments/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	await logEventFromContext(
		ctx,
		'todoist.comments.update',
		{ ...input },
		'completed',
	);
	return result;
};

