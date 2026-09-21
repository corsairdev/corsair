import { logEventFromContext } from 'corsair/core';
import { makeTripadvisorRequest } from '../client';
import type { TripadvisorEndpoints } from '../index';
import type { TripadvisorEndpointOutputs } from './types';
import { LocationsNearbyResponseSchema } from './types';

/** Searches the Tripadvisor catalog for locations near the requested area. */
export const nearby: TripadvisorEndpoints['locationsNearby'] = async (
	ctx,
	input,
) => {
	const response = LocationsNearbyResponseSchema.parse(
		await makeTripadvisorRequest<TripadvisorEndpointOutputs['locationsNearby']>(
			'/catalog/locations/nearby',
			ctx.key,
			{
				method: 'GET',
				query: input,
			},
		),
	);

	await logEventFromContext(
		ctx,
		'tripadvisor.catalog.locationsNearby',
		{
			...input,
			resultCount: response.data.length,
		},
		'completed',
	);

	return response;
};
