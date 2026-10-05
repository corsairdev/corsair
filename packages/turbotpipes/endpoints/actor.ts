import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { syncEntityDetail, syncListDiscovery } from './sync';
import type { TurbotPipesEndpointOutputs } from './types';

export const getActor: TurbotPipesEndpoints['actorGet'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['actorGet']
	>('actor', ctx.key, { method: 'GET' });
	// Awaited: a completed fetch guarantees its record is searchable locally.
	await syncEntityDetail(ctx.db?.actor, response.id, response);
	await logEventFromContext(
		ctx,
		'turbotpipes.actor.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const listActorWorkspaces: TurbotPipesEndpoints['actorListWorkspaces'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['actorListWorkspaces']
		>('actor/workspace', ctx.key, { method: 'GET', query: input });
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx.db?.workspace, response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.actor.list_workspaces',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listActorOrgs: TurbotPipesEndpoints['actorListOrgs'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['actorListOrgs']
	>('actor/org', ctx.key, { method: 'GET', query: input });
	// Background insert-only discovery: populates search without
	// erasing stored details and without delaying the response.
	syncListDiscovery(ctx.db?.org, response?.items);
	await logEventFromContext(
		ctx,
		'turbotpipes.actor.list_orgs',
		{ ...input },
		'completed',
	);
	return response;
};

export const listActorConnections: TurbotPipesEndpoints['actorListConnections'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['actorListConnections']
		>('actor/conn', ctx.key, { method: 'GET', query: input });
		// Background insert-only discovery: populates search without
		// erasing stored details and without delaying the response.
		syncListDiscovery(ctx.db?.connection, response?.items);
		await logEventFromContext(
			ctx,
			'turbotpipes.actor.list_connections',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listActorActivity: TurbotPipesEndpoints['actorListActivity'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['actorListActivity']
		>('actor/activity', ctx.key, { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'turbotpipes.actor.list_activity',
			{ ...input },
			'completed',
		);
		return response;
	};
