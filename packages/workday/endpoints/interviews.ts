import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const listInterviews: WorkdayEndpoints['listInterviews'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['listInterviews']
	>('v1/interviews/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.interviews.listInterviews',
		input ?? {},
		'completed',
	);
	return response;
};
