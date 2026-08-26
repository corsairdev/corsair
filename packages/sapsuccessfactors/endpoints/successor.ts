import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Create or Update Successor Nomination
// Create/update a successor nomination for a position or talent pool.
export const createUpdateSuccessorNomination: SapsuccessfactorsEndpoints['createUpdateSuccessorNomination'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.createUpdateSuccessorNomination.parse(
				input ?? {},
			);
		const { body, ...rest } = (validatedInput ?? {}) as {
			body?: Record<string, unknown>;
		};
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['createUpdateSuccessorNomination']
		>('odata/v4/NominationService.svc/Nomination', ctx.key, {
			method: 'POST',
			body: (body ?? rest) as Record<string, unknown>,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.createUpdateSuccessorNomination.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.successor.createUpdateSuccessorNomination',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
