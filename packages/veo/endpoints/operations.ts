import { logEventFromContext } from 'corsair/core';
import type { VeoEndpoints } from '..';
import { fetchOperation } from './predict';
import type { VeoOperation } from './types';
import { VeoEndpointInputSchemas } from './types';

// POST .../models/MODEL_ID:fetchPredictOperation
// https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-text

const DEFAULT_POLL_INTERVAL_MS = 15_000;
const DEFAULT_TIMEOUT_MS = 360_000;

export const operationsGet: VeoEndpoints['operations']['get'] = async (
	ctx,
	input,
) => {
	const parsed = VeoEndpointInputSchemas.operationsGet.parse(input);
	let operation: VeoOperation;
	try {
		operation = await fetchOperation(ctx, parsed);
	} catch (error) {
		await logEventFromContext(
			ctx,
			'veo.operations.get',
			{ operationName: parsed.operationName },
			'failed',
		);
		throw error;
	}
	await logEventFromContext(
		ctx,
		'veo.operations.get',
		{ operationName: parsed.operationName, done: operation.done ?? false },
		operation.error ? 'failed' : 'completed',
	);
	return operation;
};

export const operationsWait: VeoEndpoints['operations']['wait'] = async (
	ctx,
	input,
) => {
	const parsed = VeoEndpointInputSchemas.operationsWait.parse(input);
	const pollIntervalMs = parsed.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
	const timeoutMs = parsed.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const deadline = Date.now() + timeoutMs;

	let operation: VeoOperation;
	try {
		operation = await fetchOperation(ctx, parsed);
		while (
			!operation.done &&
			!operation.error &&
			Date.now() + pollIntervalMs <= deadline
		) {
			await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
			operation = await fetchOperation(ctx, parsed);
		}
	} catch (error) {
		await logEventFromContext(
			ctx,
			'veo.operations.wait',
			{ operationName: parsed.operationName },
			'failed',
		);
		throw error;
	}

	const status = operation.error
		? 'failed'
		: operation.done
			? 'completed'
			: 'pending';
	await logEventFromContext(
		ctx,
		'veo.operations.wait',
		{ operationName: parsed.operationName, done: operation.done ?? false },
		status,
	);
	return operation;
};
