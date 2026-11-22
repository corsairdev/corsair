import type { Pdf4meEndpoints } from '..';
import { call } from './call';
import {
	Pdf4meEndpointInputSchemas as Inputs,
	Pdf4meEndpointOutputSchemas as Outputs,
	shapeJobStatus,
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
		// GET with the job id in the query (POST answers 405). A running job
		// answers JSON; a finished one answers the produced file (live).
		({ jobId }) => ({
			method: 'GET',
			path: '/api/v2/GetActionStatus',
			query: { id: jobId },
			binary: true,
		}),
		{
			shape: (raw, { jobId }) => shapeJobStatus(raw, jobId),
			log: (_, job) => ({
				jobId: job.jobId ?? undefined,
				finished: job.isFinished ?? undefined,
			}),
		},
	);
