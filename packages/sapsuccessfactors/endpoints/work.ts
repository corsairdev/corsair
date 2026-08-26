import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Work Order
// Retrieve work order records for contingent worker management.
export const getWorkOrder: SapsuccessfactorsEndpoints['getWorkOrder'] = async (
	ctx,
	input,
) => {
	const query = input as Record<string, string | number | boolean | undefined>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getWorkOrder']
	>('odata/v2/WorkOrder', ctx.key, { method: 'GET', query });
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.work.getWorkOrder',
		input ?? {},
		'completed',
	);
	return response;
};
