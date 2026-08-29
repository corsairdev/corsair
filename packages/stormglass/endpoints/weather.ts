import { logEventFromContext } from 'corsair/core';
import type { StormglassEndpoints } from '..';
import { makeStormglassRequest } from '../client';
import type { WeatherPointResponse } from './types';

export const point: StormglassEndpoints['weatherPoint'] = async (
	ctx,
	input,
) => {
	const response = await makeStormglassRequest<WeatherPointResponse>(
		'weather/point',
		ctx.key,
		{
			query: {
				lat: input.lat,
				lng: input.lng,
				params: input.params.join(','),
				start: input.start,
				end: input.end,
				source: input.source,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'stormglass.weather.point',
		{ ...input },
		'completed',
	);
	return response;
};
