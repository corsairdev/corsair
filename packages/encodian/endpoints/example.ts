import { logEventFromContext } from 'corsair/core';
import type { EncodianEndpoints } from '..';
import type { EncodianEndpointOutputs } from './types';
import { makeEncodianRequest } from '../client';

export const get: EncodianEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeEncodianRequest<EncodianEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'encodian.example.get', { ...input }, 'completed');
	return response;
};
