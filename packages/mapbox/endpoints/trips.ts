import type { MapboxEndpoints } from '..';
import { formatCoordinates } from '../client';
import { call } from './call';
import {
	MapboxEndpointInputSchemas as Inputs,
	MapboxEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Optimization v1: a synchronous GET that returns the best stop order.
 * Optimization v2 (POST /optimized-trips/v2) is a separate async API that the
 * free token here cannot reach (403 "Account does not have access"), so it is
 * not wrapped.
 */
export const optimize: MapboxEndpoints['tripsOptimize'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'trips.optimize',
			input: Inputs.tripsOptimize,
			output: Outputs.tripsOptimize,
		},
		input,
		({
			profile,
			coordinates,
			annotations,
			destination,
			geometries,
			language,
			overview,
			roundtrip,
			source,
			steps,
		}) => ({
			path: `/optimized-trips/v1/${profile}/${formatCoordinates(coordinates)}`,
			envelope: 'navigation',
			query: {
				annotations: annotations?.join(','),
				destination,
				geometries,
				language,
				overview,
				roundtrip,
				source,
				steps,
			},
		}),
		(result) => ({ trips: result.trips.length }),
	);
