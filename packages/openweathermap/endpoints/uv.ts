import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
import type { OpenWeatherMapEndpointOutputs } from './types';

export const current: OpenWeatherMapEndpoints['uv']['current'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['uvCurrent']
	>('uvi', ctx.key, {
		api: 'data25',
		query: { ...input },
	});

	await logEventFromContext(
		ctx,
		'openweathermap.uv.current',
		{ ...input },
		'completed',
	);

	return response;
};

export const forecast: OpenWeatherMapEndpoints['uv']['forecast'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['uvForecast']
	>('uvi/forecast', ctx.key, {
		api: 'data25',
		query: { ...input },
	});

	await logEventFromContext(
		ctx,
		'openweathermap.uv.forecast',
		{ ...input },
		'completed',
	);

	return response;
};

export const history: OpenWeatherMapEndpoints['uv']['history'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['uvHistory']
	>('uvi/history', ctx.key, {
		api: 'data25',
		query: { ...input },
	});

	await logEventFromContext(
		ctx,
		'openweathermap.uv.history',
		{ ...input },
		'completed',
	);

	return response;
};
