import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
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
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['daySummary']
	>('onecall/day_summary', ctx.key, { query: { ...input } });

	if (ctx.db.daySummaries) {
		try {
			const entityId = `${input.lat}_${input.lon}_${input.date}`;
			await ctx.db.daySummaries.upsertByEntityId(entityId, {
				lat: response.lat,
				lon: response.lon,
				date: response.date,
				tz: response.tz,
				units: response.units,
				temperatureMin: response.temperature.min,
				temperatureMax: response.temperature.max,
				temperatureAfternoon: response.temperature.afternoon,
				temperatureMorning: response.temperature.morning,
				temperatureEvening: response.temperature.evening,
				temperatureNight: response.temperature.night,
				precipitationTotal: response.precipitation.total,
				windMaxSpeed: response.wind.max.speed,
				windMaxDirection: response.wind.max.direction,
				cloudCoverAfternoon: response.cloud_cover.afternoon,
				humidityAfternoon: response.humidity.afternoon,
				pressureAfternoon: response.pressure.afternoon,
			});
		} catch (error) {
			console.warn('Failed to save day summary to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'openweathermap.summary.daySummary',
		{ ...input },
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
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['overview']
	>('onecall/overview', ctx.key, { query: { ...input } });

	if (ctx.db.overviews) {
		try {
			const entityId = `${input.lat}_${input.lon}_${response.date}`;
			await ctx.db.overviews.upsertByEntityId(entityId, {
				lat: response.lat,
				lon: response.lon,
				date: response.date,
				tz: response.tz,
				units: response.units,
				weatherOverview: response.weather_overview,
			});
		} catch (error) {
			console.warn('Failed to save weather overview to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'openweathermap.summary.overview',
		{ ...input },
		'completed',
	);

	return response;
};
