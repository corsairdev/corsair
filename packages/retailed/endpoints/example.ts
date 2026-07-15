import { logEventFromContext } from 'corsair/core';

import type { RetailedEndpoints } from '..';
import { makeRetailedRequest } from '../client';
import type { RetailedEndpointOutputs } from './types';

export const get: RetailedEndpoints['getUsage'] = async (ctx) => {
	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['getUsage']
	>('usage', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(ctx, 'retailed.usage.get', {}, 'completed');

	return response;
};
