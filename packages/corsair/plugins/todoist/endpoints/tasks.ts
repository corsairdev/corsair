import { logEventFromContext } from '../../utils/events';
import type { TodoistEndpoints } from '..';
import { makeTodoistRequest } from '../client';
import type { TodoistEndpointOutputs } from './types';

export const close: TodoistEndpoints['tasksClose'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksClose']>(
		`tasks/${input.id}/close`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	await logEventFromContext(
		ctx,
		'todoist.tasks.close',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: TodoistEndpoints['tasksCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['tasksCreate']
	>('tasks', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (ctx.db.tasks) {
		await ctx.db.tasks.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteTask: TodoistEndpoints['tasksDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['tasksDelete']
	>(`tasks/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db.tasks) {
		await ctx.db.tasks.deleteByEntityId(input.id);
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: TodoistEndpoints['tasksGet'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksGet']>(
		`tasks/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (ctx.db.tasks) {
		await ctx.db.tasks.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getMany: TodoistEndpoints['tasksGetMany'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['tasksGetMany']
	>('tasks', ctx.key, {
		method: 'GET',
		query: {
			...input,
			ids: input.ids ? input.ids.join(',') : undefined,
		},
	});

	if (Array.isArray(result) && ctx.db.tasks) {
		for (const task of result) {
			await ctx.db.tasks.upsertByEntityId(task.id, {
				...task,
			});
		}
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.getMany',
		{ ...input },
		'completed',
	);
	return result;
};

export const move: TodoistEndpoints['tasksMove'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksMove']>(
		`tasks/${input.id}`,
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (ctx.db.tasks) {
		await ctx.db.tasks.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.move',
		{ ...input },
		'completed',
	);
	return result;
};

export const quickAdd: TodoistEndpoints['tasksQuickAdd'] = async (
	ctx,
	input,
) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['tasksQuickAdd']
	>('quick/add', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (ctx.db.tasks) {
		await ctx.db.tasks.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.quickAdd',
		{ ...input },
		'completed',
	);
	return result;
};

export const reopen: TodoistEndpoints['tasksReopen'] = async (ctx, input) => {
	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['tasksReopen']
	>(`tasks/${input.id}/reopen`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'todoist.tasks.reopen',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: TodoistEndpoints['tasksUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<
		TodoistEndpointOutputs['tasksUpdate']
	>(`tasks/${id}`, ctx.key, {
		method: 'POST',
		body: updates,
	});

	if (ctx.db.tasks) {
		await ctx.db.tasks.upsertByEntityId(result.id, {
			...result,
		});
	}

	await logEventFromContext(
		ctx,
		'todoist.tasks.update',
		{ ...input },
		'completed',
	);
	return result;
};
