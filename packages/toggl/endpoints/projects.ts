import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheProject, evictEntity } from './persist';
import type { TogglEndpointOutputs } from './types';

/** Lists a workspace's projects and mirrors each into the cache. */
export const list: TogglEndpoints['projectsList'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['projectsList']>(
		`workspaces/${input.workspace_id}/projects`,
		ctx.key,
		{
			method: 'GET',
			query: {
				active: input.active,
				name: input.name,
				page: input.page,
				per_page: input.per_page,
			},
		},
	);

	const projects = result ?? [];

	for (const project of projects) {
		await cacheProject(ctx.db.projects, project);
	}

	await logEventFromContext(
		ctx,
		'toggl.projects.list',
		auditPayload(input, ['workspace_id', 'active', 'page', 'per_page']),
		'completed',
	);
	return projects;
};

/** Reads a single project and refreshes its cached copy. */
export const get: TogglEndpoints['projectsGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['projectsGet']>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await cacheProject(ctx.db.projects, result);

	await logEventFromContext(
		ctx,
		'toggl.projects.get',
		auditPayload(input, ['workspace_id', 'project_id']),
		'completed',
	);
	return result;
};

/**
 * Creates a project in a workspace. Colours, templates and rates are
 * accepted but only honoured on paid Toggl plans.
 */
export const create: TogglEndpoints['projectsCreate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['projectsCreate']>(
		`workspaces/${input.workspace_id}/projects`,
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				client_id: input.client_id,
				active: input.active,
				is_private: input.is_private,
				billable: input.billable,
				color: input.color,
				start_date: input.start_date,
				end_date: input.end_date,
				estimated_hours: input.estimated_hours,
			},
		},
	);

	await cacheProject(ctx.db.projects, result);

	await logEventFromContext(
		ctx,
		'toggl.projects.create',
		auditPayload(input, [
			'workspace_id',
			'client_id',
			'active',
			'is_private',
			'billable',
		]),
		'completed',
	);
	return result;
};

/** Updates a project's name, client, visibility, billing or estimate. */
export const update: TogglEndpoints['projectsUpdate'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['projectsUpdate']>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				name: input.name,
				client_id: input.client_id,
				active: input.active,
				is_private: input.is_private,
				billable: input.billable,
				color: input.color,
			},
		},
	);

	await cacheProject(ctx.db.projects, result);

	await logEventFromContext(
		ctx,
		'toggl.projects.update',
		auditPayload(input, [
			'workspace_id',
			'project_id',
			'client_id',
			'active',
			'is_private',
			'billable',
		]),
		'completed',
	);
	return result;
};

/** Deletes a project and evicts it from the cache. */
export const remove: TogglEndpoints['projectsDelete'] = async (ctx, input) => {
	await makeTogglRequest<unknown>(
		`workspaces/${input.workspace_id}/projects/${input.project_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await evictEntity(ctx.db.projects, input.project_id, 'project');

	await logEventFromContext(
		ctx,
		'toggl.projects.delete',
		auditPayload(input, ['workspace_id', 'project_id']),
		'completed',
	);
	return { deleted: true, id: input.project_id };
};

/** Assigns a user to a project, optionally as a manager and with a rate. */
export const addUser: TogglEndpoints['projectsAddUser'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['projectsAddUser']
	>(`workspaces/${input.workspace_id}/project_users`, ctx.key, {
		method: 'POST',
		body: {
			project_id: input.project_id,
			user_id: input.user_id,
			manager: input.manager,
			rate: input.rate,
			labour_cost: input.labour_cost,
		},
	});

	await logEventFromContext(
		ctx,
		'toggl.projects.addUser',
		auditPayload(input, ['workspace_id', 'project_id', 'user_id', 'manager']),
		'completed',
	);
	return result;
};

/** Removes a project group from a workspace. */
export const deleteGroup: TogglEndpoints['projectsDeleteGroup'] = async (
	ctx,
	input,
) => {
	await makeTogglRequest<unknown>(
		`workspaces/${input.workspace_id}/project_groups/${input.project_group_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'toggl.projects.deleteGroup',
		auditPayload(input, ['workspace_id', 'project_group_id']),
		'completed',
	);
	return { deleted: true, id: input.project_group_id };
};
