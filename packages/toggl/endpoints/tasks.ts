import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

export const list: TogglEndpoints['tasksList'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tasksList']>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}/tasks`,
		ctx.key,
		{ method: 'GET' },
	);

	const tasks = result ?? [];

	await logEventFromContext(
		ctx,
		'toggl.tasks.list',
		auditPayload(input, ['workspace_id', 'project_id']),
		'completed',
	);
	return tasks;
};

export const get: TogglEndpoints['tasksGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tasksGet']>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}/tasks/${input.task_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'toggl.tasks.get',
		auditPayload(input, ['workspace_id', 'project_id', 'task_id']),
		'completed',
	);
	return result;
};

export const create: TogglEndpoints['tasksCreate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tasksCreate']>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}/tasks`,
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				active: input.active,
				estimated_seconds: input.estimated_seconds,
				user_id: input.user_id,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'toggl.tasks.create',
		auditPayload(input, [
			'workspace_id',
			'project_id',
			'active',
			'estimated_seconds',
			'user_id',
		]),
		'completed',
	);
	return result;
};

export const update: TogglEndpoints['tasksUpdate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['tasksUpdate']>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}/tasks/${input.task_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				name: input.name,
				active: input.active,
				estimated_seconds: input.estimated_seconds,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'toggl.tasks.update',
		auditPayload(input, [
			'workspace_id',
			'project_id',
			'task_id',
			'active',
			'estimated_seconds',
		]),
		'completed',
	);
	return result;
};

export const remove: TogglEndpoints['tasksDelete'] = async (ctx, input) => {
	await makeTogglRequest<unknown>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}/tasks/${input.task_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'toggl.tasks.delete',
		auditPayload(input, ['workspace_id', 'project_id', 'task_id']),
		'completed',
	);
	return { deleted: true, id: input.task_id };
};

/**
 * Lists every task in a workspace rather than within one project. Toggl wraps
 * this response in a paginated envelope, unlike the project-scoped variant
 * which returns a bare array.
 */
export const listWorkspace: TogglEndpoints['tasksListWorkspace'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<{
		data?: TogglEndpointOutputs['tasksListWorkspace'] | null;
	}>(`workspaces/${input.workspace_id}/tasks`, ctx.key, {
		method: 'GET',
		query: {
			active: input.active,
			page: input.page,
			per_page: input.per_page,
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.tasks.listWorkspace',
		auditPayload(input, ['workspace_id', 'active', 'page', 'per_page']),
		'completed',
	);
	return result?.data ?? [];
};
