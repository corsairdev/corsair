import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import type { ArynEndpointOutputs } from './types';

export const get: ArynEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeArynRequest<ArynEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'aryn.example.get', { ...input }, 'completed');
	return response;
};
