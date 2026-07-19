import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCandidateAvailabilityTemplate: WorkdayEndpoints['getCandidateAvailabilityTemplate'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getCandidateAvailabilityTemplate']
		>('v1/candidate/getCandidateAvailabilityTemplate', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.candidate.getCandidateAvailabilityTemplate',
			input ?? {},
			'completed',
		);
		return response;
	};
