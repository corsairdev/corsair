import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheWorkspace } from './persist';
import type { TogglEndpointOutputs } from './types';

/** Lists the workspaces the caller belongs to and caches each one. */
export const list: TogglEndpoints['workspacesList'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['workspacesList']>(
		'workspaces',
		ctx.key,
		{
			method: 'GET',
			query: { since: input.since },
		},
	);

	const workspaces = result ?? [];

	for (const workspace of workspaces) {
		await cacheWorkspace(ctx.db.workspaces, workspace);
	}

	await logEventFromContext(
		ctx,
		'toggl.workspaces.list',
		auditPayload(input, ['since']),
		'completed',
	);
	return workspaces;
};

/** Reads a single workspace and refreshes its cached copy. */
export const get: TogglEndpoints['workspacesGet'] = async (ctx, input) => {
	const result = await makeTogglRequest<TogglEndpointOutputs['workspacesGet']>(
		`workspaces/${input.workspace_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await cacheWorkspace(ctx.db.workspaces, result);

	await logEventFromContext(
		ctx,
		'toggl.workspaces.get',
		auditPayload(input, ['workspace_id']),
		'completed',
	);
	return result;
};

/** Updates a workspace's name and default project, billing or rounding settings. */
export const update: TogglEndpoints['workspacesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['workspacesUpdate']
	>(`workspaces/${input.workspace_id}`, ctx.key, {
		method: 'PUT',
		body: {
			name: input.name,
			default_currency: input.default_currency,
			default_hourly_rate: input.default_hourly_rate,
			only_admins_may_create_projects: input.only_admins_may_create_projects,
			only_admins_may_create_tags: input.only_admins_may_create_tags,
		},
	});

	await cacheWorkspace(ctx.db.workspaces, result);

	await logEventFromContext(
		ctx,
		'toggl.workspaces.update',
		auditPayload(input, [
			'workspace_id',
			'default_currency',
			'default_hourly_rate',
			'only_admins_may_create_projects',
			'only_admins_may_create_tags',
		]),
		'completed',
	);
	return result;
};

/** Lists a workspace's members with their role and activity state. */
export const getUsers: TogglEndpoints['workspacesGetUsers'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['workspacesGetUsers']
	>(`workspaces/${input.workspace_id}/users`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.workspaces.getUsers',
		auditPayload(input, ['workspace_id']),
		'completed',
	);
	return result ?? [];
};

/** Reads the logo associated with a workspace. */
export const getLogo: TogglEndpoints['workspacesGetLogo'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['workspacesGetLogo']
	>(`workspaces/${input.workspace_id}/logo`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'toggl.workspaces.getLogo',
		auditPayload(input, ['workspace_id']),
		'completed',
	);
	return result;
};

export const getPreferences: TogglEndpoints['workspacesGetPreferences'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['workspacesGetPreferences']
		>(`workspaces/${input.workspace_id}/preferences`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'toggl.workspaces.getPreferences',
			auditPayload(input, ['workspace_id']),
			'completed',
		);
		return result;
	};
