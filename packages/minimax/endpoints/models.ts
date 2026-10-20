import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	ModelsListAnthropicOutput,
	ModelsListOutput,
	ModelsRetrieveAnthropicOutput,
	ModelsRetrieveOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const list: MinimaxEndpoints['modelsList'] = async (ctx, input) => {
	MinimaxEndpointInputSchemas.modelsList.parse(input);

	const response = await makeMinimaxRequest<ModelsListOutput>(
		'/v1/models',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = MinimaxEndpointOutputSchemas.modelsList.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.models.list',
		{ count: parsed.data.length },
		'completed',
	);

	return parsed;
};

export const retrieve: MinimaxEndpoints['modelsRetrieve'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.modelsRetrieve.parse(input);

	const response = await makeMinimaxRequest<ModelsRetrieveOutput>(
		`/v1/models/${encodeURIComponent(parsedInput.model_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = MinimaxEndpointOutputSchemas.modelsRetrieve.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.models.retrieve',
		{ modelId: parsedInput.model_id },
		'completed',
	);

	return parsed;
};

export const listAnthropic: MinimaxEndpoints['modelsListAnthropic'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MinimaxEndpointInputSchemas.modelsListAnthropic.parse(input);

	const response = await makeMinimaxRequest<ModelsListAnthropicOutput>(
		'/anthropic/v1/models',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: parsedInput.limit,
				after_id: parsedInput.after_id,
				before_id: parsedInput.before_id,
			},
		},
	);

	const parsed =
		MinimaxEndpointOutputSchemas.modelsListAnthropic.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.models.listAnthropic',
		{ count: parsed.data.length, hasMore: parsed.has_more ?? false },
		'completed',
	);

	return parsed;
};

export const retrieveAnthropic: MinimaxEndpoints['modelsRetrieveAnthropic'] =
	async (ctx, input) => {
		const parsedInput =
			MinimaxEndpointInputSchemas.modelsRetrieveAnthropic.parse(input);

		const response = await makeMinimaxRequest<ModelsRetrieveAnthropicOutput>(
			`/anthropic/v1/models/${encodeURIComponent(parsedInput.model_id)}`,
			ctx.key,
			{ method: 'GET' },
		);

		const parsed =
			MinimaxEndpointOutputSchemas.modelsRetrieveAnthropic.parse(response);

		await logEventFromContext(
			ctx,
			'minimax.models.retrieveAnthropic',
			{ modelId: parsedInput.model_id },
			'completed',
		);

		return parsed;
	};
