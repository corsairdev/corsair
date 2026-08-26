import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Application Interview
// Retrieve interview info from Interview Central (first 1000 records; filter by applicationId).
export const getApplicationInterview: SapsuccessfactorsEndpoints['getApplicationInterview'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getApplicationInterview.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getApplicationInterview']
		>('odata/v2/ApplicationInterview', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getApplicationInterview.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.application.getApplicationInterview',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
