import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import { syncEntityDetail, syncListDiscovery } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

export const getUser: TurbotPipesEndpoints['getUser'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUser']
	>(`user/${pathSegment(input.user_handle)}`, ctx.key, { method: 'GET' });
	// Awaited: a completed fetch guarantees its record is searchable locally.
	await syncEntityDetail(ctx, 'user', response.id, response);
	await logEventFromContext(
		ctx,
		'turbotpipes.users.get',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const updateUser: TurbotPipesEndpoints['updateUser'] = async (
	ctx,
	input,
) => {
	const { user_handle, ...body } = input;
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['updateUser']
	>(`user/${pathSegment(user_handle)}`, ctx.key, { method: 'PATCH', body });
	// Keep local search in step with the change (getUser stored the old copy).
	if (typeof response.id === 'string') {
		await syncEntityDetail(ctx, 'user', response.id, response);
	}
	await logEventFromContext(
		ctx,
		'turbotpipes.users.update',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const listUserWorkspaces: TurbotPipesEndpoints['listUserWorkspaces'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaces']
		>(`user/${pathSegment(input.user_handle)}/workspace`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token']),
		});
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'workspace', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_workspaces',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspace: TurbotPipesEndpoints['getUserWorkspace'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspace']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		// Awaited: a completed fetch guarantees its record is searchable locally.
		await syncEntityDetail(ctx, 'workspace', response.id, response);
		await logEventFromContext(
			ctx,
			'turbotpipes.users.get_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const updateUserWorkspace: TurbotPipesEndpoints['updateUserWorkspace'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserWorkspace']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}`,
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		);
		if (typeof response.id === 'string') {
			await syncEntityDetail(ctx, 'workspace', response.id, response);
		}
		await logEventFromContext(
			ctx,
			'turbotpipes.users.update_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const runUserWorkspaceCommand: TurbotPipesEndpoints['runUserWorkspaceCommand'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runUserWorkspaceCommand']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/command`,
			ctx.key,
			{
				method: 'POST',
				body: { command },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.users.run_workspace_command',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserProcesses: TurbotPipesEndpoints['listUserProcesses'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserProcesses']
		>(`user/${pathSegment(input.user_handle)}/process`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token']),
		});
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'process', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_processes',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserProcess: TurbotPipesEndpoints['getUserProcess'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUserProcess']
	>(
		`user/${pathSegment(input.user_handle)}/process/${pathSegment(input.process_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	// Awaited: a completed fetch guarantees its record is searchable locally.
	await syncEntityDetail(ctx, 'process', response.id, response);
	await logEventFromContext(
		ctx,
		'turbotpipes.users.get_process',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const listUserUsage: TurbotPipesEndpoints['listUserUsage'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['listUserUsage']
	>(`user/${pathSegment(input.user_handle)}/usage`, ctx.key, {
		method: 'GET',
		query: pickQuery(input, ['where', 'limit', 'next_token']),
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.users.list_usage',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const listUserConstraints: TurbotPipesEndpoints['listUserConstraints'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserConstraints']
		>(`user/${pathSegment(input.user_handle)}/constraint`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['where', 'limit', 'next_token']),
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_constraints',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserAuditLogs: TurbotPipesEndpoints['listUserAuditLogs'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserAuditLogs']
		>(`user/${pathSegment(input.user_handle)}/audit_log`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token']),
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_audit_logs',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserEmail: TurbotPipesEndpoints['getUserEmail'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUserEmail']
	>(
		`user/${pathSegment(input.user_handle)}/email/${pathSegment(input.email_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.users.get_email',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const listUserEmails: TurbotPipesEndpoints['listUserEmails'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['listUserEmails']
	>(`user/${pathSegment(input.user_handle)}/email`, ctx.key, {
		method: 'GET',
		query: pickQuery(input, ['limit', 'next_token']),
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.users.list_emails',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const getUserPreferences: TurbotPipesEndpoints['getUserPreferences'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserPreferences']
		>(`user/${pathSegment(input.user_handle)}/preferences`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.get_preferences',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const updateUserPreferences: TurbotPipesEndpoints['updateUserPreferences'] =
	async (ctx, input) => {
		const { user_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserPreferences']
		>(`user/${pathSegment(user_handle)}/preferences`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.update_preferences',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const deleteUserAvatar: TurbotPipesEndpoints['deleteUserAvatar'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserAvatar']
		>(`user/${pathSegment(input.user_handle)}/avatar`, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.delete_avatar',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
