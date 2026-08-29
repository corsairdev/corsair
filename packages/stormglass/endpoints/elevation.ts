import { logEventFromContext } from 'corsair/core';
import { makeStormglassRequest } from '../client';
import type { StormglassEndpoints } from '../index';
import type { StormglassEndpointOutputs } from './types';

/**
 * Fetch elevation (bathymetry/topography) for a point.
 *
 * API: GET /elevation/point
 * Docs: https://docs.stormglass.io/#/elevation
 */
export const getPoint: StormglassEndpoints['elevation']['getPoint'] = async (
	ctx,
	input,
) => {
	const response = await makeStormglassRequest<
		StormglassEndpointOutputs['elevationGetPoint']
	>('elevation/point', ctx.key, { query: { ...input } });

	await logEventFromContext(
		ctx,
		'stormglass.elevation.getPoint',
		{ ...input },
		'completed',
	);

	return response;
};
