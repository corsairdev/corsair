import type { LushaEndpoints } from '..';
import { call } from './call';
import {
	LushaEndpointInputSchemas as Inputs,
	LushaEndpointOutputSchemas as Outputs,
} from './types';

export const getContactsEnrichJob: LushaEndpoints['jobsGetContactsEnrichJob'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'jobs.getContactsEnrichJob',
				input: Inputs.jobsGetContactsEnrichJob,
				output: Outputs.jobsGetContactsEnrichJob,
			},
			input,
			({ jobId }) => ({
				method: 'GET',
				path: `/v3/contacts/jobs/${encodeURIComponent(jobId)}`,
				// Polling is free, so a 5xx here is safe to retry.
				replayable: true,
			}),
			{
				log: (_parsed, result) => ({
					jobId: result.jobId ?? undefined,
					status: result.status ?? undefined,
				}),
			},
		);
