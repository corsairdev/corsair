import type { Pdf4meEndpoints } from '..';
import { call } from './call';
import {
	Pdf4meEndpointInputSchemas as Inputs,
	Pdf4meEndpointOutputSchemas as Outputs,
} from './types';

export const status: Pdf4meEndpoints['jobsStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.status',
			input: Inputs.jobsStatus,
			output: Outputs.jobsStatus,
		},
		input,
		({ jobId }) => ({
			method: 'POST',
			path: '/api/v2/GetActionStatus',
			body: { jobId },
		}),
		{
			log: (_, job) => ({
				jobId: job.jobId ?? undefined,
				finished: job.isFinished ?? undefined,
				success: job.isSuccess ?? undefined,
			}),
		},
	);
