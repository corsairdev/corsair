import type { PointagramEndpoints } from '..';
import { PointagramAPIError, readEnvelopeMessage, segment } from '../client';
import { call } from './call';
import {
	PointagramEndpointInputSchemas as Inputs,
	PointagramEndpointOutputSchemas as Outputs,
} from './types';

export const list: PointagramEndpoints['competitionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'competitions.list',
			input: Inputs.competitionsList,
			output: Outputs.competitionsList,
		},
		input,
		({ search_by, filter, competition_id, accesskey }) => ({
			method: 'GET',
			path: '/competitions',
			query: { search_by, filter, competition_id, accesskey },
		}),
		{ log: (_, result) => ({ count: result.competitions.length }) },
	);

export const get: PointagramEndpoints['competitionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'competitions.get',
			input: Inputs.competitionsGet,
			output: Outputs.competitionsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/competitions/${segment(id)}`,
		}),
		{
			// The docs print one object; the live API sends a one-element array.
			shape: (data, envelope) => {
				if (!Array.isArray(data)) return data;
				if (data.length === 0) {
					throw new PointagramAPIError(
						readEnvelopeMessage(envelope) ?? 'Competition not found',
						{ method: 'GET' },
					);
				}
				return data[0];
			},
			log: ({ id }) => ({ competitionId: String(id) }),
		},
	);

export const players: PointagramEndpoints['competitionsPlayers'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'competitions.players',
			input: Inputs.competitionsPlayers,
			output: Outputs.competitionsPlayers,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/competitions/${segment(id)}/players`,
		}),
		{ log: (_, result) => ({ count: result.players.length }) },
	);
