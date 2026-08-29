import { logEventFromContext } from 'corsair/core';
import { makeStormglassRequest } from '../client';
import type { StormglassEndpoints } from '../index';
import type { StormglassEndpointOutputs } from './types';

/**
 * Fetch solar irradiation and sun-position data for a point.
 *
 * API: GET /solar/point
 * Docs: https://docs.stormglass.io/#/solar
 */
export const getPoint: StormglassEndpoints['solar']['getPoint'] = async (
	ctx,
	input,
) => {
	const { params, source, ...rest } = input;

	const response = await makeStormglassRequest<
		StormglassEndpointOutputs['solarGetPoint']
	>('solar/point', ctx.key, {
		query: {
			...rest,
			params: params.join(','),
			source: source && source.length > 0 ? source.join(',') : undefined,
		},
	});

	await logEventFromContext(
		ctx,
		'stormglass.solar.getPoint',
		{ ...input },
		'completed',
	);

	return response;
};
