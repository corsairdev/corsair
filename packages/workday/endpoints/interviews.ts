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
	>('v1/interviews/listInterviews', ctx.key, {
		method: 'GET',
		// Justification: The makeWorkdayRequest client expects a generic unknown record.
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.interviews.listInterviews',
		input ?? {},
		'completed',
	);
	return response;
};
