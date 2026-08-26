import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Onboarding 2.0 Processes
// Retrieve Onboarding 2.0 process records for new hires.
export const getOnb2Process: SapsuccessfactorsEndpoints['getOnb2Process'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getOnb2Process.parse(input ?? {});
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getOnb2Process']
		>('odata/v2/ONB2Process', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getOnb2Process.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.onb2.getOnb2Process',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
