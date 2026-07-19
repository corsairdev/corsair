import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getMyJobPostings: WorkdayEndpoints['getMyJobPostings'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getMyJobPostings']
	>('v1/my/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.my.getMyJobPostings',
		input ?? {},
		'completed',
	);
	return response;
};
