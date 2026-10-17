import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserNotifier: TurbotPipesEndpoints['createUserNotifier'] =
	async (ctx, input) => {
		const { user_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserNotifier']
		>(`user/${user_handle}/notifier`, ctx.key, { method: 'POST', body });
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.create_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserNotifiers: TurbotPipesEndpoints['listUserNotifiers'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserNotifiers']
		>(`user/${input.user_handle}/notifier`, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.list_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceNotifier: TurbotPipesEndpoints['getOrgWorkspaceNotifier'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceNotifier']
		>(
			`org/${input.org_handle}/workspace/${input.workspace_handle}/notifier/${input.notifier_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.get_org_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createUserWorkspaceNotifier: TurbotPipesEndpoints['createUserWorkspaceNotifier'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceNotifier']
		>(`user/${user_handle}/workspace/${workspace_handle}/notifier`, ctx.key, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.create_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteUserWorkspaceNotifier: TurbotPipesEndpoints['deleteUserWorkspaceNotifier'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserWorkspaceNotifier']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/notifier/${input.notifier_handle}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.delete_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceNotifier: TurbotPipesEndpoints['getUserWorkspaceNotifier'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceNotifier']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/notifier/${input.notifier_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.get_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceNotifiers: TurbotPipesEndpoints['listUserWorkspaceNotifiers'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceNotifiers']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/notifier`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.list_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const postUserWorkspaceNotifierCommand: TurbotPipesEndpoints['postUserWorkspaceNotifierCommand'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, notifier_handle, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['postUserWorkspaceNotifierCommand']
		>(
			`user/${user_handle}/workspace/${workspace_handle}/notifier/${notifier_handle}/command`,
			ctx.key,
			{ method: 'POST', body: { command } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.post_command',
			{ ...input },
			'completed',
		);
		return response;
	};
