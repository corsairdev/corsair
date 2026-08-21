import { logEventFromContext } from 'corsair/core';
import { makeGroqcloudRequest } from '../client';
import type { GroqcloudEndpoints } from '../index';
import type {
	ModelsListModelsResponse,
	ModelsRetrieveModelResponse,
} from '../schema/models';

export const listModels: GroqcloudEndpoints['modelsListModels'] = async (
	ctx,
) => {
	const result = await makeGroqcloudRequest<ModelsListModelsResponse>(
		'models',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'groqcloud.models.listModels',
		{},
		'completed',
	);

	return result;
};

export const retrieveModel: GroqcloudEndpoints['modelsRetrieveModel'] = async (
	ctx,
	input,
) => {
	const result = await makeGroqcloudRequest<ModelsRetrieveModelResponse>(
		`models/${input.model}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'groqcloud.models.retrieveModel',
		{ model: input.model },
		'completed',
	);

	return result;
};
