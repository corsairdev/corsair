import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// List Users
// Retrieve a list of all employee users.
export const listUsers: SapsuccessfactorsEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const validatedInput = SapsuccessfactorsEndpointInputSchemas.listUsers.parse(
		input ?? {},
	);
	const query = validatedInput as Record<
		string,
		string | number | boolean | undefined
	>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['listUsers']
	>('odata/v2/User', ctx.key, { method: 'GET', query });
	const validatedResponse =
		SapsuccessfactorsEndpointOutputSchemas.listUsers.parse(response);
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.users.listUsers',
		input ?? {},
		'completed',
	);
	return validatedResponse;
};
