import { logEventFromContext } from 'corsair/core';
import type { CodaEndpoints } from '..';
import { makeCodaRequest } from '../client';
import type { CodaEndpointOutputs } from './types';

const list: CodaEndpoints['categoriesList'] = async (ctx, input) => {
	const response = await makeCodaRequest<CodaEndpointOutputs['categoriesList']>(
		'categories',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'coda.categories.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const Categories = {
	list,
};
