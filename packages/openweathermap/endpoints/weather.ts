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
	const { exclude, ...rest } = input;

	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['oneCall']
	>('onecall', ctx.key, {
		query: {
			...rest,
			exclude: exclude && exclude.length > 0 ? exclude.join(',') : undefined,
		},
	});

	await logEventFromContext(
		ctx,
		'openweathermap.weather.oneCall',
		{ ...input },
		'completed',
	);

	return response;
};
