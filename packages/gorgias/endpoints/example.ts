import { logEventFromContext } from 'corsair/core';
import type { GorgiasEndpoints } from '..';
import type { GorgiasEndpointOutputs } from './types';
import { makeGorgiasRequest } from '../client';

export const get: GorgiasEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGorgiasRequest<GorgiasEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'gorgias.example.get', { ...input }, 'completed');
	return response;
};
