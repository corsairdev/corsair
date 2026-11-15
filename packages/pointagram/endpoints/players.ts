import type { PointagramEndpoints } from '..';
import { segment } from '../client';
import { call, messageOf } from './call';
import {
	PointagramEndpointInputSchemas as Inputs,
	normalizeFlag,
	PointagramEndpointOutputSchemas as Outputs,
} from './types';

export const list: PointagramEndpoints['playersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'players.list',
			input: Inputs.playersList,
			output: Outputs.playersList,
		},
		input,
		({ search_by, filter, limit, offset }) => ({
			method: 'GET',
			path: '/players',
			query: { search_by, filter, limit, offset },
		}),
		{
			log: (_, result) => ({ count: result.players.length }),
		},
	);

export const get: PointagramEndpoints['playersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'players.get',
			input: Inputs.playersGet,
			output: Outputs.playersGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/players/${segment(id)}` }),
		{
			log: ({ id }) => ({ playerId: String(id) }),
		},
	);

export const create: PointagramEndpoints['playersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'players.create',
			input: Inputs.playersCreate,
			output: Outputs.playersCreate,
		},
		input,
		({ player_name, player_email, player_external_id, offline }) => ({
			method: 'POST',
			path: '/players',
			// Pointagram writes flags as "1"/"0" and its examples quote them.
			body: {
				player_name,
				player_email,
				player_external_id,
				offline: normalizeFlag(offline),
			},
		}),
	);

export const update: PointagramEndpoints['playersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'players.update',
			input: Inputs.playersUpdate,
			output: Outputs.playersUpdate,
		},
		input,
		({ id, player_name, player_email, player_external_id, offline }) => ({
			method: 'POST',
			path: `/players/${segment(id)}`,
			body: {
				player_name,
				player_email,
				player_external_id,
				offline: normalizeFlag(offline),
			},
		}),
		{
			log: ({ id }) => ({ playerId: String(id) }),
		},
	);

export const remove: PointagramEndpoints['playersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'players.delete',
			input: Inputs.playersDelete,
			output: Outputs.playersDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/players/${segment(id)}` }),
		{
			// The body is `{ status, message, data: {} }`, so the confirmation is
			// the message itself. Pointagram answers 200 for a player that does not exist and
			// for an admin it refuses to remove, which is why the text is returned
			// rather than flattened into a bare success flag.
			shape: (_data, envelope) => ({
				success: true as const,
				message: messageOf(envelope),
			}),
			log: ({ id }) => ({ playerId: String(id) }),
		},
	);
