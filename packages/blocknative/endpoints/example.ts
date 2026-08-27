import { logEventFromContext } from 'corsair/core';
import type { BlocknativeEndpoints } from '..';
import { makeBlocknativeRequest } from '../client';
import type { BlocknativeEndpointOutputs } from './types';

export const get: BlocknativeEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBlocknativeRequest<
		BlocknativeEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'blocknative.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
