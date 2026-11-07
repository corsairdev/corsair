import { logEventFromContext } from 'corsair/core';
import { makeFalRequest, requestBasePath, waitOnStatusStream } from '../client';
import type { FalEndpoints } from '../index';
import { readQueueStatus, submitToQueue } from './queue';
import type { QueueStatusResponse } from './types';
import {
	FalEndpointInputSchemas,
	FalEndpointOutputSchemas,
	MODELS_RUN_DEFAULT_WAIT_S,
} from './types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const stillRunning = (status: QueueStatusResponse) =>
	status.state === 'IN_QUEUE' || status.state === 'IN_PROGRESS';

// Time kept back from the stream for the closing status (and result) read.
const READ_RESERVE_MS = 2_500;

/**
 * Reads the run's status if that finishes by `deadline`; null when it
 * doesn't, or fails. After fal has accepted a paid run, a read problem must
 * not throw: the caller (or its retry handler) would lose the run or submit
 * it again. The run is answered as the job it is instead.
 */
async function readBy(
	key: string,
	basePath: string,
	deadline: number,
): Promise<QueueStatusResponse | null> {
	const left = deadline - Date.now();
	if (left <= 0) return null;
	const read = readQueueStatus(key, basePath).catch(() => null);
	let timer: ReturnType<typeof setTimeout> | undefined;
	const late = new Promise<null>((resolve) => {
		timer = setTimeout(() => resolve(null), left);
	});
	try {
		return await Promise.race([read, late]);
	} finally {
		clearTimeout(timer);
	}
}

/**
 * Runs a model through fal's queue and waits a little for the output. A
 * blocking call would outlast the caller for a video that takes minutes, and
 * fal would bill for an output nobody receives; through the queue, a run
 * still going comes back with its response_url, a job the caller follows.
 * Everything after the submit fits inside `waitSeconds`.
 */
export const run: FalEndpoints['modelsRun'] = async (ctx, rawInput) => {
	const { waitSeconds = MODELS_RUN_DEFAULT_WAIT_S, ...input } =
		FalEndpointInputSchemas.modelsRun.parse(rawInput);
	const submitted = await submitToQueue(ctx.key, input);
	const { basePath } = requestBasePath({ responseUrl: submitted.response_url });

	// fal pushes status changes over its status stream and ends it on
	// COMPLETED, so the wait ends the moment the run does. Where the stream
	// can't be used, the status is polled instead.
	const budget = waitSeconds * 1000;
	const deadline = Date.now() + budget;
	const reserve = Math.min(READ_RESERVE_MS, budget / 2);
	const streamed = await waitOnStatusStream(
		ctx.key,
		basePath,
		deadline - reserve - Date.now(),
	);
	let current = await readBy(ctx.key, basePath, deadline);
	if (streamed === 'unavailable') {
		let interval = 500;
		while (
			current &&
			stillRunning(current) &&
			Date.now() + interval + reserve < deadline
		) {
			await sleep(interval);
			interval = Math.min(interval * 1.5, 2000);
			current = (await readBy(ctx.key, basePath, deadline)) ?? current;
		}
	}

	// Without a read in time, the run is answered where the submit left it.
	const known = current ?? { ...submitted, state: 'IN_QUEUE' as const };
	const response = FalEndpointOutputSchemas.modelsRun.parse({
		...known,
		request_id: submitted.request_id,
		response_url: submitted.response_url,
		status_url: submitted.status_url ?? known.status_url,
		cancel_url: submitted.cancel_url ?? known.cancel_url,
	});
	await logEventFromContext(
		ctx,
		'fal.models.run',
		{
			endpointId: input.endpointId,
			requestId: response.request_id,
			state: response.state,
		},
		'completed',
	);
	return response;
};

export const search: FalEndpoints['modelsSearch'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.modelsSearch.parse(rawInput);
	const response = FalEndpointOutputSchemas.modelsSearch.parse(
		await makeFalRequest('api', '/models', ctx.key, {
			method: 'GET',
			query: {
				q: input.query,
				category: input.category,
				status: input.status,
				endpoint_id: input.endpointIds,
				sort: input.sort,
				expand: input.includeOpenApi ? 'openapi-3.0' : undefined,
				limit: input.limit,
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.models.search',
		{ query: input.query, category: input.category },
		'completed',
	);
	return response;
};

export const pricing: FalEndpoints['modelsPricing'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.modelsPricing.parse(rawInput);
	const response = FalEndpointOutputSchemas.modelsPricing.parse(
		await makeFalRequest('api', '/models/pricing', ctx.key, {
			method: 'GET',
			query: { endpoint_id: input.endpointIds },
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.models.pricing',
		{ endpointIds: input.endpointIds },
		'completed',
	);
	return response;
};

export const estimateCost: FalEndpoints['modelsEstimateCost'] = async (
	ctx,
	rawInput,
) => {
	const input = FalEndpointInputSchemas.modelsEstimateCost.parse(rawInput);
	const quantityField =
		input.estimateType === 'historical_api_price'
			? 'call_quantity'
			: 'unit_quantity';
	const endpoints = Object.fromEntries(
		Object.entries(input.endpoints).map(([endpointId, { quantity }]) => [
			endpointId,
			{ [quantityField]: quantity },
		]),
	);
	const response = FalEndpointOutputSchemas.modelsEstimateCost.parse(
		await makeFalRequest('api', '/models/pricing/estimate', ctx.key, {
			method: 'POST',
			body: { estimate_type: input.estimateType, endpoints },
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.models.estimateCost',
		{ estimateType: input.estimateType },
		'completed',
	);
	return response;
};
