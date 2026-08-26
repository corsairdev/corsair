import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Application Interview
// Retrieve interview info from Interview Central (first 1000 records; filter by applicationId).
export const getApplicationInterview: SapsuccessfactorsEndpoints['getApplicationInterview'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getApplicationInterview']
		>('odata/v2/ApplicationInterview', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.application.getApplicationInterview',
			input ?? {},
			'completed',
		);
		return response;
	};
