import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import { ListsGetAllOutputSchema, ListsGetOutputSchema } from './types';

export const get: WorkiomEndpoints['listsGet'] = async (ctx, input) => {
	const expand = input.expand ?? ['Fields', 'Views', 'Filters'];
	const raw = await makeWorkiomRequest('/api/services/app/Lists/Get', ctx.key, {
		query: { id: input.id, expand: expand.join(',') },
	});
	const response = ListsGetOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'workiom.lists.get',
		{ id: input.id, expand },
		'completed',
	);
	return response;
};

export const getAll: WorkiomEndpoints['listsGetAll'] = async (ctx, input) => {
	const raw = await makeWorkiomRequest(
		'/api/services/app/Lists/GetAll',
		ctx.key,
		{ query: { appId: input.appId } },
	);
	const page =
		raw && typeof raw === 'object' && 'items' in raw
			? raw
			: { items: Array.isArray(raw) ? raw : [] };
	const response = ListsGetAllOutputSchema.parse(page);
	await logEventFromContext(
		ctx,
		'workiom.lists.getAll',
		{ appId: input.appId },
		'completed',
	);
	return response;
};
