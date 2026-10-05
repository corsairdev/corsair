import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserConnection: TurbotPipesEndpoints['createUserConnection'] =
	async (ctx, input) => {
		const { user_handle, handle } = input;
		const { plugin, config, ..._rest } = input;
		void _rest;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserConnection']
		>(`user/${user_handle}/connection`, ctx.key, {
			method: 'POST',
			body: { handle, plugin, config },
		});
		// Log only identifiers; connection config may carry credentials.
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.create_user',
			{ user_handle, handle },
			'completed',
		);
		return response;
	};

export const getUserConnection: TurbotPipesEndpoints['getUserConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserConnection']
		>(
			`user/${input.user_handle}/connection/${input.connection_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		if (response && response.id && ctx.db?.connection) {
			try {
				await ctx.db?.connection.upsertByEntityId(response.id, { ...response });
			} catch (error) {
				console.warn('Failed to save connection to database:', error);
			}
		}
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.get_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserConnections: TurbotPipesEndpoints['listUserConnections'] =
	async (ctx, input) => {
		const { user_handle, ...query } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserConnections']
		>(`user/${user_handle}/connection`, ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.list_user',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateUserConnection: TurbotPipesEndpoints['updateUserConnection'] =
	async (ctx, input) => {
		const { user_handle, connection_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateUserConnection']
		>(`user/${user_handle}/connection/${connection_handle}`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			// Log only identifiers; connection config may carry credentials.
			'turbotpipes.connections.update_user',
			{ user_handle, connection_handle },
			'completed',
		);
		return response;
	};

export const deleteUserConnectionDeprecated: TurbotPipesEndpoints['deleteUserConnectionDeprecated'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserConnectionDeprecated']
		>(
			`user/${input.user_handle}/connection/${input.connection_handle}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.delete_user_deprecated',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testUserConnection: TurbotPipesEndpoints['testUserConnection'] =
	async (ctx, input) => {
		const { user_handle, connection_handle, ...body } = input;
		const handle = connection_handle ?? '_';
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['testUserConnection']
		>(`user/${user_handle}/connection/${handle}/test`, ctx.key, {
			method: 'POST',
			body,
		});
		await logEventFromContext(
			ctx,
			// Log only identifiers; connection config may carry credentials.
			'turbotpipes.connections.test_user',
			{ user_handle, connection_handle },
			'completed',
		);
		return response;
	};

export const createOrgConnection: TurbotPipesEndpoints['createOrgConnection'] =
	async (ctx, input) => {
		const { org_handle, handle } = input;
		const { plugin, config, ..._orgRest } = input;
		void _orgRest;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgConnection']
		>(`org/${org_handle}/connection`, ctx.key, {
			method: 'POST',
			body: { handle, plugin, config },
		});
		// Log only identifiers; connection config may carry credentials.
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.create_org',
			{ org_handle, handle },
			'completed',
		);
		return response;
	};

export const updateOrgConnection: TurbotPipesEndpoints['updateOrgConnection'] =
	async (ctx, input) => {
		const { org_handle, connection_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgConnection']
		>(`org/${org_handle}/connection/${connection_handle}`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			// Log only identifiers; connection config may carry credentials.
			'turbotpipes.connections.update_org',
			{ org_handle, connection_handle },
			'completed',
		);
		return response;
	};

export const getOrgConnectionPermission: TurbotPipesEndpoints['getOrgConnectionPermission'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgConnectionPermission']
		>(
			`org/${input.org_handle}/connection/${input.connection_handle}/permission`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.get_org_permission',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteOrgConnectionPermission: TurbotPipesEndpoints['deleteOrgConnectionPermission'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteOrgConnectionPermission']
		>(
			`org/${input.org_handle}/connection/${input.connection_handle}/permission`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.delete_org_permission',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createOrgConnectionFolder: TurbotPipesEndpoints['createOrgConnectionFolder'] =
	async (ctx, input) => {
		const { org_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgConnectionFolder']
		>(`org/${org_handle}/connection_folder`, ctx.key, { method: 'POST', body });
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.create_org_folder',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateOrgConnectionFolder: TurbotPipesEndpoints['updateOrgConnectionFolder'] =
	async (ctx, input) => {
		const { org_handle, folder_id, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgConnectionFolder']
		>(`org/${org_handle}/connection_folder/${folder_id}`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.connections.update_org_folder',
			{ ...input },
			'completed',
		);
		return response;
	};
