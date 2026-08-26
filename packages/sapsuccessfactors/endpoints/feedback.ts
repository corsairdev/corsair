import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Feedback Records
// Query continuous feedback records (OData v4).
export const getFeedbackRecordsServiceAvailable: SapsuccessfactorsEndpoints['getFeedbackRecordsServiceAvailable'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getFeedbackRecordsServiceAvailable.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getFeedbackRecordsServiceAvailable']
		>('odata/v4/ContinuousPerformanceManagement.svc/Feedback', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getFeedbackRecordsServiceAvailable.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.feedback.getFeedbackRecordsServiceAvailable',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
