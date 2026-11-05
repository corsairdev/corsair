import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	ChatCompletionOutput,
	CreateResponseOutput,
	EstimateInputTokensOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const completion: MinimaxEndpoints['chatCompletion'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.chatCompletion.parse(input);

	const response = await makeMinimaxRequest<ChatCompletionOutput>(
		'/v1/text/chatcompletion_v2',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.chatCompletion.parse(response);

	// Never log prompt or completion content: the event carries only the model
	// and how many messages were sent.
	await logEventFromContext(
		ctx,
		'minimax.chat.completion',
		{ model: parsedInput.model, messageCount: parsedInput.messages.length },
		'completed',
	);

	return parsed;
};

export const createResponse: MinimaxEndpoints['chatCreateResponse'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MinimaxEndpointInputSchemas.chatCreateResponse.parse(input);

	const response = await makeMinimaxRequest<CreateResponseOutput>(
		'/v1/responses',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed =
		MinimaxEndpointOutputSchemas.chatCreateResponse.parse(response);

	// Input/output text is user content; log the model and terminal status only.
	await logEventFromContext(
		ctx,
		'minimax.chat.createResponse',
		{ model: parsedInput.model, status: parsed.status ?? 'unknown' },
		'completed',
	);

	return parsed;
};

export const estimateInputTokens: MinimaxEndpoints['chatEstimateInputTokens'] =
	async (ctx, input) => {
		const parsedInput =
			MinimaxEndpointInputSchemas.chatEstimateInputTokens.parse(input);

		const response = await makeMinimaxRequest<EstimateInputTokensOutput>(
			'/v1/responses/input_tokens',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			MinimaxEndpointOutputSchemas.chatEstimateInputTokens.parse(response);

		await logEventFromContext(
			ctx,
			'minimax.chat.estimateInputTokens',
			{ model: parsedInput.model, inputTokens: parsed.input_tokens },
			'completed',
		);

		return parsed;
	};
