import { logEventFromContext } from 'corsair/core';
import type { CloudlayerEndpoints } from '..';
import { makeCloudlayerRequest } from '../client';
import type { JobsGetOutput, JobsListOutput } from './types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './types';

type JobsListContext = Parameters<CloudlayerEndpoints['jobs']['list']>[0];
type JobsListInput = Parameters<CloudlayerEndpoints['jobs']['list']>[1];

async function listJobs(
	ctx: JobsListContext,
	input: JobsListInput,
	apiVersion: 'v1' | 'v2',
	eventName: 'cloudlayer.jobs.list' | 'cloudlayer.jobs.listV2',
): Promise<JobsListOutput> {
	const parsedInput = CloudlayerEndpointInputSchemas['jobs.list'].parse(input);

	const response = await makeCloudlayerRequest<JobsListOutput>(
		'/jobs',
		ctx.key,
		{
			method: 'GET',
			apiVersion,
			query: {
				limit: parsedInput.limit,
				startAfterId: parsedInput.startAfterId,
			},
		},
	);

	const parsed = CloudlayerEndpointOutputSchemas['jobs.list'].parse(response);

	await logEventFromContext(
		ctx,
		eventName,
		{ count: parsed.length },
		'completed',
	);

	return parsed;
}

// https://cloudlayer.io/docs/jobs/ — GET /v1/jobs
export const jobsList: CloudlayerEndpoints['jobs']['list'] = async (
	ctx,
	input,
) => {
	return listJobs(ctx, input, 'v1', 'cloudlayer.jobs.list');
};

// https://cloudlayer.io/docs/jobs/ — GET /v2/jobs
export const jobsListV2: CloudlayerEndpoints['jobs']['listV2'] = async (
	ctx,
	input,
) => listJobs(ctx, input, 'v2', 'cloudlayer.jobs.listV2');

// https://cloudlayer.io/docs/jobs/ — GET /v2/jobs/:id
export const jobsGet: CloudlayerEndpoints['jobs']['get'] = async (
	ctx,
	input,
) => {
	const parsedInput = CloudlayerEndpointInputSchemas['jobs.get'].parse(input);

	const response = await makeCloudlayerRequest<JobsGetOutput>(
		`/jobs/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = CloudlayerEndpointOutputSchemas['jobs.get'].parse(response);

	// `apiKeyUsed` sits in the job payload, so nothing from the body is logged.
	await logEventFromContext(
		ctx,
		'cloudlayer.jobs.get',
		{ count: 1 },
		'completed',
	);

	return parsed;
};
