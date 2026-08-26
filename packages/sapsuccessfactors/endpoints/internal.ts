import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Update Username Post Hiring
// Update a new hire's internal username after MPH submit, pre day-1.
export const updateInternalUsernameNewHiresAfter: SapsuccessfactorsEndpoints['updateInternalUsernameNewHiresAfter'] =
	async (ctx, input) => {
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['updateInternalUsernameNewHiresAfter']
		>('odata/v2/updateUserNamePostHiring', ctx.key, {
			method: 'POST',
			body: (input ?? {}) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.internal.updateInternalUsernameNewHiresAfter',
			input ?? {},
			'completed',
		);
		return response;
	};
