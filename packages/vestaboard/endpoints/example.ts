import { logEventFromContext } from 'corsair/core';
import type { VestaboardEndpoints } from '..';
import type { VestaboardEndpointOutputs } from './types';
import { makeVestaboardRequest } from '../client';

export const get: VestaboardEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeVestaboardRequest<VestaboardEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'vestaboard.example.get', { ...input }, 'completed');
	return response;
};
