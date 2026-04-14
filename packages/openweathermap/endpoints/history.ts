import { logEventFromContext } from 'corsair/core';
import type { OpenWeatherMapEndpoints } from '..';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpointOutputs } from './types';

/**
 * Get historical weather data for a specific timestamp.
 * Data is available from January 1st, 1979.
 *
 * API: GET /onecall/timemachine
 * Docs: https://openweathermap.org/api/one-call-3#history
 */
export const timeMachine: OpenWeatherMapEndpoints['timeMachine'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		lat: input.lat,
		lon: input.lon,
		dt: input.dt,
		units: input.units,
		lang: input.lang,
	};

	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['timeMachine']
	>('onecall/timemachine', ctx.key, { query });

	await logEventFromContext(
		ctx,
		'openweathermap.history.timeMachine',
		{ lat: input.lat, lon: input.lon, dt: input.dt },
		'completed',
	);

	return response;
};
