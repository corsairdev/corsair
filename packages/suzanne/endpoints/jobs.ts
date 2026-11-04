import type { SuzanneEndpoints } from '../index';
import { knownStatus } from '../schema/database';
import { callSuzanne } from './call';
import { rememberJob } from './persist';
import { CancelJobSchema, JobIdInputSchema, JobSchema } from './types';

export const get: SuzanneEndpoints['getJob'] = async (ctx, input) => {
	return callSuzanne(
		ctx,
		'suzanne.jobs.get',
		JobIdInputSchema,
		JobSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/v1/jobs/{job_id}',
			path: { job_id: body.job_id },
		}),
		async (body, job) => {
			const status = knownStatus(job.status);
			await rememberJob(ctx, {
				jobId: job.job_id,
				status,
				model: job.model,
				providerCreatedAt: job.created_at,
				updatedAt: job.updated_at,
				completedAt: job.completed_at,
				outputs: job.outputs?.map((output) => ({
					format: output.format,
					downloadUrl: output.download_url,
				})),
				errorCode: job.error?.code ?? null,
				errorMessage: job.error?.message ?? null,
			});
			return { jobId: body.job_id, status: job.status };
		},
	);
};

export const cancel: SuzanneEndpoints['cancelJob'] = async (ctx, input) => {
	return callSuzanne(
		ctx,
		'suzanne.jobs.cancel',
		JobIdInputSchema,
		CancelJobSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/v1/jobs/{job_id}/cancel',
			path: { job_id: body.job_id },
		}),
		async (body, result) => {
			if (!result.already_terminal) {
				const status = knownStatus(result.status);
				await rememberJob(ctx, { jobId: result.job_id, status });
			}
			return {
				jobId: body.job_id,
				alreadyTerminal: result.already_terminal,
			};
		},
	);
};
