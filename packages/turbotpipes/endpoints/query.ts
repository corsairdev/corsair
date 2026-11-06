import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
import type { TurbotPipesEndpointOutputs } from './types';

// Query events log only the user or org and workspace handles. SQL text can
// carry private literals, so it never goes into the event store.

export const createOrgWorkspaceQuery: TurbotPipesEndpoints['createOrgWorkspaceQuery'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, sql } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceQuery']
		>(
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/query`,
			ctx.key,
			{
				method: 'POST',
				body: { sql },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.create_org_query',
			{ org_handle, workspace_handle },
			'completed',
		);
		return response;
	};

export const getOrgWorkspaceQueryData: TurbotPipesEndpoints['getOrgWorkspaceQueryData'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, sql } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgWorkspaceQueryData']
		>(
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/query`,
			ctx.key,
			{
				method: 'GET',
				query: { sql },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.get_org_query_data',
			{ org_handle, workspace_handle },
			'completed',
		);
		return response;
	};

export const createOrgWorkspaceSnapshot: TurbotPipesEndpoints['createOrgWorkspaceSnapshot'] =
	async (ctx, input) => {
		const { org_handle, workspace_handle, data, title, visibility, tags } =
			input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['createOrgWorkspaceSnapshot']
		>(
			`org/${pathSegment(org_handle)}/workspace/${pathSegment(workspace_handle)}/snapshot`,
			ctx.key,
			{
				method: 'POST',
				body: { data, title, visibility, tags },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.create_org_snapshot',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserWorkspaceQuery: TurbotPipesEndpoints['getUserWorkspaceQuery'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, sql } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceQuery']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/query`,
			ctx.key,
			{
				method: 'GET',
				query: { sql },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.get_user_query',
			{ user_handle, workspace_handle },
			'completed',
		);
		return response;
	};

export const getUserWorkspaceQueryData: TurbotPipesEndpoints['getUserWorkspaceQueryData'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, sql } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserWorkspaceQueryData']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/query`,
			ctx.key,
			{
				method: 'GET',
				query: { sql },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.get_user_query_data',
			{ user_handle, workspace_handle },
			'completed',
		);
		return response;
	};

export const postUserWorkspaceQuery: TurbotPipesEndpoints['postUserWorkspaceQuery'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, sql } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['postUserWorkspaceQuery']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/query`,
			ctx.key,
			{
				method: 'POST',
				body: { sql },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.post_user_query',
			{ user_handle, workspace_handle },
			'completed',
		);
		return response;
	};

export const runUserWorkspaceQuery: TurbotPipesEndpoints['runUserWorkspaceQuery'] =
	async (ctx, input) => {
		const { user_handle, workspace_handle, sql } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['runUserWorkspaceQuery']
		>(
			`user/${pathSegment(user_handle)}/workspace/${pathSegment(workspace_handle)}/query`,
			ctx.key,
			{
				method: 'POST',
				body: { sql },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.run_user_query',
			{ user_handle, workspace_handle },
			'completed',
		);
		return response;
	};

export const listUserWorkspaceSnapshots: TurbotPipesEndpoints['listUserWorkspaceSnapshots'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserWorkspaceSnapshots']
		>(
			`user/${pathSegment(input.user_handle)}/workspace/${pathSegment(input.workspace_handle)}/snapshot`,
			ctx.key,
			{
				method: 'GET',
				query: pickQuery(input, ['where', 'limit', 'next_token']),
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.query.list_user_snapshots',
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
