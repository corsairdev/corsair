import type { MapboxEndpoints } from '..';
import { formatCoordinate } from '../client';
import { call } from './call';
import {
	MapboxEndpointInputSchemas as Inputs,
	MapboxEndpointOutputSchemas as Outputs,
} from './types';

export const forward: MapboxEndpoints['geocodingForward'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geocoding.forward',
			input: Inputs.geocodingForward,
			output: Outputs.geocodingForward,
		},
		input,
		({
			q,
			autocomplete,
			bbox,
			country,
			language,
			limit,
			proximity,
			types,
			worldview,
		}) => ({
			path: '/search/geocode/v6/forward',
			query: {
				q,
				autocomplete,
				bbox: bbox?.join(','),
				country: country?.join(','),
				language,
				limit,
				proximity:
					proximity === undefined || proximity === 'ip'
						? proximity
						: formatCoordinate(proximity),
				types: types?.join(','),
				worldview,
			},
		}),
		(result) => ({ count: result.features.length }),
	);

export const reverse: MapboxEndpoints['geocodingReverse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'geocoding.reverse',
			input: Inputs.geocodingReverse,
			output: Outputs.geocodingReverse,
		},
		input,
		({ longitude, latitude, country, language, limit, types, worldview }) => ({
			path: '/search/geocode/v6/reverse',
			query: {
				longitude,
				latitude,
				country: country?.join(','),
				language,
				limit,
				types: types?.join(','),
				worldview,
			},
		}),
		(result) => ({ count: result.features.length }),
	);
