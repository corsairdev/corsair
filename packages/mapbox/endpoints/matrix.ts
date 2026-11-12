import type { MapboxEndpoints } from '..';
import { formatCoordinates } from '../client';
import { call } from './call';
import {
	MapboxEndpointInputSchemas as Inputs,
	MapboxEndpointOutputSchemas as Outputs,
} from './types';

export const calculate: MapboxEndpoints['matrixCalculate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'matrix.calculate',
			input: Inputs.matrixCalculate,
			output: Outputs.matrixCalculate,
		},
		input,
		({ profile, coordinates, annotations, sources, destinations }) => ({
			path: `/directions-matrix/v1/${profile}/${formatCoordinates(coordinates)}`,
			envelope: 'navigation',
			query: {
				annotations: annotations?.join(','),
				sources: Array.isArray(sources) ? sources.join(';') : sources,
				destinations: Array.isArray(destinations)
					? destinations.join(';')
					: destinations,
			},
		}),
		(result) => ({
			sources: result.sources.length,
			destinations: result.destinations.length,
		}),
	);
