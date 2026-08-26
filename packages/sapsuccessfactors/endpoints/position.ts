import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Position
// Retrieve position management records (structure and hierarchy).
export const getPosition: SapsuccessfactorsEndpoints['getPosition'] = async (
	ctx,
	input,
) => {
	const validatedInput =
		SapsuccessfactorsEndpointInputSchemas.getPosition.parse(input ?? {});
	const apiBaseUrl =
		(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
	const query = validatedInput as Record<
		string,
		string | number | boolean | undefined
	>;
	const response = await makeSapsuccessfactorsRequest<
		SapsuccessfactorsEndpointOutputs['getPosition']
	>('odata/v2/Position', ctx.key, { method: 'GET', query, apiBaseUrl });
	const validatedResponse =
		SapsuccessfactorsEndpointOutputSchemas.getPosition.parse(response);
	await logEventFromContext(
		ctx,
		'sapsuccessfactors.position.getPosition',
		input ?? {},
		'completed',
	);
	return validatedResponse;
};
