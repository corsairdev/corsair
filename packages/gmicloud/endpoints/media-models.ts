import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['mediaModelsList'] = async (
	ctx,
	input,
) => {
	GmicloudEndpointInputSchemas.mediaModelsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.mediaModelsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/ie/requestqueue/apikey/models',
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.mediaModels.list',
		{ count: result.model_ids.length },
		'completed',
	);
	return result;
};

export const get: GmicloudEndpoints['mediaModelsGet'] = async (ctx, input) => {
	const { model_id } = GmicloudEndpointInputSchemas.mediaModelsGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.mediaModelsGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/ie/requestqueue/apikey/models/{model_id}',
			path: { model_id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.mediaModels.get',
		{ model_id },
		'completed',
	);
	return result;
};
