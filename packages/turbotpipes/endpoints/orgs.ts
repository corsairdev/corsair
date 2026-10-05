import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { syncListItems } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

export const getOrg: TurbotPipesEndpoints['getOrg'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getOrg']
	>(`org/${input.org_handle}`, ctx.key, { method: 'GET' });
	if (response && response.id && ctx.db?.org) {
		try {
			await ctx.db?.org.upsertByEntityId(response.id, { ...response });
		} catch (error) {
			console.warn('Failed to save org to database:', error);
		}
	}
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const deleteOrg: TurbotPipesEndpoints['deleteOrg'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['deleteOrg']
	>(`org/${input.org_handle}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const listOrgWorkspaces: TurbotPipesEndpoints['listOrgWorkspaces'] =
	async (ctx, input) => {
		const { org_handle, ...query } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaces']
		>(`org/${org_handle}/workspace`, ctx.key, { method: 'GET', query });
		await syncListItems(ctx.db?.workspace, response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.list_workspaces',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteOrgWorkspace: TurbotPipesEndpoints['deleteOrgWorkspace'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteOrgWorkspace']
		>(`org/${input.org_handle}/workspace/${input.workspace_handle}`, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.delete_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const runOrgWorkspaceCommand: TurbotPipesEndpoints['runOrgWorkspaceCommand'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runOrgWorkspaceCommand']
		>(`org/${org_handle}/workspace/${workspace_handle}/command`, ctx.key, {
			method: 'POST',
			body: { command },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.run_workspace_command',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listOrgProcesses: TurbotPipesEndpoints['listOrgProcesses'] =
	async (ctx, input) => {
		const { org_handle, ...query } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgProcesses']
		>(`org/${org_handle}/process`, ctx.key, { method: 'GET', query });
		await syncListItems(ctx.db?.process, response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.list_processes',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listOrgServiceAccounts: TurbotPipesEndpoints['listOrgServiceAccounts'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgServiceAccounts']
		>(`org/${input.org_handle}/service_account`, ctx.key, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.list_service_accounts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateOrgServiceAccount: TurbotPipesEndpoints['updateOrgServiceAccount'] =
	async (ctx, input) => {
		const { org_handle, service_account_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgServiceAccount']
		>(`org/${org_handle}/service_account/${service_account_handle}`, ctx.key, {
			method: 'PATCH',
			body,
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.update_service_account',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateOrgServiceAccountToken: TurbotPipesEndpoints['updateOrgServiceAccountToken'] =
	async (ctx, input) => {
		const { org_handle, service_account_handle, token_id, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgServiceAccountToken']
		>(
			`org/${org_handle}/service_account/${service_account_handle}/token/${token_id}`,
			ctx.key,
			{ method: 'PATCH', body },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.update_service_account_token',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgMember: TurbotPipesEndpoints['getOrgMember'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getOrgMember']
	>(`org/${input.org_handle}/member/${input.user_handle}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.get_member',
		{ ...input },
		'completed',
	);
	return response;
};

export const updateOrgMemberRole: TurbotPipesEndpoints['updateOrgMemberRole'] =
	async (ctx, input) => {
		const { org_handle, user_handle, role } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgMemberRole']
		>(`org/${org_handle}/member/${user_handle}`, ctx.key, {
			method: 'PATCH',
			body: { role },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.update_member_role',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listOrgUsage: TurbotPipesEndpoints['listOrgUsage'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['listOrgUsage']
	>(`org/${input.org_handle}/usage`, ctx.key, { method: 'GET' });
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.list_usage',
		{ ...input },
		'completed',
	);
	return response;
};
