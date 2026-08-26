import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Pending Feedback Requests
// Query pending feedback requests.
export const getPendingFeedbackRequestsFeedback: SapsuccessfactorsEndpoints['getPendingFeedbackRequestsFeedback'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getPendingFeedbackRequestsFeedback.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getPendingFeedbackRequestsFeedback']
		>('odata/v4/ContinuousPerformanceManagement.svc/FeedbackRequest', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getPendingFeedbackRequestsFeedback.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.pending.getPendingFeedbackRequestsFeedback',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
