import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// List Candidates
// Retrieve a list of candidates.
export const listCandidates: SapsuccessfactorsEndpoints['listCandidates'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.listCandidates.parse(input ?? {});
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['listCandidates']
		>('odata/v2/Candidate', ctx.key, { method: 'GET', query, apiBaseUrl });
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.listCandidates.parse(response);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.candidates.listCandidates',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
