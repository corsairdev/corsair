import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
import { StationCreateResponseSchema } from './stations-types';
import type { OpenWeatherMapEndpointOutputs } from './types';

export const list: OpenWeatherMapEndpoints['stations']['list'] = async (
	ctx,
	_input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['stationsList']
	>('stations', ctx.key);

	await logEventFromContext(
		ctx,
		'openweathermap.stations.list',
		{},
		'completed',
	);

	return response;
};

export const get: OpenWeatherMapEndpoints['stations']['get'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['stationsGet']
	>(`stations/${input.station_id}`, ctx.key);

	await logEventFromContext(
		ctx,
		'openweathermap.stations.get',
		{ station_id: input.station_id },
		'completed',
	);

	return response;
};

export const create: OpenWeatherMapEndpoints['stations']['create'] = async (
	ctx,
	input,
) => {
	const raw = await makeOpenWeatherMapRequest<unknown>('stations', ctx.key, {
		method: 'POST',
		body: { ...input },
	});
	const response = StationCreateResponseSchema.parse(
		raw,
	) as OpenWeatherMapEndpointOutputs['stationsCreate'];

	await logEventFromContext(
		ctx,
		'openweathermap.stations.create',
		{ external_id: input.external_id, name: input.name },
		'completed',
	);

	return response;
};

export const update: OpenWeatherMapEndpoints['stations']['update'] = async (
	ctx,
	input,
) => {
	const { station_id, ...body } = input;

	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['stationsUpdate']
	>(`stations/${station_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'openweathermap.stations.update',
		{ station_id },
		'completed',
	);

	return response;
};

export const remove: OpenWeatherMapEndpoints['stations']['remove'] = async (
	ctx,
	input,
) => {
	const response = await makeOpenWeatherMapRequest<
		OpenWeatherMapEndpointOutputs['stationsRemove']
	>(`stations/${input.station_id}`, ctx.key, {
		method: 'DELETE',
		responseType: 'empty',
	});

	await logEventFromContext(
		ctx,
		'openweathermap.stations.remove',
		{ station_id: input.station_id },
		'completed',
	);

	return response;
};

export const getMeasurements: OpenWeatherMapEndpoints['stations']['getMeasurements'] =
	async (ctx, input) => {
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['stationsGetMeasurements']
		>('measurements', ctx.key, {
			query: { ...input },
		});

		await logEventFromContext(
			ctx,
			'openweathermap.stations.getMeasurements',
			{ ...input },
			'completed',
		);

		return response;
	};

export const submitMeasurements: OpenWeatherMapEndpoints['stations']['submitMeasurements'] =
	async (ctx, input) => {
		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['stationsSubmitMeasurements']
		>('measurements', ctx.key, {
			method: 'POST',
			body: input.measurements,
			responseType: 'empty',
		});

		await logEventFromContext(
			ctx,
			'openweathermap.stations.submitMeasurements',
			{ count: input.measurements.length },
			'completed',
		);

		return response;
	};
