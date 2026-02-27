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

	if (ctx.db.labels && result && (result as any).id) {
		await ctx.db.labels.upsertByEntityId((result as any).id, result as any);
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

	if (ctx.db.labels && input.id) {
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

	if (ctx.db.labels && result && (result as any).id) {
		await ctx.db.labels.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(ctx, 'todoist.labels.get', { ...input }, 'completed');
	return result;
};

export const getMany: TodoistEndpoints['labelsGetMany'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['labelsGetMany']
	>('labels', ctx.key, {
		method: 'GET',
	});

	if (ctx.db.labels) {
		const data: any = result;
		const items: any[] = Array.isArray(data) ? data : [];
		for (const label of items) {
			if (label && label.id) {
				await ctx.db.labels.upsertByEntityId(label.id, label);
			}
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

	if (ctx.db.labels && result && (result as any).id) {
		await ctx.db.labels.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(
		ctx,
		'todoist.labels.update',
		{ ...input },
		'completed',
	);
	return result;
};

