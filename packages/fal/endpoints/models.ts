import { logEventFromContext } from 'corsair/core';
import { endpointPath, makeFalRequest } from '../client';
import type { FalEndpoints } from '../index';
import { FalEndpointInputSchemas, FalEndpointOutputSchemas } from './types';

export const run: FalEndpoints['modelsRun'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.modelsRun.parse(rawInput);
	const response = FalEndpointOutputSchemas.modelsRun.parse(
		await makeFalRequest('run', endpointPath(input.endpointId), ctx.key, {
			method: 'POST',
			body: input.input,
			headers: {
				'X-Fal-Request-Start-Timeout':
					input.startTimeout !== undefined
						? String(input.startTimeout)
						: undefined,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.models.run',
		{ endpointId: input.endpointId },
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
