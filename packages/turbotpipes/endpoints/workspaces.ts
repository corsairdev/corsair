import { logEventFromContext } from 'corsair/core';
import {
	makeTurbotPipesRequest,
	makeTurbotPipesTextRequest,
	pathSegment,
	pickQuery,
} from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import { syncEntityDetail, syncListDiscovery } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

// unknown: a parsed log line is any JSON value until this checks it.
function isJsonObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// unknown: log lines are provider-defined objects without a fixed shape.
function parseJsonLines(text: string): Record<string, unknown>[] {
	const entries: Record<string, unknown>[] = [];
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		try {
			const parsed: unknown = JSON.parse(trimmed);
			entries.push(isJsonObject(parsed) ? parsed : { raw: trimmed });
		} catch {
			entries.push({ raw: trimmed });
		}
	}
	return entries;
}

export const createUserWorkspaceConnection: TurbotPipesEndpoints['createUserWorkspaceConnection'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, handle, plugin, config, parent_id } =
			input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceConnection']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/connection`,
			ctx.key,
			{
				method: 'POST',
				body: { handle, plugin, config, parent_id },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_user_connection',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceConnection: TurbotPipesEndpoints['getUserWorkspaceConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceConnection']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection/${pathSegment(input.connection_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_connection',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnections: TurbotPipesEndpoints['listUserWorkspaceConnections'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnections']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'connection', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connections',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnectionAssociations: TurbotPipesEndpoints['listUserWorkspaceConnectionAssociations'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnectionAssociations']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/conn`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connection_associations',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnectionTree: TurbotPipesEndpoints['listUserWorkspaceConnectionTree'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnectionTree']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection_tree`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['prefix', 'where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connection_tree',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const testUserWorkspaceConnection: TurbotPipesEndpoints['testUserWorkspaceConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['testUserWorkspaceConnection']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection/${pathSegment(input.connection_handle)}/test`,
			ctx.key,
			{
				method: 'POST',
				body: { plugin: input.plugin, config: input.config },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.test_user_connection',
			eventIdentifiers(input),
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
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/connection_folder`,
			ctx.key,
			{ method: 'POST', body: { title } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_user_connection_folder',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceConnectionFolder: TurbotPipesEndpoints['getUserWorkspaceConnectionFolder'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceConnectionFolder']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection_folder/${pathSegment(input.folder_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_connection_folder',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceConnectionFolders: TurbotPipesEndpoints['listUserWorkspaceConnectionFolders'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceConnectionFolders']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection_folder`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_connection_folders',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const createOrgWorkspaceConnection: TurbotPipesEndpoints['createOrgWorkspaceConnection'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, handle, plugin, config, parent_id } =
			input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceConnection']
		>(
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/connection`,
			ctx.key,
			{
				method: 'POST',
				body: { handle, plugin, config, parent_id },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_org_connection',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceConnection: TurbotPipesEndpoints['getOrgWorkspaceConnection'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceConnection']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection/${pathSegment(input.connection_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_org_connection',
			eventIdentifiers(input),
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
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/connection_folder`,
			ctx.key,
			{ method: 'POST', body: { title } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_org_connection_folder',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceConnectionFolder: TurbotPipesEndpoints['getOrgWorkspaceConnectionFolder'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceConnectionFolder']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/connection_folder/${pathSegment(input.folder_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_org_connection_folder',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const createOrgWorkspaceAggregator: TurbotPipesEndpoints['createOrgWorkspaceAggregator'] =
	async (ctx, input) => {
		const {
			org_handle,
			workspace_handle,
			handle,
			plugin,
			connections,
			config,
		} = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceAggregator']
		>(
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/aggregator`,
			ctx.key,
			{
				method: 'POST',
				body: { handle, plugin, connections, config },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.create_org_aggregator',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceAggregator: TurbotPipesEndpoints['getUserWorkspaceAggregator'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceAggregator']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/aggregator/${pathSegment(input.aggregator_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_aggregator',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceAggregators: TurbotPipesEndpoints['listUserWorkspaceAggregators'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceAggregators']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/aggregator`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_aggregators',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceAggregatorConnections: TurbotPipesEndpoints['listUserWorkspaceAggregatorConnections'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceAggregatorConnections']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/aggregator/${pathSegment(input.aggregator_handle)}/connection`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_aggregator_connections',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceAuditLogs: TurbotPipesEndpoints['listUserWorkspaceAuditLogs'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceAuditLogs']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/audit_log`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_audit_logs',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceDatabaseLogs: TurbotPipesEndpoints['listUserWorkspaceDatabaseLogs'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceDatabaseLogs']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/db_log`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_database_logs',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceProcesses: TurbotPipesEndpoints['listUserWorkspaceProcesses'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceProcesses']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/process`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'process', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_processes',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceProcess: TurbotPipesEndpoints['getUserWorkspaceProcess'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceProcess']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/process/${pathSegment(input.process_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		// Awaited: a completed fetch guarantees its record is searchable locally.
		await syncEntityDetail(ctx, 'process', response.id, response);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_process',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceProcessLog: TurbotPipesEndpoints['getUserWorkspaceProcessLog'] =
	async (ctx, input) => {
		const logFile = input.log_file ?? 'process';
		const contentType = input.content_type ?? 'jsonl';
		// The log is JSON lines (application/jsonlines+json): one JSON object per
		// line, read as text and parsed line by line.
		const text = await makeTurbotPipesTextRequest(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/process/${pathSegment(input.process_id)}/log/${pathSegment(logFile)}.${pathSegment(contentType)}`,
			ctx.key,
			'application/jsonlines+json',
		);
		const response: TurbotPipesEndpointOutputs['getUserWorkspaceProcessLog'] = {
			entries: parseJsonLines(text),
		};
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.get_user_process_log',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listOrgWorkspaceProcesses: TurbotPipesEndpoints['listOrgWorkspaceProcesses'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaceProcesses']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/process`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, 'process', response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_org_processes',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const listUserWorkspaceUsage: TurbotPipesEndpoints['listUserWorkspaceUsage'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceUsage']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/usage`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.workspaces.list_user_usage',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
