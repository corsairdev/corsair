import { HERE_HOSTS, makeHereRequest } from '../client';
import type { HereEndpoints } from '../index';
import { runHereEndpoint, weatherQuery } from './call';
import {
	GetAstronomyForecastInputSchema,
	GetAstronomyForecastResponseSchema,
	GetWeatherAlertsInputSchema,
	GetWeatherAlertsResponseSchema,
	GetWeatherForecastDailyInputSchema,
	GetWeatherForecastDailyResponseSchema,
	GetWeatherForecastHourlyInputSchema,
	GetWeatherForecastHourlyResponseSchema,
	GetWeatherObservationInputSchema,
	GetWeatherObservationResponseSchema,
} from './types';

export const getWeatherObservation: HereEndpoints['getWeatherObservation'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.weather.getWeatherObservation',
		GetWeatherObservationInputSchema,
		GetWeatherObservationResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.weather, '/v3/report', apiKey, {
				query: weatherQuery(validated, 'observation', {
					oneObservation: validated.oneObservation,
				}),
			}),
	);

export const getWeatherForecastDaily: HereEndpoints['getWeatherForecastDaily'] =
	(ctx, input) =>
		runHereEndpoint(
			ctx,
			'here.weather.getWeatherForecastDaily',
			GetWeatherForecastDailyInputSchema,
			GetWeatherForecastDailyResponseSchema,
			input,
			(validated, apiKey) =>
				makeHereRequest(HERE_HOSTS.weather, '/v3/report', apiKey, {
					query: weatherQuery(
						validated,
						validated.product ?? 'forecast7daysSimple',
					),
				}),
		);

export const getWeatherForecastHourly: HereEndpoints['getWeatherForecastHourly'] =
	(ctx, input) =>
		runHereEndpoint(
			ctx,
			'here.weather.getWeatherForecastHourly',
			GetWeatherForecastHourlyInputSchema,
			GetWeatherForecastHourlyResponseSchema,
			input,
			(validated, apiKey) =>
				makeHereRequest(HERE_HOSTS.weather, '/v3/report', apiKey, {
					query: weatherQuery(validated, 'forecastHourly'),
				}),
		);

export const getAstronomyForecast: HereEndpoints['getAstronomyForecast'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.weather.getAstronomyForecast',
		GetAstronomyForecastInputSchema,
		GetAstronomyForecastResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.weather, '/v3/report', apiKey, {
				query: weatherQuery(validated, 'forecastAstronomy'),
			}),
	);

export const getWeatherAlerts: HereEndpoints['getWeatherAlerts'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.weather.getWeatherAlerts',
		GetWeatherAlertsInputSchema,
		GetWeatherAlertsResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.weather, '/v3/report', apiKey, {
				query: weatherQuery(validated, 'alerts'),
			}),
	);
