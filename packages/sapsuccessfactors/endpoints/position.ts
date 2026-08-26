import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Position
// Retrieve position management records (structure and hierarchy).
export const getPosition: SapsuccessfactorsEndpoints['getPosition'] = async (
	ctx,
	input,
) => {
	const query = input as Record<string, string | number | boolean | undefined>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getPosition']
	>('odata/v2/Position', ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.position.getPosition',
		input ?? {},
		'completed',
	);
	return response;
};
