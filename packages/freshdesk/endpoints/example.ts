import { logEventFromContext } from 'corsair/core';
import type { FreshdeskEndpoints } from '..';
import type { FreshdeskEndpointOutputs } from './types';
import { makeFreshdeskRequest } from '../client';

export const get: FreshdeskEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeFreshdeskRequest<FreshdeskEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'freshdesk.example.get', { ...input }, 'completed');
	return response;
};
