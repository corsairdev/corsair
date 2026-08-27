import { logEventFromContext } from 'corsair/core';
import type { PlainEndpoints } from '..';
import type { PlainEndpointOutputs } from './types';
import { makePlainRequest } from '../client';

export const get: PlainEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makePlainRequest<PlainEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'plain.example.get', { ...input }, 'completed');
	return response;
};
