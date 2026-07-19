import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const listJobs: WorkdayEndpoints['listJobs'] = async (ctx, input) => {
	const response = await makeWorkdayRequest<WorkdayEndpointOutputs['listJobs']>(
		'v1/jobs/api',
		ctx.key,
		{ method: 'POST', body: input as { [key: string]: unknown } },
	);
	await logEventFromContext(
		ctx,
		'workday.jobs.listJobs',
		input ?? {},
		'completed',
	);
	return response;
};
