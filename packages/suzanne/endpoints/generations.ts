import type { SuzanneEndpoints } from '../index';
import {
	callSuzanne,
	idempotencyHeaders,
	omitUndefined,
	rememberAccepted,
} from './call';
import {
	AcceptedJobSchema,
	PhotoTo3dInputSchema,
	TextTo3dInputSchema,
} from './types';

export const textTo3d: SuzanneEndpoints['textTo3d'] = async (ctx, input) => {
	return callSuzanne(
		ctx,
		'suzanne.generations.textTo3d',
		TextTo3dInputSchema,
		AcceptedJobSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/v1/generations/text-to-3d',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: omitUndefined({
				model: body.model,
				prompt: body.prompt,
				params: body.params,
				outputs: body.outputs,
			}),
		}),
		async (body, job) => {
			await rememberAccepted(ctx, job, body.model);
			return { jobId: job.job_id, model: body.model };
		},
	);
};

export const photoTo3d: SuzanneEndpoints['photoTo3d'] = async (ctx, input) => {
	return callSuzanne(
		ctx,
		'suzanne.generations.photoTo3d',
		PhotoTo3dInputSchema,
		AcceptedJobSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/v1/generations/photo-to-3d',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: omitUndefined({
				model: body.model,
				images_upload_ids: body.images_upload_ids,
				images_inline: body.images_inline,
				params: body.params,
				outputs: body.outputs,
			}),
		}),
		async (body, job) => {
			await rememberAccepted(ctx, job, body.model);
			return { jobId: job.job_id, model: body.model };
		},
	);
};
