import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// List Users
// Retrieve a list of all employee users.
export const listUsers: SapsuccessfactorsEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const query = input as Record<string, string | number | boolean | undefined>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['listUsers']
	>('odata/v2/User', ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.users.listUsers',
		input ?? {},
		'completed',
	);
	return response;
};
