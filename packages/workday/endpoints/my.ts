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
	>('v1/my/getMyJobPostings', ctx.key, {
		method: 'GET',
		// Justification: The makeWorkdayRequest client expects a generic unknown record.
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.my.getMyJobPostings',
		input ?? {},
		'completed',
	);
	return response;
};
