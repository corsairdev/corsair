import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Create or Update Successor Nomination
// Create/update a successor nomination for a position or talent pool.
export const createUpdateSuccessorNomination: SapsuccessfactorsEndpoints['createUpdateSuccessorNomination'] =
	async (ctx, input) => {
		const { body, ...rest } = (input ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createUpdateSuccessorNomination']
		>('odata/v4/NominationService.svc/Nomination', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.successor.createUpdateSuccessorNomination',
			input ?? {},
			'completed',
		);
		return response;
	};
