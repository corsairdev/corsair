import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Current User
// Retrieve the currently authenticated user's information.
export const getCurrentUser: SapsuccessfactorsEndpoints['getCurrentUser'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getCurrentUser.parse(input ?? {});
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = (validatedInput ?? {}) as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getCurrentUser']
		>('odata/v2/User', ctx.key, { method: 'GET', query, apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getCurrentUser.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.current.getCurrentUser',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
