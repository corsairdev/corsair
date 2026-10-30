import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiEndpoints } from '..';
import { makeCurrentsApiRequest } from '../client';
import type { RegionsResponse } from './types';
import { CurrentsApiEndpointOutputSchemas } from './types';

export const get: CurrentsApiEndpoints['regions'] = async (ctx) => {
	const response = await makeCurrentsApiRequest<RegionsResponse>(
		'/available/regions',
		ctx.key,
		{},
	);

	const validated = CurrentsApiEndpointOutputSchemas.regions.parse(response);

	await logEventFromContext(ctx, 'currentsapi.regions.get', {}, 'completed');

	return validated;
};
