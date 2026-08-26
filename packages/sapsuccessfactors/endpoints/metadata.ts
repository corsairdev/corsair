import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Refresh Metadata for Continuous Feedback
// Refresh the metadata cache for the Continuous Feedback service.
export const refreshMetadataContFeedbackService: SapsuccessfactorsEndpoints['refreshMetadataContFeedbackService'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.refreshMetadataContFeedbackService.parse(
				input ?? {},
			);
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['refreshMetadataContFeedbackService']
		>('odata/v4/ContinuousPerformanceManagement.svc/RefreshMetadata', ctx.key, {
			method: 'POST',
			body: (validatedInput ?? {}) as Record<string, unknown>,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.refreshMetadataContFeedbackService.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.metadata.refreshMetadataContFeedbackService',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
