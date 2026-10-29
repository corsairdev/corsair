import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	BatchesCancelResponse,
	BatchesCreateResponse,
	BatchesListResponse,
	BatchesRetrieveResponse,
} from '../schema/batches';

export const create: OpenaiEndpoints['batchesCreate'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<BatchesCreateResponse>(
		'batches',
		ctx.key,
		{
			method: 'POST',
			body: {
				input_file_id: input.inputFileId,
				endpoint: input.endpoint,
				completion_window: input.completionWindow,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.batches.create',
		{ inputFileId: input.inputFileId, endpoint: input.endpoint },
		'completed',
	);
	return result;
};

export const retrieve: OpenaiEndpoints['batchesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<BatchesRetrieveResponse>(
		`batches/${input.batchId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.batches.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancel: OpenaiEndpoints['batchesCancel'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<BatchesCancelResponse>(
		`batches/${input.batchId}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'openai.batches.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: OpenaiEndpoints['batchesList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<BatchesListResponse>(
		'batches',
		ctx.key,
		{ method: 'GET', query: { after: input.after, limit: input.limit } },
	);

	await logEventFromContext(
		ctx,
		'openai.batches.list',
		{ ...input },
		'completed',
	);
	return result;
};
