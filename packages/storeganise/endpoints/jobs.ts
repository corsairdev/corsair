import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

// Webhook data carries jobId (move-ins, valet orders); the access-control
// guide retrieves the job by that id and reads job.result.siteId.
export const get: StoreganiseEndpoints['jobsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.get',
			input: Inputs.jobsGet,
			output: Outputs.jobsGet,
		},
		input,
		({ jobId }, base) => ({
			method: 'GET',
			base,
			path: `/admin/jobs/${encodeURIComponent(jobId)}`,
		}),
		{
			log: (_, job) => ({ jobId: job.id }),
		},
	);
