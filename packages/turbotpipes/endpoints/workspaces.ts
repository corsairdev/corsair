import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserWorkspaceConnection: TurbotPipesEndpoints['createUserWorkspaceConnection'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, connection_handle } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceConnection']
		>(`user/${user_handle}/workspace/${workspace_handle}/connection`, ctx.key, {
			method: 'POST',
			body: { connection_handle },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_user_connection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceConnection: TurbotPipesEndpoints['getUserWorkspaceConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceConnection']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/connection/${input.connection_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_connection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnections: TurbotPipesEndpoints['listUserWorkspaceConnections'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnections']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/connection`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connections',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnectionAssociations: TurbotPipesEndpoints['listUserWorkspaceConnectionAssociations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnectionAssociations']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/conn`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connection_associations',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnectionTree: TurbotPipesEndpoints['listUserWorkspaceConnectionTree'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnectionTree']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/connection_tree`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connection_tree',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testUserWorkspaceConnection: TurbotPipesEndpoints['testUserWorkspaceConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['testUserWorkspaceConnection']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/connection/${input.connection_handle}/test`,
			ctx.key,
			{ method: 'POST' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.test_user_connection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createUserWorkspaceConnectionFolder: TurbotPipesEndpoints['createUserWorkspaceConnectionFolder'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, title } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceConnectionFolder']
		>(
			`user/${user_handle}/workspace/${workspace_handle}/connection_folder`,
			ctx.key,
			{ method: 'POST', body: { title } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_user_connection_folder',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceConnectionFolder: TurbotPipesEndpoints['getUserWorkspaceConnectionFolder'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceConnectionFolder']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/connection_folder/${input.folder_id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_connection_folder',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnectionFolders: TurbotPipesEndpoints['listUserWorkspaceConnectionFolders'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnectionFolders']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/connection_folder`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connection_folders',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createOrgWorkspaceConnection: TurbotPipesEndpoints['createOrgWorkspaceConnection'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, connection_handle } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceConnection']
		>(`org/${org_handle}/workspace/${workspace_handle}/connection`, ctx.key, {
			method: 'POST',
			body: { connection_handle },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_org_connection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceConnection: TurbotPipesEndpoints['getOrgWorkspaceConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceConnection']
		>(
			`org/${input.org_handle}/workspace/${input.workspace_handle}/connection/${input.connection_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_org_connection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createOrgWorkspaceConnectionFolder: TurbotPipesEndpoints['createOrgWorkspaceConnectionFolder'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, title } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceConnectionFolder']
		>(
			`org/${org_handle}/workspace/${workspace_handle}/connection_folder`,
			ctx.key,
			{ method: 'POST', body: { title } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_org_connection_folder',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceConnectionFolder: TurbotPipesEndpoints['getOrgWorkspaceConnectionFolder'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceConnectionFolder']
		>(
			`org/${input.org_handle}/workspace/${input.workspace_handle}/connection_folder/${input.folder_id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_org_connection_folder',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createOrgWorkspaceAggregator: TurbotPipesEndpoints['createOrgWorkspaceAggregator'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, handle, connections } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceAggregator']
		>(`org/${org_handle}/workspace/${workspace_handle}/aggregator`, ctx.key, {
			method: 'POST',
			body: { handle, connections },
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_org_aggregator',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceAggregator: TurbotPipesEndpoints['getUserWorkspaceAggregator'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceAggregator']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/aggregator/${input.aggregator_handle}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_aggregator',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceAggregators: TurbotPipesEndpoints['listUserWorkspaceAggregators'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceAggregators']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/aggregator`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_aggregators',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceAggregatorConnections: TurbotPipesEndpoints['listUserWorkspaceAggregatorConnections'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceAggregatorConnections']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/aggregator/${input.aggregator_handle}/connection`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_aggregator_connections',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceAuditLogs: TurbotPipesEndpoints['listUserWorkspaceAuditLogs'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceAuditLogs']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/audit_log`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_audit_logs',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceDatabaseLogs: TurbotPipesEndpoints['listUserWorkspaceDatabaseLogs'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceDatabaseLogs']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/db_log`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_database_logs',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceProcesses: TurbotPipesEndpoints['listUserWorkspaceProcesses'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceProcesses']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/process`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_processes',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceProcess: TurbotPipesEndpoints['getUserWorkspaceProcess'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceProcess']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/process/${input.process_id}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_process',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceProcessLog: TurbotPipesEndpoints['getUserWorkspaceProcessLog'] =
	async (ctx, input) => {
		const contentType = input.content_type ?? 'json';
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceProcessLog']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/process/${input.process_id}/log/${input.log_file}.${contentType}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_process_log',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listOrgWorkspaceProcesses: TurbotPipesEndpoints['listOrgWorkspaceProcesses'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaceProcesses']
		>(
			`org/${input.org_handle}/workspace/${input.workspace_handle}/process`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_org_processes',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceUsage: TurbotPipesEndpoints['listUserWorkspaceUsage'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceUsage']
		>(
			`user/${input.user_handle}/workspace/${input.workspace_handle}/usage`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_usage',
			{ ...input },
			'completed',
		);
		return response;
	};
