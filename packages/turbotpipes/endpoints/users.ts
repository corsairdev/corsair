import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { syncEntity } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

export const getUser: TurbotPipesEndpoints['getUser'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getUser']
	>(`user/${input.user_handle}`, ctx.key, { method: 'GET' });
	// Fire-and-forget: responses must not wait on local sync.
	syncEntity(ctx.db?.user, response.id, response);
	await logEventFromContext(
		ctx,
		'turbotpipes.users.get',
		{ ...input },
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
	>(`user/${user_handle}`, ctx.key, { method: 'PATCH', body });
	await logEventFromContext(
		ctx,
		'turbotpipes.users.update',
		{ ...input },
		'completed',
	);
	return response;
};

export const listUserWorkspaces: TurbotPipesEndpoints['listUserWorkspaces'] =
	async (ctx, input) => {
		const { user_handle, ...query } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaces']
		>(`user/${user_handle}/workspace`, ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_workspaces',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspace: TurbotPipesEndpoints['getUserWorkspace'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspace']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		// Fire-and-forget: responses must not wait on local sync.
		syncEntity(ctx.db?.workspace, response.id, response);
		await logEventFromContext(
			ctx,
			'turbotpipes.users.get_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateUserWorkspace: TurbotPipesEndpoints['updateUserWorkspace'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserWorkspace']
		>(`user/${user_handle}/workspace/${workspace_handle}`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.update_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const runUserWorkspaceCommand: TurbotPipesEndpoints['runUserWorkspaceCommand'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runUserWorkspaceCommand']
		>(`user/${user_handle}/workspace/${workspace_handle}/command`, ctx.key, {
			method: 'POST',
			body: { command },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.users.run_workspace_command',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserProcesses: TurbotPipesEndpoints['listUserProcesses'] =
	async (ctx, input) => {
		const { user_handle, ...query } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserProcesses']
		>(`user/${user_handle}/process`, ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_processes',
			{ ...input },
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
	>(`user/${input.user_handle}/process/${input.process_id}`, ctx.key, {
		method: 'GET',
	});
	// Fire-and-forget: responses must not wait on local sync.
	syncEntity(ctx.db?.process, response.id, response);
	await logEventFromContext(
		ctx,
		'turbotpipes.users.get_process',
		{ ...input },
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
	>(`user/${input.user_handle}/usage`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.users.list_usage',
		{ ...input },
		'completed',
	);
	return response;
};

export const listUserConstraints: TurbotPipesEndpoints['listUserConstraints'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserConstraints']
		>(`user/${input.user_handle}/constraint`, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_constraints',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserAuditLogs: TurbotPipesEndpoints['listUserAuditLogs'] =
	async (ctx, input) => {
		const { user_handle, ...query } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserAuditLogs']
		>(`user/${user_handle}/audit_log`, ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.list_audit_logs',
			{ ...input },
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
	>(`user/${input.user_handle}/email/${input.email_id}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.users.get_email',
		{ ...input },
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
	>(`user/${input.user_handle}/email`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.users.list_emails',
		{ ...input },
		'completed',
	);
	return response;
};

export const getUserPreferences: TurbotPipesEndpoints['getUserPreferences'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserPreferences']
		>(`user/${input.user_handle}/preferences`, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.get_preferences',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateUserPreferences: TurbotPipesEndpoints['updateUserPreferences'] =
	async (ctx, input) => {
		const { user_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserPreferences']
		>(`user/${user_handle}/preferences`, ctx.key, { method: 'PATCH', body });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.update_preferences',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteUserAvatar: TurbotPipesEndpoints['deleteUserAvatar'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserAvatar']
		>(`user/${input.user_handle}/avatar`, ctx.key, { method: 'DELETE' });
		await logEventFromContext(
			ctx,
			'turbotpipes.users.delete_avatar',
			{ ...input },
			'completed',
		);
		return response;
	};
