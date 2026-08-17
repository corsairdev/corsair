import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

/**
 * Lists tasks in a workspace, or within one project when `project_id` is given.
 * Only the workspace-wide route paginates.
 */
export const list: TogglEndpoints['tasksList'] = async (ctx, input) => {
	// Project-scoped reads return a bare array; the workspace-wide route wraps
	// the same records in a paginated envelope.
	const projectScoped = input.project_id !== undefined;
	const path = projectScoped
		? `workspaces/${input.workspace_id}/projects/${input.project_id}/tasks`
		: `workspaces/${input.workspace_id}/tasks`;

	const result = await makeTogglRequest<
		| TogglEndpointOutputs['tasksList']
		| { data?: TogglEndpointOutputs['tasksList'] | null }
		| null
	>(path, ctx.key, {
		method: 'GET',
		// Only the workspace-wide route paginates; the project-scoped one
		// documents `active` alone, so sending page params there would imply a
		// narrowing the API does not apply.
		query: projectScoped
			? { active: input.active }
			: {
					active: input.active,
					page: input.page,
					per_page: input.per_page,
				},
	});

	const tasks = Array.isArray(result) ? result : (result?.data ?? []);

	await logEventFromContext(
		ctx,
		'toggl.tasks.list',
		auditPayload(input, [
			'workspace_id',
			'project_id',
			'active',
			'page',
			'per_page',
		]),
		'completed',
	);
	return tasks;
};

/** Reads a single task within a project. */
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

/** Creates a task under a project. */
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

/** Updates a task's name, active state or estimate. */
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

/** Deletes a task. */
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
