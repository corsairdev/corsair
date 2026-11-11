import type { MapboxEndpoints } from '..';
import { formatCoordinates } from '../client';
import { call } from './call';
import {
	MapboxEndpointInputSchemas as Inputs,
	MapboxEndpointOutputSchemas as Outputs,
} from './types';

export const route: MapboxEndpoints['directionsRoute'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'directions.route',
			input: Inputs.directionsRoute,
			output: Outputs.directionsRoute,
		},
		input,
		({
			profile,
			coordinates,
			alternatives,
			annotations,
			continue_straight,
			exclude,
			geometries,
			overview,
			steps,
			language,
		}) => ({
			path: `/directions/v5/${profile}/${formatCoordinates(coordinates)}`,
			envelope: 'navigation',
			query: {
				alternatives,
				annotations: annotations?.join(','),
				continue_straight,
				exclude: exclude?.join(','),
				geometries,
				overview,
				steps,
				language,
			},
		}),
		(result) => ({ routes: result.routes.length }),
	);
