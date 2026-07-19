import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCandidateAvailabilityTemplate: WorkdayEndpoints['getCandidateAvailabilityTemplate'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getCandidateAvailabilityTemplate']
		>('v1/candidate/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.candidate.getCandidateAvailabilityTemplate',
			input ?? {},
			'completed',
		);
		return response;
	};
