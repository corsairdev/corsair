import type { PointagramEndpoints } from '..';
import { segment } from '../client';
import { call, messageOf } from './call';
import {
	PointagramEndpointInputSchemas as Inputs,
	normalizeFlag,
	PointagramEndpointOutputSchemas as Outputs,
} from './types';

export const list: PointagramEndpoints['teamsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.list',
			input: Inputs.teamsList,
			output: Outputs.teamsList,
		},
		input,
		() => ({ method: 'GET', path: '/teams' }),
		{ log: (_, result) => ({ count: result.teams.length }) },
	);

export const get: PointagramEndpoints['teamsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.get',
			input: Inputs.teamsGet,
			output: Outputs.teamsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/teams/${segment(id)}` }),
		{ log: ({ id }) => ({ teamId: String(id) }) },
	);

export const create: PointagramEndpoints['teamsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.create',
			input: Inputs.teamsCreate,
			output: Outputs.teamsCreate,
		},
		input,
		({ team_name, icon, filter_ignore }) => ({
			method: 'POST',
			path: '/teams',
			body: { team_name, icon, filter_ignore: normalizeFlag(filter_ignore) },
		}),
	);

export const update: PointagramEndpoints['teamsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.update',
			input: Inputs.teamsUpdate,
			output: Outputs.teamsUpdate,
		},
		input,
		({ id, team_name, icon, filter_ignore }) => ({
			method: 'POST',
			path: `/teams/${segment(id)}`,
			body: { team_name, icon, filter_ignore: normalizeFlag(filter_ignore) },
		}),
		{ log: ({ id }) => ({ teamId: String(id) }) },
	);

export const addPlayer: PointagramEndpoints['teamsAddPlayer'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.addPlayer',
			input: Inputs.teamsAddPlayer,
			output: Outputs.teamsAddPlayer,
		},
		input,
		({ id, player_id, player_external_id, player_email }) => ({
			method: 'POST',
			path: `/teams/${segment(id)}/players`,
			body: {
				player_id,
				player_external_id,
				player_email,
			},
		}),
		{
			shape: (_data, envelope) => ({
				success: true as const,
				message: messageOf(envelope),
			}),
			log: ({ id }) => ({ teamId: String(id) }),
		},
	);

export const listPlayers: PointagramEndpoints['teamsListPlayers'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'teams.listPlayers',
			input: Inputs.teamsListPlayers,
			output: Outputs.teamsListPlayers,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/teams/${segment(id)}/players` }),
		{ log: (_, result) => ({ count: result.players.length }) },
	);

export const removePlayer: PointagramEndpoints['teamsRemovePlayer'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'teams.removePlayer',
			input: Inputs.teamsRemovePlayer,
			output: Outputs.teamsRemovePlayer,
		},
		input,
		({ id, player_id }) => ({
			method: 'DELETE',
			path: `/teams/${segment(id)}/${segment(player_id)}`,
		}),
		{
			shape: (_data, envelope) => ({
				success: true as const,
				message: messageOf(envelope),
			}),
			log: ({ id, player_id }) => ({
				teamId: String(id),
				playerId: String(player_id),
			}),
		},
	);
