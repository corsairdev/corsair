import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapEndpoints } from '../index';
import type { OpenWeatherMapEndpointOutputs } from './types';

export const weatherMapTile: OpenWeatherMapEndpoints['maps']['weatherMapTile'] =
	async (ctx, input) => {
		const { layer, z, x, y, ...query } = input;

		const response = await makeOpenWeatherMapRequest<
			OpenWeatherMapEndpointOutputs['weatherMapTile']
		>(`weather/${layer}/${z}/${x}/${y}`, ctx.key, {
			api: 'maps2',
			query,
			responseType: 'binary',
		});

		await logEventFromContext(
			ctx,
			'openweathermap.maps.weatherMapTile',
			{ layer, z, x, y },
			'completed',
		);

		return response;
	};
