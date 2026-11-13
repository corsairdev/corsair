import { logEventFromContext } from 'corsair/core';
import type { ElorusEndpoints } from '..';
import type { ElorusEndpointOutputs } from './types';
import { makeElorusRequest } from '../client';

export const get: ElorusEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeElorusRequest<ElorusEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'elorus.example.get', { ...input }, 'completed');
	return response;
};
