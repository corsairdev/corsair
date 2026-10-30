import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	EnginesListResponse,
	EnginesRetrieveResponse,
	ModelsListResponse,
	ModelsRetrieveResponse,
} from '../schema/models';

export const list: OpenaiEndpoints['modelsList'] = async (ctx) => {
	const result = await makeOpenaiRequest<ModelsListResponse>(
		'models',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'openai.models.list', {}, 'completed');
	return result;
};

export const retrieve: OpenaiEndpoints['modelsRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ModelsRetrieveResponse>(
		`models/${input.model}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.models.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const listEngines: OpenaiEndpoints['enginesList'] = async (ctx) => {
	const result = await makeOpenaiRequest<EnginesListResponse>(
		'engines',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'openai.engines.list', {}, 'completed');
	return result;
};

export const retrieveEngine: OpenaiEndpoints['enginesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<EnginesRetrieveResponse>(
		`engines/${input.engineId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.engines.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};
