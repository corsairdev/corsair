import { logEventFromContext } from 'corsair/core';
import type { GristEndpoints } from '..';
import type { GristEndpointOutputs } from './types';
import { makeGristRequest } from '../client';

export const get: GristEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGristRequest<GristEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'grist.example.get', { ...input }, 'completed');
	return response;
};
