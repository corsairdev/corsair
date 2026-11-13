import { logEventFromContext } from 'corsair/core';
import type { FathomEndpoints } from '..';
import type { FathomEndpointOutputs } from './types';
import { makeFathomRequest } from '../client';

export const get: FathomEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFathomRequest<FathomEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'fathom.example.get', { ...input }, 'completed');
	return response;
};
