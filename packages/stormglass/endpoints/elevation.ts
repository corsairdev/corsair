import { logEventFromContext } from 'corsair/core';
import type { StormglassEndpoints } from '..';
import { makeStormglassRequest } from '../client';
import type { ElevationPointResponse } from './types';

export const point: StormglassEndpoints['elevationPoint'] = async (
	ctx,
	input,
) => {
	const response = await makeStormglassRequest<ElevationPointResponse>(
		'elevation/point',
		ctx.key,
		{ query: { lat: input.lat, lng: input.lng } },
	);

	await logEventFromContext(
		ctx,
		'stormglass.elevation.point',
		{ ...input },
		'completed',
	);
	return response;
};
