import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const getActor: TurbotPipesEndpoints['actorGet'] = async (
	ctx,
	input,
) => {
	const response = await makeTurbotPipesRequest<
		TurbotPipesEndpointOutputs['actorGet']
	>('actor', ctx.key, { method: 'GET' });
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
