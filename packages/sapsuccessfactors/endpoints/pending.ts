import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Pending Feedback Requests
// Query pending feedback requests.
export const getPendingFeedbackRequestsFeedback: SapsuccessfactorsEndpoints['getPendingFeedbackRequestsFeedback'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPendingFeedbackRequestsFeedback']
		>('odata/v4/ContinuousPerformanceManagement.svc/FeedbackRequest', ctx.key, {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.pending.getPendingFeedbackRequestsFeedback',
			input ?? {},
			'completed',
		);
		return response;
	};
