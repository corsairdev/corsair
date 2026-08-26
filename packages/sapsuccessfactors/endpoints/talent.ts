import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Get Talent Pool
// Retrieve talent pool records including members and nominations.
export const getTalentPool: SapsuccessfactorsEndpoints['getTalentPool'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.getTalentPool.parse(input ?? {});
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getTalentPool']
		>('odata/v2/TalentPool', ctx.key, { method: 'GET', query });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.getTalentPool.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.talent.getTalentPool',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
