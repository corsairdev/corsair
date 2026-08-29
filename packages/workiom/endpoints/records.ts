import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import type { RecordsCreateResponse, RecordsGetAllResponse } from './types';

/**
 * Get records from a list, with optional sorting, pagination, and filters.
 * API: POST /api/services/app/Data/All
 */
export const getAll: WorkiomEndpoints['recordsGetAll'] = async (ctx, input) => {
	const response = await makeWorkiomRequest<RecordsGetAllResponse>(
		'api/services/app/Data/All',
		ctx.key,
		{
			method: 'POST',
			body: {
				listId: input.listId,
				sorting: input.sorting,
				maxResultCount: input.maxResultCount,
				skipCount: input.skipCount,
				filters: input.filters,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'workiom.records.getAll',
		{ ...input },
		'completed',
	);
	return response;
};

/**
 * Create a record in a list. The body is a map of fieldId -> value.
 * API: POST /api/services/app/Data/Create?listId=
 */
export const create: WorkiomEndpoints['recordsCreate'] = async (ctx, input) => {
	const response = await makeWorkiomRequest<RecordsCreateResponse>(
		'api/services/app/Data/Create',
		ctx.key,
		{
			method: 'POST',
			query: { listId: input.listId },
			body: input.record,
		},
	);

	await logEventFromContext(
		ctx,
		'workiom.records.create',
		{ listId: input.listId },
		'completed',
	);
	return response;
};
