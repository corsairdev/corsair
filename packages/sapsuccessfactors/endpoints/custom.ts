import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Custom MDF Object
// Retrieve custom MDF objects (names begin with cust_).
export const getCustomMdfObject: SapsuccessfactorsEndpoints['getCustomMdfObject'] =
	async (ctx, input) => {
		const { custom_object, ...rest } = (input ?? {}) as {
			custom_object?: string;
		};
		const resourcePath = custom_object
			? `odata/v2/${custom_object}`
			: 'odata/v2/custom_objects';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCustomMdfObject']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: rest as Record<string, string | number | boolean | undefined>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.custom.getCustomMdfObject',
			input ?? {},
			'completed',
		);
		return response;
	};
