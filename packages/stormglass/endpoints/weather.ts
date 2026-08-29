import { logEventFromContext } from 'corsair/core';
import { makeStormglassRequest } from '../client';
import type { StormglassEndpoints } from '../index';
import type { StormglassEndpointOutputs } from './types';
import { StormglassEndpointInputSchemas } from './types';

/**
 * Fetch marine and land weather data for a point.
 *
 * API: GET /weather/point
 * Docs: https://docs.stormglass.io/#/weather
 */
export const getPoint: StormglassEndpoints['weather']['getPoint'] = async (
	ctx,
	rawInput,
) => {
	const input = StormglassEndpointInputSchemas.weatherGetPoint.parse(rawInput);
	const { params, source, ...rest } = input;

	const response = await makeStormglassRequest<
		StormglassEndpointOutputs['weatherGetPoint']
	>('weather/point', ctx.key, {
		query: {
			...rest,
			params: params.join(','),
			source: source && source.length > 0 ? source.join(',') : undefined,
		},
	});

	await logEventFromContext(
		ctx,
		'stormglass.weather.getPoint',
		{ ...input },
		'completed',
	);

	return response;
};
