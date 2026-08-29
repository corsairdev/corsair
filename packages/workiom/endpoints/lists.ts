import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import type { ListsGetResponse } from './types';

/**
 * Get a list's meta-data (fields, views, filters).
 * API: GET /api/services/app/Lists/Get
 */
export const get: WorkiomEndpoints['listsGet'] = async (ctx, input) => {
	const response = await makeWorkiomRequest<ListsGetResponse>(
		'api/services/app/Lists/Get',
		ctx.key,
		{
			method: 'GET',
			query: {
				id: input.id,
				expand: input.expand ? input.expand.join(',') : undefined,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'workiom.lists.get',
		{ ...input },
		'completed',
	);
	return response;
};
