import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Work Order
// Retrieve work order records for contingent worker management.
export const getWorkOrder: SapsuccessfactorsEndpoints['getWorkOrder'] = async (
	ctx,
	input,
) => {
	const validatedInput =
		SapsuccessfactorsEndpointInputSchemas.getWorkOrder.parse(input ?? {});
	const apiBaseUrl =
		(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
	const query = validatedInput as Record<
		string,
		string | number | boolean | undefined
	>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getWorkOrder']
	>('odata/v2/WorkOrder', ctx.key, { method: 'GET', query, apiBaseUrl });
	const validatedResponse =
		SapsuccessfactorsEndpointOutputSchemas.getWorkOrder.parse(response);
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.work.getWorkOrder',
		input ?? {},
		'completed',
	);
	return validatedResponse;
};
