import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const listJobs: WorkdayEndpoints['listJobs'] = async (ctx, input) => {
	const response = await makeWorkdayRequest<WorkdayEndpointOutputs['listJobs']>(
		'v1/jobs/api',
		ctx.key,
		{
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		},
	);
	await logEventFromContext(
		ctx,
		'workday.jobs.listJobs',
		input ?? {},
		'completed',
	);
	return response;
};
