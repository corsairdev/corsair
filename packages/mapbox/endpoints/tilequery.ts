import type { MapboxEndpoints } from '..';
import { formatCoordinate, segment } from '../client';
import { call } from './call';
import {
	MapboxEndpointInputSchemas as Inputs,
	MapboxEndpointOutputSchemas as Outputs,
} from './types';

export const query: MapboxEndpoints['tilequeryQuery'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tilequery.query',
			input: Inputs.tilequeryQuery,
			output: Outputs.tilequeryQuery,
		},
		input,
		({ tileset_ids, coordinate, radius, limit, dedupe, geometry, layers }) => ({
			path: `/v4/${tileset_ids.map(segment).join(',')}/tilequery/${formatCoordinate(coordinate)}.json`,
			query: {
				radius,
				limit,
				dedupe,
				geometry,
				layers: layers?.join(','),
			},
		}),
		(result) => ({ count: result.features.length }),
	);
