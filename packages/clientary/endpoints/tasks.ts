import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import { cacheRecord, cacheRecords, evictEntity } from './persist';
import type { ClientaryTask } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryTaskSchema,
} from './types';

/**
 * List all tasks.
 *
 * API: GET /api/v2/tasks
 * Docs: https://www.clientary.com/api/tasks
 */
export const list: ClientaryEndpoints['tasksList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.tasksList>
	>('tasks', apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.tasksList.parse(response);

	await cacheRecords(ctx.db.tasks, parsed.tasks, 'task');

	await logEventFromContext(
		ctx,
		'clientary.tasks.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List tasks belonging to a single project.
 *
 * API: GET /api/v2/projects/:project_id/tasks
 * Docs: https://www.clientary.com/api/tasks
 */
export const listForProject: ClientaryEndpoints['tasksListForProject'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.tasksListForProject>
	>(`projects/${input.project_id}/tasks`, apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	const parsed =
		ClientaryEndpointOutputSchemas.tasksListForProject.parse(response);

	await cacheRecords(ctx.db.tasks, parsed.tasks, 'task');

	await logEventFromContext(
		ctx,
		'clientary.tasks.listForProject',
		{ project_id: input.project_id },
		'completed',
	);
	return parsed;
};

/**
 * Get a single task by ID.
 *
 * API: GET /api/v2/tasks/:id
 * Docs: https://www.clientary.com/api/tasks
 */
export const get: ClientaryEndpoints['tasksGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryTask>(
		`tasks/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryTaskSchema.parse(response);

	await cacheRecord(ctx.db.tasks, parsed, 'task');

	await logEventFromContext(
		ctx,
		'clientary.tasks.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new task. `title` is required.
 *
 * API: POST /api/v2/task
 * Docs: https://www.clientary.com/api/tasks
 */
export const create: ClientaryEndpoints['tasksCreate'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryTask>(
		'task',
		apiKey,
		domain,
		{ method: 'POST', body: { task: { ...input } } },
	);

	const parsed = ClientaryTaskSchema.parse(response);

	await cacheRecord(ctx.db.tasks, parsed, 'task');

	await logEventFromContext(
		ctx,
		'clientary.tasks.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing task. Include `complete: true` to mark it done.
 *
 * API: PUT /api/v2/tasks/:id
 * Docs: https://www.clientary.com/api/tasks
 */
export const update: ClientaryEndpoints['tasksUpdate'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryTask>(
		`tasks/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { task: { ...fields } } },
	);

	const parsed = ClientaryTaskSchema.parse(response);

	await cacheRecord(ctx.db.tasks, parsed, 'task');

	await logEventFromContext(ctx, 'clientary.tasks.update', { id }, 'completed');
	return parsed;
};

/**
 * Delete a task.
 *
 * API: DELETE /api/v2/tasks/:id
 * Docs: https://www.clientary.com/api/tasks
 */
export const remove: ClientaryEndpoints['tasksDelete'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	await makeClientaryRequest<unknown>(`tasks/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.tasks, input.id, 'task');

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.tasks.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
