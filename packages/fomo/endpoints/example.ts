import { logEventFromContext } from 'corsair/core';
import type { FomoEndpoints } from '..';
import type { FomoEndpointOutputs } from './types';
import { makeFomoRequest } from '../client';

export const get: FomoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFomoRequest<FomoEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'fomo.example.get', { ...input }, 'completed');
	return response;
};
