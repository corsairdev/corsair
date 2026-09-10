import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import {
	RecordsCreateOutputSchema,
	RecordsGetAllOutputSchema,
	RecordsUpdateOutputSchema,
} from './types';

export const getAll: WorkiomEndpoints['recordsGetAll'] = async (ctx, input) => {
	const raw = await makeWorkiomRequest('/api/services/app/Data/All', ctx.key, {
		method: 'POST',
		body: {
			listId: input.listId,
			sorting: input.sorting,
			maxResultCount: input.maxResultCount,
			skipCount: input.skipCount,
			filters: input.filters,
		},
	});
	const response = RecordsGetAllOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'workiom.records.getAll',
		{
			listId: input.listId,
			filterCount: input.filters?.length ?? 0,
			filterFieldIds: input.filters?.map((filter) => filter.fieldId) ?? [],
			sorting: input.sorting,
			maxResultCount: input.maxResultCount,
			skipCount: input.skipCount,
		},
		'completed',
	);
	return response;
};

export const create: WorkiomEndpoints['recordsCreate'] = async (ctx, input) => {
	const raw = await makeWorkiomRequest(
		'/api/services/app/Data/Create',
		ctx.key,
		{
			method: 'POST',
			query: { listId: input.listId },
			body: input.record,
		},
	);
	const response = RecordsCreateOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'workiom.records.create',
		{ listId: input.listId },
		'completed',
	);
	return response;
};

export const update: WorkiomEndpoints['recordsUpdate'] = async (ctx, input) => {
	const raw = await makeWorkiomRequest(
		'/api/services/app/Data/Update',
		ctx.key,
		{
			method: 'PUT',
			query: { listId: input.listId, id: input.id },
			body: input.record,
		},
	);
	const response = RecordsUpdateOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'workiom.records.update',
		{ listId: input.listId, id: input.id },
		'completed',
	);
	return response;
};
