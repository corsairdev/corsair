import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Create Learning Activities Bulk
// Create learning activities linked to dev goals in bulk (3rd-party LMS).
export const createLearningActivitiesBulk: SapsuccessfactorsEndpoints['createLearningActivitiesBulk'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.createLearningActivitiesBulk.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { body, ...rest } = (validatedInput ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createLearningActivitiesBulk']
		>('odata/v2/LearningActivity', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.createLearningActivitiesBulk.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.learning.createLearningActivitiesBulk',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
