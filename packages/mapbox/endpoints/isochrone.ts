import type { MapboxEndpoints } from '..';
import { formatCoordinate } from '../client';
import { call } from './call';
import {
	MapboxEndpointInputSchemas as Inputs,
	MapboxEndpointOutputSchemas as Outputs,
} from './types';

export const get: MapboxEndpoints['isochroneGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'isochrone.get',
			input: Inputs.isochroneGet,
			output: Outputs.isochroneGet,
		},
		input,
		({
			profile,
			coordinate,
			contours_minutes,
			contours_meters,
			contours_colors,
			polygons,
			denoise,
			generalize,
			exclude,
			depart_at,
		}) => ({
			path: `/isochrone/v1/${profile}/${formatCoordinate(coordinate)}`,
			query: {
				contours_minutes: contours_minutes?.join(','),
				contours_meters: contours_meters?.join(','),
				contours_colors: contours_colors?.join(','),
				polygons,
				denoise,
				generalize,
				exclude: exclude?.join(','),
				depart_at,
			},
		}),
		(result) => ({ contours: result.features.length }),
	);
