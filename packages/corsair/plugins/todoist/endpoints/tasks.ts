import type { TodoistEndpoints } from '..';
import type { TodoistEndpointOutputs } from './types';
import { logEventFromContext } from '../../utils/events';
import { makeTodoistRequest } from '../client';

export const close: TodoistEndpoints['tasksClose'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksClose']>(
		`tasks/${input.id}/close`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	if (ctx.db.tasks && input.id) {
		await ctx.db.tasks.upsertByEntityId(input.id, { id: input.id });
	}

	await logEventFromContext(ctx, 'todoist.tasks.close', { ...input }, 'completed');
	return result;
};

export const create: TodoistEndpoints['tasksCreate'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksCreate']>(
		'tasks',
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				description: input.description,
				project_id: input.project_id,
				section_id: input.section_id,
				parent_id: input.parent_id,
				order: input.order,
				labels: input.labels,
				priority: input.priority,
				due_datetime: input.due_datetime,
				due_date: input.due_date,
				due_string: input.due_string,
				assignee_id: input.assignee_id,
			},
		},
	);

	if (ctx.db.tasks && result && (result as any).id) {
		await ctx.db.tasks.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(ctx, 'todoist.tasks.create', { ...input }, 'completed');
	return result;
};

export const deleteTask: TodoistEndpoints['tasksDelete'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksDelete']>(
		`tasks/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.tasks && input.id) {
		await ctx.db.tasks.deleteByEntityId(input.id);
	}

	await logEventFromContext(ctx, 'todoist.tasks.delete', { ...input }, 'completed');
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

	if (ctx.db.tasks && result && (result as any).id) {
		await ctx.db.tasks.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(ctx, 'todoist.tasks.get', { ...input }, 'completed');
	return result;
};

export const getMany: TodoistEndpoints['tasksGetMany'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksGetMany']>(
		'tasks',
		ctx.key,
		{
			method: 'GET',
			query: {
				project_id: input.project_id,
				section_id: input.section_id,
				label: input.label,
				filter: input.filter,
				ids: input.ids ? input.ids.join(',') : undefined,
			},
		},
	);

	if (ctx.db.tasks) {
		const data: any = result;
		const items: any[] = Array.isArray(data)
			? data
			: Array.isArray(data?.tasks)
			? data.tasks
			: [];
		for (const task of items) {
			if (task && task.id) {
				await ctx.db.tasks.upsertByEntityId(task.id, task);
			}
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
			body: {
				project_id: input.project_id,
				section_id: input.section_id,
				parent_id: input.parent_id,
				order: input.order,
			},
		},
	);

	if (ctx.db.tasks && result && (result as any).id) {
		await ctx.db.tasks.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(ctx, 'todoist.tasks.move', { ...input }, 'completed');
	return result;
};

export const quickAdd: TodoistEndpoints['tasksQuickAdd'] = async (ctx, input) => {
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksQuickAdd']>(
		'quick/add',
		ctx.key,
		{
			method: 'POST',
			body: {
				text: input.text,
				reminder: input.reminder,
				note: input.note,
				lang: input.lang,
			},
		},
	);

	if (ctx.db.tasks && result && (result as any).id) {
		await ctx.db.tasks.upsertByEntityId((result as any).id, result as any);
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
	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksReopen']>(
		`tasks/${input.id}/reopen`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	if (ctx.db.tasks && input.id) {
		await ctx.db.tasks.upsertByEntityId(input.id, { id: input.id });
	}

	await logEventFromContext(ctx, 'todoist.tasks.reopen', { ...input }, 'completed');
	return result;
};

export const update: TodoistEndpoints['tasksUpdate'] = async (ctx, input) => {
	const { id, ...updates } = input;

	const result = await makeTodoistRequest<TodoistEndpointOutputs['tasksUpdate']>(
		`tasks/${id}`,
		ctx.key,
		{
			method: 'POST',
			body: updates,
		},
	);

	if (ctx.db.tasks && result && (result as any).id) {
		await ctx.db.tasks.upsertByEntityId((result as any).id, result as any);
	}

	await logEventFromContext(ctx, 'todoist.tasks.update', { ...input }, 'completed');
	return result;
};

