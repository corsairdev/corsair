import { logEventFromContext } from 'corsair/core';
import type { AbyssaleEndpoints } from '..';
import { makeAbyssaleRequest } from '../client';
import { parseInput, parseOutput } from './shared';
import type { AbyssaleEndpointOutputs } from './types';

export const testAuth: AbyssaleEndpoints['testAuth'] = async (ctx, input) => {
	const args = parseInput('testAuth', input);

	const response = await makeAbyssaleRequest<
		AbyssaleEndpointOutputs['testAuth']
	>('auth', ctx.key, {
		method: 'POST',
	});

	const result = parseOutput('testAuth', response);

	await logEventFromContext(ctx, 'abyssale.auth.test', {}, 'completed');
	return result;
};
