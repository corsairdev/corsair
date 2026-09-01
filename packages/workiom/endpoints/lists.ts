import { logEventFromContext } from 'corsair/core';
import type { WorkiomEndpoints } from '..';
import { makeWorkiomRequest } from '../client';
import { ListsGetAllOutputSchema } from './types';

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
