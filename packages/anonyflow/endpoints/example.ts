import { logEventFromContext } from 'corsair/core';
import type { AnonyflowEndpoints } from '..';
import type { AnonyflowEndpointOutputs } from './types';
import { makeAnonyflowRequest } from '../client';

export const get: AnonyflowEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAnonyflowRequest<AnonyflowEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'anonyflow.example.get', { ...input }, 'completed');
	return response;
};
