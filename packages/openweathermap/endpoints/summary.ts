import { logEventFromContext } from 'corsair/core';
import type { OpenWeatherMapEndpoints } from '..';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpointOutputs } from './types';

/**
 * Get aggregated weather data for a specific date.
 * Data is available from January 2nd, 1979 to 1.5 years ahead of the current date.
 *
 * API: GET /onecall/day_summary
 * Docs: https://openweathermap.org/api/one-call-3#day_summary
 */
export const daySummary: OpenWeatherMapEndpoints['daySummary'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		lat: input.lat,
		lon: input.lon,
		date: input.date,
		units: input.units,
		lang: input.lang,
		tz: input.tz,
	};

	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['daySummary']
	>('onecall/day_summary', ctx.key, { query });

	await logEventFromContext(
		ctx,
		'openweathermap.summary.daySummary',
		{ lat: input.lat, lon: input.lon, date: input.date },
		'completed',
	);

	return response;
};

/**
 * Get a human-readable weather overview for a location.
 * Returns a text summary of the weather conditions.
 *
 * API: GET /onecall/overview
 * Docs: https://openweathermap.org/api/one-call-3#overview
 */
export const overview: OpenWeatherMapEndpoints['overview'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		lat: input.lat,
		lon: input.lon,
		date: input.date,
		units: input.units,
	};

	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['overview']
	>('onecall/overview', ctx.key, { query });

	await logEventFromContext(
		ctx,
		'openweathermap.summary.overview',
		{ lat: input.lat, lon: input.lon, date: input.date },
		'completed',
	);

	return response;
};
