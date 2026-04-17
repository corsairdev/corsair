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
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['timeMachine']
	>('onecall/timemachine', ctx.key, { query: { ...input } });

	await logEventFromContext(
		ctx,
		'openweathermap.history.timeMachine',
		{ ...input },
		'completed',
	);

	return response;
};
