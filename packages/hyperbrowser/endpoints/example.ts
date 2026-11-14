import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import type { HyperbrowserEndpointOutputs } from './types';
import { makeHyperbrowserRequest } from '../client';

export const get: HyperbrowserEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeHyperbrowserRequest<HyperbrowserEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'hyperbrowser.example.get', { ...input }, 'completed');
	return response;
};
