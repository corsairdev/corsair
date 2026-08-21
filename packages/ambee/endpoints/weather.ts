import { logEventFromContext } from 'corsair/core';
import { makeAmbeeRequest, toAmbeeTimestamp } from '../client';
import type { AmbeeEndpoints } from '../index';
import { persistWeatherObservation } from './persist';
import type { WeatherLatestResponse, WeatherSeriesResponse } from './types';
import {
	WeatherLatestResponseSchema,
	WeatherSeriesResponseSchema,
} from './types';

/**
 * Current weather conditions for a coordinate pair.
 *
 * API: GET api.ambeedata.com/weather/latest/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/weather
 */
export const getLatest: AmbeeEndpoints['weatherGetLatest'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<WeatherLatestResponse>(
		'weather/latest/by-lat-lng',
		ctx.key,
		{ query: { lat: input.lat, lng: input.lng, units: input.units } },
	);

	const response = WeatherLatestResponseSchema.parse(raw);

	await persistWeatherObservation(
		ctx,
		input.lat,
		input.lng,
		response.data,
		response.timezone,
	);
	await logEventFromContext(
		ctx,
		'ambee.weather.getLatest',
		{ lat: input.lat, lng: input.lng, units: input.units },
		'completed',
	);

	return response;
};

/**
 * Hourly historical weather for a coordinate pair (up to 48 hours per
 * request).
 *
 * API: GET api.ambeedata.com/weather/history/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/weather
 */
export const getHistory: AmbeeEndpoints['weatherGetHistory'] = async (
	ctx,
	input,
) => {
	const from = toAmbeeTimestamp(input.from);
	const to = toAmbeeTimestamp(input.to);

	const raw = await makeAmbeeRequest<WeatherSeriesResponse>(
		'weather/history/by-lat-lng',
		ctx.key,
		{
			query: {
				lat: input.lat,
				lng: input.lng,
				from,
				to,
				units: input.units,
			},
		},
	);

	const response = WeatherSeriesResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.weather.getHistory',
		{ lat: input.lat, lng: input.lng, from, to, units: input.units },
		'completed',
	);

	return response;
};

/**
 * Hourly weather forecast for a coordinate pair (next 72 hours).
 *
 * API: GET api.ambeedata.com/weather/forecast/by-lat-lng
 * Docs: https://docs.ambeedata.com/apis/weather
 */
export const getForecast: AmbeeEndpoints['weatherGetForecast'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmbeeRequest<WeatherSeriesResponse>(
		'weather/forecast/by-lat-lng',
		ctx.key,
		{ query: { lat: input.lat, lng: input.lng, units: input.units } },
	);

	const response = WeatherSeriesResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'ambee.weather.getForecast',
		{ lat: input.lat, lng: input.lng, units: input.units },
		'completed',
	);

	return response;
};
