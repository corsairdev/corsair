import { logEventFromContext } from 'corsair/core';
import type { FingertipEndpoints } from '..';
import type { FingertipEndpointOutputs } from './types';
import { makeFingertipRequest } from '../client';

export const get: FingertipEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFingertipRequest<FingertipEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'fingertip.example.get', { ...input }, 'completed');
	return response;
};
