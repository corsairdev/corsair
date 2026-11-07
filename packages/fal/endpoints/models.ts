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

/**
 * Runs a model through fal's queue and waits a little for the output. A
 * blocking call would outlast the caller for a video that takes minutes, and
 * fal would bill for an output nobody receives; through the queue, a run
 * still going comes back with its response_url, a job the caller follows.
 */
export const run: FalEndpoints['modelsRun'] = async (ctx, rawInput) => {
	const { waitSeconds = MODELS_RUN_DEFAULT_WAIT_S, ...input } =
		FalEndpointInputSchemas.modelsRun.parse(rawInput);
	const submitted = await submitToQueue(ctx.key, input);
	const { basePath } = requestBasePath({ responseUrl: submitted.response_url });

	// fal pushes status changes over its status stream and ends it on
	// COMPLETED, so the wait ends the moment the run does. Where the stream
	// can't be used, the status is polled instead.
	const deadline = Date.now() + waitSeconds * 1000;
	const streamed = await waitOnStatusStream(
		ctx.key,
		basePath,
		deadline - Date.now(),
	);
	let current = await readQueueStatus(ctx.key, basePath);
	if (streamed === 'unavailable') {
		let interval = 500;
		while (stillRunning(current) && Date.now() + interval < deadline) {
			await sleep(interval);
			interval = Math.min(interval * 1.5, 2000);
			current = await readQueueStatus(ctx.key, basePath);
		}
	}

	const response = FalEndpointOutputSchemas.modelsRun.parse({
		...current,
		request_id: submitted.request_id,
		response_url: submitted.response_url,
		status_url: submitted.status_url ?? current.status_url,
		cancel_url: submitted.cancel_url ?? current.cancel_url,
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
