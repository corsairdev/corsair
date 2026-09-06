import { logEventFromContext } from 'corsair/core';
import type { CodyEndpoints } from '..';
import { makeCodyRequest } from '../client';
import type { CodyEndpointOutputs } from './types';

export const get: CodyEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeCodyRequest<CodyEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'cody.example.get', { ...input }, 'completed');
	return response;
};
