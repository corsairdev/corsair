import type { PenpotEndpoints } from '..';
import { call, shapeDeleted } from './call';
import {
	PenpotEndpointInputSchemas as Inputs,
	PenpotEndpointOutputSchemas as Outputs,
} from './types';

export const list: PenpotEndpoints['teamsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.list',
			input: Inputs.teamsList,
			output: Outputs.teamsList,
		},
		input,
		() => 'get-teams',
		{ body: () => undefined, log: (_, teams) => ({ count: teams.length }) },
	);

export const create: PenpotEndpoints['teamsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.create',
			input: Inputs.teamsCreate,
			output: Outputs.teamsCreate,
		},
		input,
		() => 'create-team',
		{
			body: (input) => input,
			log: (_, team) => ({ teamId: team.id ?? undefined }),
		},
	);

export const get: PenpotEndpoints['teamsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.get',
			input: Inputs.teamsGet,
			output: Outputs.teamsGet,
		},
		input,
		() => 'get-team',
		{
			body: ({ id }) => ({ id }),
			log: (_, team) => ({ teamId: team.id ?? undefined }),
		},
	);

export const remove: PenpotEndpoints['teamsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.delete',
			input: Inputs.teamsDelete,
			output: Outputs.teamsDelete,
		},
		input,
		() => 'delete-team',
		{
			body: ({ id }) => ({ id }),
			shape: shapeDeleted,
			log: (_, result) => ({ teamId: result.id }),
		},
	);
