import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Update Username Post Hiring
// Update a new hire's internal username after MPH submit, pre day-1.
export const updateInternalUsernameNewHiresAfter: SapsuccessfactorsEndpoints['updateInternalUsernameNewHiresAfter'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.updateInternalUsernameNewHiresAfter.parse(
				input ?? {},
			);
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['updateInternalUsernameNewHiresAfter']
		>('odata/v2/updateUserNamePostHiring', ctx.key, {
			method: 'POST',
			body: (validatedInput ?? {}) as Record<string, unknown>,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.updateInternalUsernameNewHiresAfter.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.internal.updateInternalUsernameNewHiresAfter',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
