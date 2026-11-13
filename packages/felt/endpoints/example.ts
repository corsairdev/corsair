import { logEventFromContext } from 'corsair/core';
import type { FeltEndpoints } from '..';
import type { FeltEndpointOutputs } from './types';
import { makeFeltRequest } from '../client';

export const get: FeltEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFeltRequest<FeltEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'felt.example.get', { ...input }, 'completed');
	return response;
};
