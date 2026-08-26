import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Get Talent Pool
// Retrieve talent pool records including members and nominations.
export const getTalentPool: SapsuccessfactorsEndpoints['getTalentPool'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['getTalentPool']
		>('odata/v2/TalentPool', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.talent.getTalentPool',
			input ?? {},
			'completed',
		);
		return response;
	};
