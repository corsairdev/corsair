import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserIntegration: TurbotPipesEndpoints['createUserIntegration'] =
	async (ctx, input) => {
		const { user_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserIntegration']
		>(`user/${user_handle}/integration`, ctx.key, { method: 'POST', body });
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.create_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteUserIntegration: TurbotPipesEndpoints['deleteUserIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserIntegration']
		>(
			`user/${input.user_handle}/integration/${input.integration_handle}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.delete_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserIntegration: TurbotPipesEndpoints['getUserIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserIntegration']
		>(
			`user/${input.user_handle}/integration/${input.integration_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserIntegrations: TurbotPipesEndpoints['listUserIntegrations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserIntegrations']
		>(`user/${input.user_handle}/integration`, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.list_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateUserIntegration: TurbotPipesEndpoints['updateUserIntegration'] =
	async (ctx, input) => {
		const { user_handle, integration_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserIntegration']
		>(`user/${user_handle}/integration/${integration_handle}`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.update_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testUserIntegration: TurbotPipesEndpoints['testUserIntegration'] =
	async (ctx, input) => {
		const { user_handle, integration_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['testUserIntegration']
		>(`user/${user_handle}/integration/${integration_handle}/test`, ctx.key, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.test_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceIntegration: TurbotPipesEndpoints['getOrgWorkspaceIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceIntegration']
		>(
			`org/${input.org_handle}/workspace/${input.workspace_handle}/integration/${input.integration_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_org_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgIntegration: TurbotPipesEndpoints['getOrgIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgIntegration']
		>(
			`org/${input.org_handle}/integration/${input.integration_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_org',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceIntegration: TurbotPipesEndpoints['getUserWorkspaceIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceIntegration']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/integration/${input.integration_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceIntegrations: TurbotPipesEndpoints['listUserWorkspaceIntegrations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceIntegrations']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/integration`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.list_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const installUserSlackIntegration: TurbotPipesEndpoints['installUserSlackIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['installUserSlackIntegration']
		>(
			`user/${input.user_handle}/integration/${input.integration_handle}/slack/install`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.install_user_slack',
			{ ...input },
			'completed',
		);
		return response;
	};
