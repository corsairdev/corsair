import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import { removeLocalEntity, syncEntityDetail, syncListDiscovery } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

export const getOrg: TurbotPipesEndpoints['getOrg'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['getOrg']
	>(`org/${pathSegment(input.org_handle)}`, ctx.key, { method: 'GET' });
	// Awaited: a completed fetch guarantees its record is searchable locally.
	await syncEntityDetail(ctx, 'org', response.id, response);
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.get',
		eventIdentifiers(input),
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
	>(`org/${pathSegment(input.org_handle)}`, ctx.key, { method: 'DELETE' });
	// Drop the local copy getOrg stored. Org handles are unique, so the handle
	// also finds it when a 204 delete returns no id.
	await removeLocalEntity(ctx, 'org', {
		id: response.id,
		handle: input.org_handle,
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.delete',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const listOrgWorkspaces: TurbotPipesEndpoints['listOrgWorkspaces'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaces']
		>(`org/${pathSegment(input.org_handle)}/workspace`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token']),
		});
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'workspace', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.list_workspaces',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const deleteOrgWorkspace: TurbotPipesEndpoints['deleteOrgWorkspace'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteOrgWorkspace']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		// Workspace handles repeat across orgs and users, so only the id from
		// the delete response identifies the local copy.
		await removeLocalEntity(ctx, 'workspace', { id: response.id });
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.delete_workspace',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const runOrgWorkspaceCommand: TurbotPipesEndpoints['runOrgWorkspaceCommand'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, command } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runOrgWorkspaceCommand']
		>(
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/command`,
			ctx.key,
			{
				method: 'POST',
				body: { command },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.run_workspace_command',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listOrgProcesses: TurbotPipesEndpoints['listOrgProcesses'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgProcesses']
		>(`org/${pathSegment(input.org_handle)}/process`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['where', 'limit', 'next_token']),
		});
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'process', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.list_processes',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listOrgServiceAccounts: TurbotPipesEndpoints['listOrgServiceAccounts'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgServiceAccounts']
		>(`org/${pathSegment(input.org_handle)}/service_account`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token', 'include']),
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.list_service_accounts',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const updateOrgServiceAccount: TurbotPipesEndpoints['updateOrgServiceAccount'] =
	async (ctx, input) => {
		const { org_handle, service_account_handle, ...body } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgServiceAccount']
		>(
			`org/${pathSegment(org_handle)}/service_account/${pathSegment(service_account_handle)}`,
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.update_service_account',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const updateOrgServiceAccountToken: TurbotPipesEndpoints['updateOrgServiceAccountToken'] =
	async (ctx, input) => {
		const {
			org_handle,
			service_account_handle,
			token_id,
			status,
			title,
			description,
		} = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgServiceAccountToken']
		>(
			`org/${pathSegment(org_handle)}/service_account/${pathSegment(service_account_handle)}/token/${pathSegment(token_id)}`,
			ctx.key,
			{ method: 'PATCH', body: { status, title, description } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.update_service_account_token',
			eventIdentifiers(input),
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
	>(
		`org/${pathSegment(input.org_handle)}/member/${pathSegment(input.user_handle)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.get_member',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};

export const updateOrgMemberRole: TurbotPipesEndpoints['updateOrgMemberRole'] =
	async (ctx, input) => {
		const { org_handle, user_handle, role } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgMemberRole']
		>(
			`org/${pathSegment(org_handle)}/member/${pathSegment(user_handle)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: { role },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.orgs.update_member_role',
			eventIdentifiers(input),
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
	>(`org/${pathSegment(input.org_handle)}/usage`, ctx.key, {
		method: 'GET',
		query: pickQuery(input, ['where', 'limit', 'next_token']),
	});
	await logEventFromContext(
		ctx,
		'turbotpipes.orgs.list_usage',
		eventIdentifiers(input),
		'completed',
	);
	return response;
};
