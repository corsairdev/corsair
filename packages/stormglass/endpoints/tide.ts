import { logEventFromContext } from 'corsair/core';
import type { StormglassEndpoints } from '..';
import { makeStormglassRequest } from '../client';
import type { TideExtremesPointResponse, TideStationsResponse } from './types';

export const stationsArea: StormglassEndpoints['tideStationsArea'] = async (
	ctx,
	input,
) => {
	const response = await makeStormglassRequest<TideStationsResponse>(
		'tide/stations',
		ctx.key,
		{ query: { box: input.box } },
	);

	await logEventFromContext(
		ctx,
		'stormglass.tide.stationsArea',
		{ ...input },
		'completed',
	);
	return response;
};

export const stationsList: StormglassEndpoints['tideStationsList'] = async (
	ctx,
) => {
	const response = await makeStormglassRequest<TideStationsResponse>(
		'tide/stations',
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'stormglass.tide.stationsList',
		{},
		'completed',
	);
	return response;
};

export const extremesPoint: StormglassEndpoints['tideExtremesPoint'] = async (
	ctx,
	input,
) => {
	const response = await makeStormglassRequest<TideExtremesPointResponse>(
		'tide/extremes/point',
		ctx.key,
		{
			query: {
				lat: input.lat,
				lng: input.lng,
				start: input.start,
				end: input.end,
				datum: input.datum,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'stormglass.tide.extremesPoint',
		{ ...input },
		'completed',
	);
	return response;
};
