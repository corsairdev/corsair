import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Refresh Metadata for Continuous Feedback
// Refresh the metadata cache for the Continuous Feedback service.
export const refreshMetadataContFeedbackService: SapsuccessfactorsEndpoints['refreshMetadataContFeedbackService'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['refreshMetadataContFeedbackService']
		>('odata/v4/ContinuousPerformanceManagement.svc/RefreshMetadata', ctx.key, {
			method: 'POST',
			body: (input ?? {}) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.metadata.refreshMetadataContFeedbackService',
			input ?? {},
			'completed',
		);
		return response;
	};
