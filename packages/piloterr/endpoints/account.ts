import type { PiloterrEndpoints } from '..';
import { call } from './call';
import {
	PiloterrEndpointInputSchemas as Inputs,
	PiloterrEndpointOutputSchemas as Outputs,
} from './types';

export const usage: PiloterrEndpoints['usageGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'usage.get',
			input: Inputs.usageGet,
			output: Outputs.usageGet,
		},
		input,
		() => ({ method: 'GET', path: '/v2/usage' }),
		{ log: (_, usage) => ({ remaining: usage.remaining }) },
	);

export const getJob: PiloterrEndpoints['jobsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.get',
			input: Inputs.jobsGet,
			output: Outputs.jobsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/v1/jobs/${encodeURIComponent(id)}`,
		}),
		{
			log: (_, job) => ({
				jobId: job.id ?? undefined,
				status: job.status ?? undefined,
				progress: job.progress ?? undefined,
			}),
		},
	);
