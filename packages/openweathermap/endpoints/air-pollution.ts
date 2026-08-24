import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
import type { OpenWeatherMapEndpointOutputs } from './types';

export const current: OpenWeatherMapEndpoints['airPollution']['current'] =
	async (ctx, input) => {
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['airPollutionCurrent']
		>('air_pollution', ctx.key, {
			api: 'data25',
			query: { ...input },
		});

		await logEventFromContext(
			ctx,
			'openweathermap.airPollution.current',
			{ ...input },
			'completed',
		);

		return response;
	};

export const forecast: OpenWeatherMapEndpoints['airPollution']['forecast'] =
	async (ctx, input) => {
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['airPollutionForecast']
		>('air_pollution/forecast', ctx.key, {
			api: 'data25',
			query: { ...input },
		});

		await logEventFromContext(
			ctx,
			'openweathermap.airPollution.forecast',
			{ ...input },
			'completed',
		);

		return response;
	};

export const history: OpenWeatherMapEndpoints['airPollution']['history'] =
	async (ctx, input) => {
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['airPollutionHistory']
		>('air_pollution/history', ctx.key, {
			api: 'data25',
			query: { ...input },
		});

		await logEventFromContext(
			ctx,
			'openweathermap.airPollution.history',
			{ ...input },
			'completed',
		);

		return response;
	};
