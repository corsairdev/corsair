import { logEventFromContext } from 'corsair/core';
import type { ReplicateEndpoints } from '..';
import type {
	ReplicateEndpointOutputs,
} from './types';
import { makeReplicateRequest } from '../client';

export const createPrediction: ReplicateEndpoints['createPrediction'] = async (
	ctx,
	input,
) => {
	const response =
		await makeReplicateRequest<ReplicateEndpointOutputs['createPrediction']>(
			'predictions',
			ctx.key,
			{
				method: 'POST',
				body: {
					version: input.version,
					input: input.input,
					webhook: input.webhook,
					webhook_events_filter: input.webhook_events_filter,
				},
			},
		);

	await logEventFromContext(
		ctx,
		'replicate.predictions.create',
		{ version: input.version },
		'completed',
	);

	return response;
};

export const getPrediction: ReplicateEndpoints['getPrediction'] = async (
	ctx,
	input,
) => {
	const response =
		await makeReplicateRequest<ReplicateEndpointOutputs['getPrediction']>(
			`predictions/${encodeURIComponent(input.predictionId)}`,
			ctx.key,
			{ method: 'GET' },
		);

	await logEventFromContext(
		ctx,
		'replicate.predictions.get',
		{ predictionId: input.predictionId },
		'completed',
	);

	return response;
};

export const listPredictions: ReplicateEndpoints['listPredictions'] = async (
	ctx,
	input,
) => {
	const response =
		await makeReplicateRequest<ReplicateEndpointOutputs['listPredictions']>(
			'predictions',
			ctx.key,
			{
				method: 'GET',
				query: {
					created_after: input.createdAfter,
					created_before: input.createdBefore,
					source: input.source,
				},
			},
		);

	await logEventFromContext(
		ctx,
		'replicate.predictions.list',
		{ ...input },
		'completed',
	);

	return response;
};

export const cancelPrediction: ReplicateEndpoints['cancelPrediction'] =
	async (ctx, input) => {
		const response =
			await makeReplicateRequest<ReplicateEndpointOutputs['cancelPrediction']>(
				`predictions/${encodeURIComponent(input.predictionId)}/cancel`,
				ctx.key,
				{ method: 'POST' },
			);

		await logEventFromContext(
			ctx,
			'replicate.predictions.cancel',
			{ predictionId: input.predictionId },
			'completed',
		);

		return response;
	};