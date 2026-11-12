import { logEventFromContext } from 'corsair/core';
import type { EngageEndpoints } from '..';
import type { EngageEndpointOutputs } from './types';
import { makeEngageRequest } from '../client';

export const get: EngageEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeEngageRequest<EngageEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'engage.example.get', { ...input }, 'completed');
	return response;
};
