import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Interview Overall Assessment
// Retrieve overall interview ratings, recommendations, and comments.
export const getInterviewOverallAssessment: SapsuccessfactorsEndpoints['getInterviewOverallAssessment'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getInterviewOverallAssessment.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getInterviewOverallAssessment']
		>('odata/v2/OverallInterviewAssessment', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getInterviewOverallAssessment.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.interview.getInterviewOverallAssessment',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
