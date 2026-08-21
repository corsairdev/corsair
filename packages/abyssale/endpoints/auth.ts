import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import type { AbyssaleEndpointOutputs } from './types';

export const testAuth: AbyssaleEndpoints['testAuth'] = async (ctx, input) => {
	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['testAuth']
	>('auth', ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(ctx, 'abyssale.auth.test', {}, 'completed');
	return response;
};
