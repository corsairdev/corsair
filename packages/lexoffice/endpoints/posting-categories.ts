import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type { PostingCategory } from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['postingCategoriesList'] = async (
	ctx,
	input,
) => {
	LexofficeEndpointInputSchemas.postingCategoriesList.parse(input);
	const response = await makeLexofficeRequest<PostingCategory[]>(
		'/posting-categories',
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		LexofficeEndpointOutputSchemas.postingCategoriesList.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.postingCategories.list',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};
