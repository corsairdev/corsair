import { logEventFromContext } from 'corsair/core';
import type { ThinkificEndpoints } from '..';
import type { ThinkificEndpointOutputs } from './types';
import { makeThinkificRequest } from '../client';

export const get: ThinkificEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeThinkificRequest<ThinkificEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'thinkific.example.get', { ...input }, 'completed');
	return response;
};
