import { logEventFromContext } from 'corsair/core';
import { makeTripadvisorRequest } from '../client';
import type { TripadvisorEndpoints } from '../index';
import type { TripadvisorEndpointOutputs } from './types';
import { GeoDetailsResponseSchema } from './types';

/** Retrieves the factual and rich details of a single Tripadvisor Geo. */
export const geoDetails: TripadvisorEndpoints['geoDetails'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = input;
	const response = GeoDetailsResponseSchema.parse(
		await makeTripadvisorRequest<TripadvisorEndpointOutputs['geoDetails']>(
			`/geos/${encodeURIComponent(String(id))}`,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		),
	);

	await logEventFromContext(
		ctx,
		'tripadvisor.geo.details',
		{ id },
		'completed',
	);

	return response;
};
