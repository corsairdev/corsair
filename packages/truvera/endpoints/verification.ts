import type { TruveraEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './types';

/**
 * Verifies a credential or presentation. Truvera answers a `verified` flag and,
 * when it fails, the reasons; the call itself succeeds either way.
 */
export const verify: TruveraEndpoints['verify'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'verify',
			input: TruveraEndpointInputSchemas.verify,
			output: TruveraEndpointOutputSchemas.verify,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'verify',
			body: parsed.credential,
		}),
		{
			log: (_parsed, result) => ({
				verified: result.verified ?? false,
				errors: result.errors?.length ?? 0,
			}),
		},
	);

/**
 * Reads an async job. Credential issuance and registry writes can answer with a
 * job id instead of the finished resource, and this is how it is read back.
 */
export const getJob: TruveraEndpoints['jobsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.get',
			input: TruveraEndpointInputSchemas.getJob,
			output: TruveraEndpointOutputSchemas.getJob,
		},
		input,
		(parsed) => ({ method: 'GET', path: `jobs/${segment(parsed.job_id)}` }),
		{
			log: (parsed, result) => ({
				job_id: parsed.job_id,
				status: result.status ?? undefined,
			}),
		},
	);
