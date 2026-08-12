import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheProject, evictEntity } from './persist';
import type { TogglEndpointOutputs } from './types';

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
