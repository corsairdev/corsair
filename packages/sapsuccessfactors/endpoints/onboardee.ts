import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Create Onboardee
// Create a new onboardee in Onboarding 2.0 (new hire or rehire).
export const createOnboardee: SapsuccessfactorsEndpoints['createOnboardee'] =
	async (ctx, input) => {
		const { body, ...rest } = (input ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createOnboardee']
		>('odata/v2/Onboardee', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.onboardee.createOnboardee',
			input ?? {},
			'completed',
		);
		return response;
	};
