import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	FineTuningCancelJobResponse,
	FineTuningCreateJobResponse,
	FineTuningListCheckpointsResponse,
	FineTuningListEventsResponse,
	FineTuningListJobsResponse,
	FineTuningRetrieveJobResponse,
} from '../schema/fine-tuning';

export const createJob: OpenaiEndpoints['fineTuningCreateJob'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FineTuningCreateJobResponse>(
		'fine_tuning/jobs',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				training_file: input.trainingFile,
				validation_file: input.validationFile,
				hyperparameters: input.hyperparameters,
				suffix: input.suffix,
				integrations: input.integrations,
				seed: input.seed,
				method: input.method,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.fineTuning.createJob',
		{ model: input.model, trainingFile: input.trainingFile },
		'completed',
	);
	return result;
};

/**
 * OpenAI filters fine-tuning jobs by metadata via `metadata[key]=value` query
 * entries. Flatten the record into those keys so callers' filters actually
 * reach the API instead of being silently dropped.
 */
export function flattenMetadataQuery(
	metadata: Record<string, string> | undefined,
): Record<string, string> {
	if (!metadata) return {};
	const out: Record<string, string> = {};
	for (const [key, value] of Object.entries(metadata)) {
		out[`metadata[${key}]`] = value;
	}
	return out;
}

export const listJobs: OpenaiEndpoints['fineTuningListJobs'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FineTuningListJobsResponse>(
		'fine_tuning/jobs',
		ctx.key,
		{
			method: 'GET',
			query: {
				after: input.after,
				limit: input.limit,
				...flattenMetadataQuery(input.metadata),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.fineTuning.listJobs',
		{ after: input.after, limit: input.limit },
		'completed',
	);
	return result;
};

export const retrieveJob: OpenaiEndpoints['fineTuningRetrieveJob'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FineTuningRetrieveJobResponse>(
		`fine_tuning/jobs/${input.jobId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.fineTuning.retrieveJob',
		{ jobId: input.jobId },
		'completed',
	);
	return result;
};

export const listCheckpoints: OpenaiEndpoints['fineTuningListCheckpoints'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<FineTuningListCheckpointsResponse>(
			`fine_tuning/jobs/${input.jobId}/checkpoints`,
			ctx.key,
			{
				method: 'GET',
				query: { after: input.after, limit: input.limit },
			},
		);

		await logEventFromContext(
			ctx,
			'openai.fineTuning.listCheckpoints',
			{ jobId: input.jobId, after: input.after, limit: input.limit },
			'completed',
		);
		return result;
	};

export const listEvents: OpenaiEndpoints['fineTuningListEvents'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FineTuningListEventsResponse>(
		`fine_tuning/jobs/${input.jobId}/events`,
		ctx.key,
		{
			method: 'GET',
			query: { after: input.after, limit: input.limit },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.fineTuning.listEvents',
		{ jobId: input.jobId, after: input.after, limit: input.limit },
		'completed',
	);
	return result;
};

export const cancelJob: OpenaiEndpoints['fineTuningCancelJob'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<FineTuningCancelJobResponse>(
		`fine_tuning/jobs/${input.jobId}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'openai.fineTuning.cancelJob',
		{ jobId: input.jobId },
		'completed',
	);
	return result;
};
