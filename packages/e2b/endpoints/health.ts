import { logEventFromContext } from 'corsair/core';
import type { E2bEndpoints } from '..';
import { makeE2bRequest } from '../client';
import type { E2bEndpointOutputs } from './types';

// Check API Health
// Check the health status of the E2B API.
export const getHealth: E2bEndpoints['getHealth'] = async (ctx, input) => {
	// TODO: Verify the HTTP method, endpoint path, and how auth/params are passed.
	// Docs hint: search for "Check API Health E2b API"
	const response = await makeE2bRequest<E2bEndpointOutputs['getHealth']>(
		'TODO_PATH', // e.g. 'healths' or 'v1/healths'
		ctx.key,
		{ method: 'GET', query: input as Record<string, string | number | boolean | undefined> },
	);
	await logEventFromContext(ctx, 'e2b.health.getHealth', input ?? {}, 'completed');
	return response;
};
