import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const installUserWorkspaceMod: TurbotPipesEndpoints['installUserWorkspaceMod'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, path } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['installUserWorkspaceMod']
		>(`user/${user_handle}/workspace/${workspace_handle}/mod`, ctx.key, {
			method: 'POST',
			body: { path },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.install_user_mod',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceMod: TurbotPipesEndpoints['getUserWorkspaceMod'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceMod']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/mod/${input.mod_alias}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.get_user_mod',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceMods: TurbotPipesEndpoints['listUserWorkspaceMods'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceMods']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/mod`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.list_user_mods',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listOrgWorkspaceMods: TurbotPipesEndpoints['listOrgWorkspaceMods'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaceMods']
		>(
			`org/${input.org_handle}/workspace/${input.workspace_handle}/mod`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.list_org_mods',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createUserWorkspaceModVariableSetting: TurbotPipesEndpoints['createUserWorkspaceModVariableSetting'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, mod_alias, variable_name, value } =
			input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceModVariableSetting']
		>(
			`user/${user_handle}/workspace/${workspace_handle}/mod/${mod_alias}/variable`,
			ctx.key,
			{ method: 'POST', body: { name: variable_name, setting: value } },
		);
		await logEventFromContext(
			ctx,
			// Log only identifiers; variable values may carry secrets.
			'turbotpipes.mods.create_user_var_setting',
			{ user_handle, workspace_handle, mod_alias, variable_name },
			'completed',
		);
		return response;
	};

export const deleteUserWorkspaceModVariableSetting: TurbotPipesEndpoints['deleteUserWorkspaceModVariableSetting'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, mod_alias, variable_name } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteUserWorkspaceModVariableSetting']
		>(
			`user/${user_handle}/workspace/${workspace_handle}/mod/${mod_alias}/variable/${variable_name}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.delete_user_var_setting',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceModVariableSetting: TurbotPipesEndpoints['getUserWorkspaceModVariableSetting'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, mod_alias, variable_name } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceModVariableSetting']
		>(
			`user/${user_handle}/workspace/${workspace_handle}/mod/${mod_alias}/variable/${variable_name}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.get_user_var_setting',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceModVariables: TurbotPipesEndpoints['listUserWorkspaceModVariables'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, mod_alias } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceModVariables']
		>(
			`user/${user_handle}/workspace/${workspace_handle}/mod/${mod_alias}/variable`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.list_user_mod_vars',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceModVariableSetting: TurbotPipesEndpoints['getOrgWorkspaceModVariableSetting'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, mod_alias, variable_name } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceModVariableSetting']
		>(
			`org/${org_handle}/workspace/${workspace_handle}/mod/${mod_alias}/variable/${variable_name}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.get_org_var_setting',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteOrgWorkspaceModVariableSetting: TurbotPipesEndpoints['deleteOrgWorkspaceModVariableSetting'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, mod_alias, variable_name } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteOrgWorkspaceModVariableSetting']
		>(
			`org/${org_handle}/workspace/${workspace_handle}/mod/${mod_alias}/variable/${variable_name}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.mods.delete_org_var_setting',
			{ ...input },
			'completed',
		);
		return response;
	};
