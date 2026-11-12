import { logEventFromContext } from 'corsair/core';
import type { EndorsalEndpoints } from '..';
import type { EndorsalEndpointOutputs } from './types';
import { makeEndorsalRequest } from '../client';

export const get: EndorsalEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeEndorsalRequest<EndorsalEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'endorsal.example.get', { ...input }, 'completed');
	return response;
};
