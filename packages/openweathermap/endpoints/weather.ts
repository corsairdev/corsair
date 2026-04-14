import { logEventFromContext } from 'corsair/core';
import type { OpenWeatherMapEndpoints } from '..';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpointOutputs } from './types';

/**
 * Get current weather, minute-by-minute forecast for 1 hour, hourly forecast for 48 hours,
 * daily forecast for 8 days, and government weather alerts.
 *
 * API: GET /onecall
 * Docs: https://openweathermap.org/api/one-call-3#current
 */
export const oneCall: OpenWeatherMapEndpoints['oneCall'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		lat: input.lat,
		lon: input.lon,
		units: input.units,
		lang: input.lang,
	};

	if (input.exclude && input.exclude.length > 0) {
		query.exclude = input.exclude.join(',');
	}

	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['oneCall']
	>('onecall', ctx.key, { query });

	await logEventFromContext(
		ctx,
		'openweathermap.weather.oneCall',
		{ lat: input.lat, lon: input.lon },
		'completed',
	);

	return response;
};
