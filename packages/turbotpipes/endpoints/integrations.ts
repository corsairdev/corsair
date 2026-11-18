import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserIntegration: TurbotPipesEndpoints['createUserIntegration'] =
	async (ctx, input) => {
		const { user_handle, handle, type, config } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserIntegration']
		>(`user/${pathSegment(user_handle)}/integration`, ctx.key, {
			method: 'POST',
			body: { handle, type, config },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.create_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const deleteUserIntegration: TurbotPipesEndpoints['deleteUserIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserIntegration']
		>(
			`user/${pathSegment(input.user_handle)}/integration/${pathSegment(input.integration_handle)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.delete_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserIntegration: TurbotPipesEndpoints['getUserIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserIntegration']
		>(
			`user/${pathSegment(input.user_handle)}/integration/${pathSegment(input.integration_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserIntegrations: TurbotPipesEndpoints['listUserIntegrations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserIntegrations']
		>(`user/${pathSegment(input.user_handle)}/integration`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token']),
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.list_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const updateUserIntegration: TurbotPipesEndpoints['updateUserIntegration'] =
	async (ctx, input) => {
		const { user_handle, integration_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserIntegration']
		>(
			`user/${pathSegment(user_handle)}/integration/${pathSegment(integration_handle)}`,
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.update_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const testUserIntegration: TurbotPipesEndpoints['testUserIntegration'] =
	async (ctx, input) => {
		const { user_handle, integration_handle } = input;
		// The test route takes no body: Pipes tests the stored integration.
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['testUserIntegration']
		>(
			`user/${pathSegment(user_handle)}/integration/${pathSegment(integration_handle)}/test`,
			ctx.key,
			{ method: 'POST' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.test_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceIntegration: TurbotPipesEndpoints['getOrgWorkspaceIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceIntegration']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/integration/${pathSegment(input.integration_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_org_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getOrgIntegration: TurbotPipesEndpoints['getOrgIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgIntegration']
		>(
			`org/${pathSegment(input.org_handle)}/integration/${pathSegment(input.integration_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_org',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceIntegration: TurbotPipesEndpoints['getUserWorkspaceIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceIntegration']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/integration/${pathSegment(input.integration_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.get_user_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceIntegrations: TurbotPipesEndpoints['listUserWorkspaceIntegrations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceIntegrations']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/integration`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.list_user_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const installUserSlackIntegration: TurbotPipesEndpoints['installUserSlackIntegration'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['installUserSlackIntegration']
		>(
			`user/${pathSegment(input.user_handle)}/integration/${pathSegment(input.integration_handle)}/slack/install`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.integrations.install_user_slack',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
