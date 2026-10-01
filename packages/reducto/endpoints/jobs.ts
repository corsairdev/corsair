import type { ReductoEndpoints } from '../index';
import { rememberJobStatus } from './cache';
import { callReducto } from './call';
import {
	CancelJobResponseSchema,
	DeleteJobInputSchema,
	DeleteJobResponseSchema,
	JobIdInputSchema,
	JobResponseSchema,
	ListJobsInputSchema,
	ListJobsResponseSchema,
} from './types';

export const get: ReductoEndpoints['getJob'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.jobs.get',
		JobIdInputSchema,
		JobResponseSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/job/{job_id}',
			path: { job_id: body.job_id },
		}),
		(body, response) => ({ jobId: body.job_id, status: response.status }),
	);
};

export const list: ReductoEndpoints['listJobs'] = async (ctx, input) => {
	return callReducto(
		ctx,
		'reducto.jobs.list',
		ListJobsInputSchema,
		ListJobsResponseSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/jobs',
			query: {
				exclude_configs: body.exclude_configs,
				cursor: body.cursor ?? undefined,
				limit: body.limit,
			},
		}),
		(_body, response) => ({ count: response.jobs.length }),
	);
};

export const cancel: ReductoEndpoints['cancelJob'] = async (ctx, input) => {
	const response = await callReducto(
		ctx,
		'reducto.jobs.cancel',
		JobIdInputSchema,
		CancelJobResponseSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/cancel/{job_id}',
			path: { job_id: body.job_id },
		}),
		(body) => ({ jobId: body.job_id }),
	);
	const parsed = JobIdInputSchema.parse(input);
	await rememberJobStatus(ctx, parsed.job_id, 'Cancelled');
	return response;
};

export const remove: ReductoEndpoints['deleteJob'] = async (ctx, input) => {
	const response = await callReducto(
		ctx,
		'reducto.jobs.delete',
		DeleteJobInputSchema,
		DeleteJobResponseSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: '/job/{job_id}',
			path: { job_id: body.job_id },
			query: { include_persisted: body.include_persisted },
		}),
		(body) => ({ jobId: body.job_id }),
	);
	return response;
};
