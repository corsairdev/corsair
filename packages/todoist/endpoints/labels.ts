import { logEventFromContext } from 'corsair/core';
import type { TodoistEndpoints } from '..';
import { makeTodoistRequest } from '../client';
import type { TodoistEndpointOutputs } from './types';

export const create: TodoistEndpoints['labelsCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsCreate']
	>('labels', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (ctx.db.labels) {
		await ctx.db.labels.upsertByEntityId(result.id, {
			...result,
		});
	}

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

	if (ctx.db.labels) {
		await ctx.db.labels.deleteByEntityId(input.id);
	}

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

	if (ctx.db.labels) {
		await ctx.db.labels.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.labels.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: TodoistEndpoints['labelsGetMany'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsGetMany']
	>('labels', ctx.key, {
		method: 'GET',
	});

	if (Array.isArray(result) && ctx.db.labels) {
		for (const label of result) {
			await ctx.db.labels.upsertByEntityId(label.id, {
				...label,
			});
		}
	}

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

	if (ctx.db.labels) {
		await ctx.db.labels.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.labels.update',
		{ ...input },
		'completed',
	);
	return result;
};
