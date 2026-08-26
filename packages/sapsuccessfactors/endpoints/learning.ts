import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Create Learning Activities Bulk
// Create learning activities linked to dev goals in bulk (3rd-party LMS).
export const createLearningActivitiesBulk: SapsuccessfactorsEndpoints['createLearningActivitiesBulk'] =
	async (ctx, input) => {
		const { body, ...rest } = (input ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createLearningActivitiesBulk']
		>('odata/v2/LearningActivity', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.learning.createLearningActivitiesBulk',
			input ?? {},
			'completed',
		);
		return response;
	};
