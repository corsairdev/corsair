import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const create: TodoistEndpoints['labelsCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsCreate']
	>('labels', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			color: input.color,
			favorite: input.favorite,
			order: input.order,
		},
	});

	await logEventFromContext(
		ctx,
		'todoist.labels.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteLabel: TodoistEndpoints['labelsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsDelete']
	>(`labels/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'todoist.labels.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['labelsGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['labelsGet']>(
		`labels/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'todoist.labels.get', { ...input }, 'completed');
	return result;
};

export const getMany: TodoistEndpoints['labelsGetMany'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsGetMany']
	>('labels', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'todoist.labels.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['labelsUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsUpdate']
	>(`labels/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	await logEventFromContext(
		ctx,
		'todoist.labels.update',
		{ ...input },
		'completed',
	);
	return result;
};

