import { logEventFromContext } from 'corsair/core';
import type { FinmeiEndpoints } from '..';
import type { FinmeiEndpointOutputs } from './types';
import { makeFinmeiRequest } from '../client';

export const get: FinmeiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFinmeiRequest<FinmeiEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'finmei.example.get', { ...input }, 'completed');
	return response;
};
