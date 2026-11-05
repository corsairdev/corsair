import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
import type { OpenWeatherMapEndpointOutputs } from './types';
import {
	CircleCityInputSchema,
	CurrentWeatherInputSchema,
	Forecast5DayInputSchema,
} from './weather-types';

/**
 * Get current weather, minute-by-minute forecast for 1 hour, hourly forecast for 48 hours,
 * daily forecast for 8 days, and government weather alerts.
 *
 * API: GET /onecall
 * Docs: https://openweathermap.org/api/one-call-3#current
 */
export const oneCall: OpenWeatherMapEndpoints['weather']['oneCall'] = async (
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

/**
 * Get current weather data for a location.
 *
 * API: GET /weather
 * Docs: https://openweathermap.org/current
 */
export const current: OpenWeatherMapEndpoints['weather']['current'] = async (
	ctx,
	input,
) => {
	const query = CurrentWeatherInputSchema.parse(input);
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['currentWeather']
	>('weather', ctx.key, {
		api: 'data25',
		query,
	});

	await logEventFromContext(
		ctx,
		'openweathermap.weather.current',
		{ ...query },
		'completed',
	);

	return response;
};

/**
 * Get 5-day / 3-hour forecast for a location.
 *
 * API: GET /forecast
 * Docs: https://openweathermap.org/forecast5
 */
export const forecast5Day: OpenWeatherMapEndpoints['weather']['forecast5Day'] =
	async (ctx, input) => {
		const query = Forecast5DayInputSchema.parse(input);
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['forecast5Day']
		>('forecast', ctx.key, {
			api: 'data25',
			query,
		});

		await logEventFromContext(
			ctx,
			'openweathermap.weather.forecast5Day',
			{ ...query },
			'completed',
		);

		return response;
	};

/**
 * Get current weather for cities within a circle around a geographic point.
 *
 * API: GET /find
 * Docs: https://openweathermap.org/current#other
 */
export const circleCity: OpenWeatherMapEndpoints['weather']['circleCity'] =
	async (ctx, input) => {
		const query = CircleCityInputSchema.parse(input);
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['circleCity']
		>('find', ctx.key, {
			api: 'data25',
			query,
		});

		await logEventFromContext(
			ctx,
			'openweathermap.weather.circleCity',
			{ ...query },
			'completed',
		);

		return response;
	};
