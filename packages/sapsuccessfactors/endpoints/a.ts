import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Create a Feedback Request
// Request performance feedback from one employee about another.
export const createAFeedbackRequest: SapsuccessfactorsEndpoints['createAFeedbackRequest'] =
	async (ctx, input) => {
		const { body, ...rest } = (input ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createAFeedbackRequest']
		>('odata/v4/ContinuousPerformanceManagement.svc/FeedbackRequest', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.a.createAFeedbackRequest',
			input ?? {},
			'completed',
		);
		return response;
	};
