import { logEventFromContext } from 'corsair/core';
import { makeStormglassRequest } from '../client';
import type { StormglassEndpoints } from '../index';
import type { StormglassEndpointOutputs } from './types';
import { StormglassEndpointInputSchemas } from './types';

/**
 * Fetch high/low tide extremes for a point.
 *
 * API: GET /tide/extremes/point
 * Docs: https://docs.stormglass.io/#/tide
 */
export const getExtremesPoint: StormglassEndpoints['tide']['getExtremesPoint'] =
	async (ctx, rawInput) => {
		const input =
			StormglassEndpointInputSchemas.tideGetExtremesPoint.parse(rawInput);
		const response = await makeStormglassRequest<
			StormglassEndpointOutputs['tideGetExtremesPoint']
		>('tide/extremes/point', ctx.key, { query: { ...input } });

		await logEventFromContext(
			ctx,
			'stormglass.tide.getExtremesPoint',
			{ ...input },
			'completed',
		);

		return response;
	};

/**
 * List all tide stations Stormglass has data for.
 *
 * API: GET /tide/stations
 * Docs: https://docs.stormglass.io/#/tide
 */
export const listStations: StormglassEndpoints['tide']['listStations'] = async (
	ctx,
	input,
) => {
	const response = await makeStormglassRequest<
		StormglassEndpointOutputs['tideListStations']
	>('tide/stations', ctx.key);

	await logEventFromContext(
		ctx,
		'stormglass.tide.listStations',
		{ ...input },
		'completed',
	);

	return response;
};

/**
 * List tide stations within a bounding box.
 *
 * API: GET /tide/stations/area
 * Docs: https://docs.stormglass.io/#/tide
 *
 * Stormglass expects the box as `box=swLat,swLng:neLat,neLng`.
 */
export const getStationsInArea: StormglassEndpoints['tide']['getStationsInArea'] =
	async (ctx, input) => {
		const { swLat, swLng, neLat, neLng } = input;

		const response = await makeStormglassRequest<
			StormglassEndpointOutputs['tideGetStationsInArea']
		>('tide/stations/area', ctx.key, {
			query: { box: `${swLat},${swLng}:${neLat},${neLng}` },
		});

		await logEventFromContext(
			ctx,
			'stormglass.tide.getStationsInArea',
			{ ...input },
			'completed',
		);

		return response;
	};
