import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiEndpoints } from '..';
import { makeCurrentsApiRequest } from '../client';
import type { CategoriesResponse } from './types';
import { CurrentsApiEndpointOutputSchemas } from './types';

export const get: CurrentsApiEndpoints['categories'] = async (ctx) => {
	const response = await makeCurrentsApiRequest<CategoriesResponse>(
		'/available/categories',
		ctx.key,
		{},
	);

	const validated = CurrentsApiEndpointOutputSchemas.categories.parse(response);

	await logEventFromContext(ctx, 'currentsapi.categories.get', {}, 'completed');

	return validated;
};
