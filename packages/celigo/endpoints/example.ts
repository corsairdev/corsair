import { logEventFromContext } from 'corsair/core';
import type { CeligoEndpoints } from '..';
import { makeCeligoRequest } from '../client';
import type { CeligoEndpointOutputs } from './types';

export const getFlow: CeligoEndpoints['getFlow'] = async (ctx, input) => {
	const response = await makeCeligoRequest<CeligoEndpointOutputs['getFlow']>(
		`flows/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'celigo.flow.get', { ...input }, 'completed');

	return response;
};
