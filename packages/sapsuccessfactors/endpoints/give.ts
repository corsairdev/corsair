import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Give Feedback or Respond to Feedback Request
// Give feedback or respond to a feedback request (up to 3 Q&A pairs).
export const giveFeedbackOrRespondToAFeedbackRequest: SapsuccessfactorsEndpoints['giveFeedbackOrRespondToAFeedbackRequest'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.giveFeedbackOrRespondToAFeedbackRequest.parse(
				input ?? {},
			);
		const { body, ...rest } = (validatedInput ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['giveFeedbackOrRespondToAFeedbackRequest']
		>('odata/v4/ContinuousPerformanceManagement.svc/Feedback', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.giveFeedbackOrRespondToAFeedbackRequest.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.give.giveFeedbackOrRespondToAFeedbackRequest',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
