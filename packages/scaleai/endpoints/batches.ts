import { logEventFromContext } from 'corsair/core';
import type { ScaleAiEndpoints } from '..';
import { makeScaleAiRequest } from '../client';
import type {
	BatchStatusResponse,
	ListBatchesResponse,
	ScaleBatch,
} from './types';

function encodeName(name: string): string {
	return encodeURIComponent(name);
}

export const createBatch: ScaleAiEndpoints['createBatch'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleBatch>('batches', ctx.key, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'scaleai.batches.create',
		{ project: input.project, name: input.name },
		'completed',
	);
	return response;
};

export const finalizeBatch: ScaleAiEndpoints['finalizeBatch'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleBatch>(
		`batches/${encodeName(input.batchName)}/finalize`,
		ctx.key,
		{ method: 'POST' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.batches.finalize',
		{ batchName: input.batchName },
		'completed',
	);
	return response;
};

export const getBatch: ScaleAiEndpoints['getBatch'] = async (ctx, input) => {
	const response = await makeScaleAiRequest<ScaleBatch>(
		`batches/${encodeName(input.batchName)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.batches.get',
		{ batchName: input.batchName },
		'completed',
	);
	return response;
};

export const getBatchStatus: ScaleAiEndpoints['getBatchStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<BatchStatusResponse>(
		`batches/${encodeName(input.batchName)}/status`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.batches.getStatus',
		{ batchName: input.batchName, status: response.status },
		'completed',
	);
	return response;
};

export const listBatches: ScaleAiEndpoints['listBatches'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ListBatchesResponse>(
		'batches',
		ctx.key,
		{
			method: 'GET',
			query: { ...input },
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.batches.list',
		{ count: response.docs.length, has_more: response.has_more ?? false },
		'completed',
	);
	return response;
};
