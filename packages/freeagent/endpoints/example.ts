import { logEventFromContext } from 'corsair/core';
import type { FreeAgentEndpoints } from '..';
import type { FreeAgentEndpointOutputs } from './types';
import { makeFreeAgentRequest } from '../client';

export const get: FreeAgentEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFreeAgentRequest<FreeAgentEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'freeagent.example.get', { ...input }, 'completed');
	return response;
};
