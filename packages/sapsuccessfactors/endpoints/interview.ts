import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Interview Overall Assessment
// Retrieve overall interview ratings, recommendations, and comments.
export const getInterviewOverallAssessment: SapsuccessfactorsEndpoints['getInterviewOverallAssessment'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getInterviewOverallAssessment']
		>('odata/v2/OverallInterviewAssessment', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.interview.getInterviewOverallAssessment',
			input ?? {},
			'completed',
		);
		return response;
	};
