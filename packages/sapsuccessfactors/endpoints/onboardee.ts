import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Create Onboardee
// Create a new onboardee in Onboarding 2.0 (new hire or rehire).
export const createOnboardee: SapsuccessfactorsEndpoints['createOnboardee'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.createOnboardee.parse(input ?? {});
		const { body, ...rest } = (validatedInput ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createOnboardee']
		>('odata/v2/Onboardee', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.createOnboardee.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.onboardee.createOnboardee',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
