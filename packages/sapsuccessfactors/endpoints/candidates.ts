import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// List Candidates
// Retrieve a list of candidates.
export const listCandidates: SapsuccessfactorsEndpoints['listCandidates'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['listCandidates']
		>('odata/v2/Candidate', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.candidates.listCandidates',
			input ?? {},
			'completed',
		);
		return response;
	};
