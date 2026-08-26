import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Feedback Records
// Query continuous feedback records (OData v4).
export const getFeedbackRecordsServiceAvailable: SapsuccessfactorsEndpoints['getFeedbackRecordsServiceAvailable'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFeedbackRecordsServiceAvailable']
		>('odata/v4/ContinuousPerformanceManagement.svc/Feedback', ctx.key, {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.feedback.getFeedbackRecordsServiceAvailable',
			input ?? {},
			'completed',
		);
		return response;
	};
