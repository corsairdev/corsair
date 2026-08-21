import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
import type { OpenWeatherMapEndpointOutputs } from './types';

export const direct: OpenWeatherMapEndpoints['geocoding']['direct'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['geocodingDirect']
	>('direct', ctx.key, {
		api: 'geo',
		query: { ...input },
	});

	await logEventFromContext(
		ctx,
		'openweathermap.geocoding.direct',
		{ ...input },
		'completed',
	);

	return response;
};

export const reverse: OpenWeatherMapEndpoints['geocoding']['reverse'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['geocodingReverse']
	>('reverse', ctx.key, {
		api: 'geo',
		query: { ...input },
	});

	await logEventFromContext(
		ctx,
		'openweathermap.geocoding.reverse',
		{ ...input },
		'completed',
	);

	return response;
};

export const byZip: OpenWeatherMapEndpoints['geocoding']['byZip'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['geocodingByZip']
	>('zip', ctx.key, {
		api: 'geo',
		query: { zip: input.zip },
	});

	await logEventFromContext(
		ctx,
		'openweathermap.geocoding.byZip',
		{ ...input },
		'completed',
	);

	return response;
};
