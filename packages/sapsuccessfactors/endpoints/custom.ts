import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Custom MDF Object
// Retrieve custom MDF objects (names begin with cust_).
export const getCustomMdfObject: SapsuccessfactorsEndpoints['getCustomMdfObject'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCustomMdfObject.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { custom_object, ...rest } = (validatedInput ?? {}) as {
			custom_object?: string;
		};
		const rawName = (custom_object || 'cust_object').replace(
			/[^A-Za-z0-9_]/g,
			'',
		);
		const sanitizedObj = rawName.startsWith('cust_')
			? rawName
			: `cust_${rawName}`;
		const resourcePath = `odata/v2/${sanitizedObj}`;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCustomMdfObject']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: rest as Record<string, string | number | boolean | undefined>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCustomMdfObject.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.custom.getCustomMdfObject',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
