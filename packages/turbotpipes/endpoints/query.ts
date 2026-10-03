import { logEventFromContext } from 'corsair/core';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';
import { makeTurbotPipesRequest } from '../client';

export const createOrgWorkspaceQuery: TurbotPipesEndpoints['createOrgWorkspaceQuery'] = async (ctx, input) => {
	const { org_handle, workspace_handle, sql } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['createOrgWorkspaceQuery']>(
		`org/${org_handle}/workspace/${workspace_handle}/query`,
		ctx.key,
		{ method: 'POST', body: { sql } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.create_org_query', { ...input }, 'completed');
	return response;
};

export const getOrgWorkspaceQueryData: TurbotPipesEndpoints['getOrgWorkspaceQueryData'] = async (ctx, input) => {
	const { org_handle, workspace_handle, sql } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getOrgWorkspaceQueryData']>(
		`org/${org_handle}/workspace/${workspace_handle}/query/data`,
		ctx.key,
		{ method: 'GET', query: { sql } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.get_org_query_data', { ...input }, 'completed');
	return response;
};

export const createOrgWorkspaceSnapshot: TurbotPipesEndpoints['createOrgWorkspaceSnapshot'] = async (ctx, input) => {
	const { org_handle, workspace_handle, title } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['createOrgWorkspaceSnapshot']>(
		`org/${org_handle}/workspace/${workspace_handle}/snapshot`,
		ctx.key,
		{ method: 'POST', body: { title } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.create_org_snapshot', { ...input }, 'completed');
	return response;
};

export const getUserWorkspaceQuery: TurbotPipesEndpoints['getUserWorkspaceQuery'] = async (ctx, input) => {
	const { user_handle, workspace_handle, sql } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getUserWorkspaceQuery']>(
		`user/${user_handle}/workspace/${workspace_handle}/query`,
		ctx.key,
		{ method: 'GET', query: { sql } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.get_user_query', { ...input }, 'completed');
	return response;
};

export const getUserWorkspaceQueryData: TurbotPipesEndpoints['getUserWorkspaceQueryData'] = async (ctx, input) => {
	const { user_handle, workspace_handle, sql } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['getUserWorkspaceQueryData']>(
		`user/${user_handle}/workspace/${workspace_handle}/query/data`,
		ctx.key,
		{ method: 'GET', query: { sql } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.get_user_query_data', { ...input }, 'completed');
	return response;
};

export const postUserWorkspaceQuery: TurbotPipesEndpoints['postUserWorkspaceQuery'] = async (ctx, input) => {
	const { user_handle, workspace_handle, sql } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['postUserWorkspaceQuery']>(
		`user/${user_handle}/workspace/${workspace_handle}/query`,
		ctx.key,
		{ method: 'POST', body: { sql } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.post_user_query', { ...input }, 'completed');
	return response;
};

export const runUserWorkspaceQuery: TurbotPipesEndpoints['runUserWorkspaceQuery'] = async (ctx, input) => {
	const { user_handle, workspace_handle, sql } = input;
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['runUserWorkspaceQuery']>(
		`user/${user_handle}/workspace/${workspace_handle}/query/run`,
		ctx.key,
		{ method: 'POST', body: { sql } },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.run_user_query', { ...input }, 'completed');
	return response;
};

export const listUserWorkspaceSnapshots: TurbotPipesEndpoints['listUserWorkspaceSnapshots'] = async (ctx, input) => {
	const response = await makeTurbotPipesRequest<TurbotPipesEndpointOutputs['listUserWorkspaceSnapshots']>(
		`user/${input.user_handle}/workspace/${input.workspace_handle}/snapshot`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'turbotpipes.query.list_user_snapshots', { ...input }, 'completed');
	return response;
};
