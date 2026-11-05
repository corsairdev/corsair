import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserNotifier: TurbotPipesEndpoints['createUserNotifier'] =
	async (ctx, input) => {
		const { user_handle, name, notifies, state } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserNotifier']
		>(`user/${pathSegment(user_handle)}/notifier`, ctx.key, {
			method: 'POST',
			body: { name, notifies, state },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.create_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserNotifiers: TurbotPipesEndpoints['listUserNotifiers'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserNotifiers']
		>(`user/${pathSegment(input.user_handle)}/notifier`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token', 'where']),
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.list_user',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceNotifier: TurbotPipesEndpoints['getOrgWorkspaceNotifier'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceNotifier']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/notifier/${pathSegment(input.notifier_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.get_org_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const createUserWorkspaceNotifier: TurbotPipesEndpoints['createUserWorkspaceNotifier'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, name, notifies, state } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceNotifier']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/notifier`,
			ctx.key,
			{
				method: 'POST',
				body: { name, notifies, state },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.create_user_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const deleteUserWorkspaceNotifier: TurbotPipesEndpoints['deleteUserWorkspaceNotifier'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserWorkspaceNotifier']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/notifier/${pathSegment(input.notifier_handle)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.delete_user_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceNotifier: TurbotPipesEndpoints['getUserWorkspaceNotifier'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceNotifier']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/notifier/${pathSegment(input.notifier_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.get_user_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceNotifiers: TurbotPipesEndpoints['listUserWorkspaceNotifiers'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceNotifiers']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/notifier`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['limit', 'next_token', 'where']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.list_user_workspace',
			eventIdentifiers(input),
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
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/notifier/${pathSegment(notifier_handle)}/command`,
			ctx.key,
			{ method: 'POST', body: { command } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.notifiers.post_command',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
