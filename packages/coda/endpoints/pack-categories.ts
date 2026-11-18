import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['packCategoriesList'] = async (ctx, input) => {
	const { packId } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packCategoriesList']
	>(`packs/${encodeURIComponent(packId)}/categories`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'coda.packCategories.list',
		{ ...input },
		'completed',
	);
	return response;
};

const add: CodaEndpoints['packCategoriesAdd'] = async (ctx, input) => {
	const { packId, ...body } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packCategoriesAdd']
	>(`packs/${encodeURIComponent(packId)}/category`, ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'coda.packCategories.add',
		{ ...input },
		'completed',
	);
	return response;
};

const deleteOne: CodaEndpoints['packCategoriesDelete'] = async (ctx, input) => {
	const { packId, categoryName } = input;
	const response = await makeCodaRequest<
		CodaEndpointOutputs['packCategoriesDelete']
	>(
		`packs/${encodeURIComponent(packId)}/category/${encodeURIComponent(categoryName)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	await logEventFromContext(
		ctx,
		'coda.packCategories.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const PackCategories = {
	list,
	add,
	delete: deleteOne,
};
