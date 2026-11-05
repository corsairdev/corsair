import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { syncEntityDetail, syncListDiscovery } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

export const createUserWorkspaceDatatank: TurbotPipesEndpoints['createUserWorkspaceDatatank'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, handle } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceDatatank']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/datatank`,
			ctx.key,
			{
				method: 'POST',
				body: { handle },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.create_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceDatatank: TurbotPipesEndpoints['getUserWorkspaceDatatank'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceDatatank']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/datatank/${pathSegment(input.datatank_handle)}`,
			ctx.key,
			{ method: 'GET' },
		);
		// Awaited: a completed fetch guarantees its record is searchable locally.
		await syncEntityDetail(ctx, ctx.db?.datatank, response.id, response);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.get_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceDatatanks: TurbotPipesEndpoints['listUserWorkspaceDatatanks'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceDatatanks']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/datatank`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, ctx.db?.datatank, response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.list_user_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listOrgWorkspaceDatatanks: TurbotPipesEndpoints['listOrgWorkspaceDatatanks'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listOrgWorkspaceDatatanks']
		>(
			`org/${pathSegment(input.org_handle)}/workspace/${pathSegment(input.workspace_handle)}/datatank`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx, ctx.db?.datatank, response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.list_org_workspace',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createUserWorkspaceDatatankTable: TurbotPipesEndpoints['createUserWorkspaceDatatankTable'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, datatank_handle, table_name } =
			input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createUserWorkspaceDatatankTable']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/datatank/${pathSegment(datatank_handle)}/table`,
			ctx.key,
			{ method: 'POST', body: { table_name } },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.create_table',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getDatatankTable: TurbotPipesEndpoints['getDatatankTable'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getDatatankTable']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/datatank/${pathSegment(input.datatank_handle)}/table/${pathSegment(input.table_name)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.get_table',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceDatatankTables: TurbotPipesEndpoints['listUserWorkspaceDatatankTables'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceDatatankTables']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/datatank/${pathSegment(input.datatank_handle)}/table`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.list_tables',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceDatatankPartitions: TurbotPipesEndpoints['listUserWorkspaceDatatankPartitions'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceDatatankPartitions']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/datatank/${pathSegment(input.datatank_handle)}/table/${pathSegment(input.table_name)}/part`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.list_partitions',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceSchema: TurbotPipesEndpoints['getUserWorkspaceSchema'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceSchema']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/schema/${pathSegment(input.schema_name)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.get_schema',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceSchemas: TurbotPipesEndpoints['listUserWorkspaceSchemas'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceSchemas']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/schema`,
			ctx.key,
			{ method: 'GET', query: pickQuery(input, ['limit', 'next_token']) },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.list_schemas',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceSchemaTable: TurbotPipesEndpoints['getUserWorkspaceSchemaTable'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceSchemaTable']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/schema/${pathSegment(input.schema_name)}/table/${pathSegment(input.table_name)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.get_schema_table',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceSchemaTables: TurbotPipesEndpoints['listUserWorkspaceSchemaTables'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceSchemaTables']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/schema/${pathSegment(input.schema_name)}/table`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.datatanks.list_schema_tables',
			{ ...input },
			'completed',
		);
		return response;
	};
