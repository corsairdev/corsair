import { logEventFromContext } from 'corsair/core';
import type { OllamaEndpoints } from '..';
import { makeOllamaRequest } from '../client';
import type {
	CreateOpenAiChatCompletionResponse,
	CreateOpenAiCompletionResponse,
	ListOpenAiModelsResponse,
} from './types';
import {
	CreateOpenAiChatCompletionInputSchema,
	CreateOpenAiChatCompletionResponseSchema,
	CreateOpenAiCompletionInputSchema,
	CreateOpenAiCompletionResponseSchema,
	ListOpenAiModelsInputSchema,
	ListOpenAiModelsResponseSchema,
} from './types';

export const listOpenAiModels: OllamaEndpoints['listOpenAiModels'] = async (
	ctx,
	input,
) => {
	const validatedInput = ListOpenAiModelsInputSchema.parse(input);

	const rawResponse = await makeOllamaRequest<ListOpenAiModelsResponse>(
		'/v1/models',
		ctx,
		{ method: 'GET' },
	);

	const response = ListOpenAiModelsResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'ollama.openai.list_models',
		validatedInput,
		'completed',
	);
	return response;
};

export const createOpenAiChatCompletion: OllamaEndpoints['createOpenAiChatCompletion'] =
	async (ctx, input) => {
		const validatedInput = CreateOpenAiChatCompletionInputSchema.parse(input);
		const { stream: _stream, ...restInput } = validatedInput;

		const rawResponse =
			await makeOllamaRequest<CreateOpenAiChatCompletionResponse>(
				'/v1/chat/completions',
				ctx,
				{
					method: 'POST',
					body: {
						...restInput,
						stream: false,
					},
				},
			);

		const response =
			CreateOpenAiChatCompletionResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'ollama.openai.create_chat_completion',
			validatedInput,
			'completed',
		);
		return response;
	};

export const createOpenAiCompletion: OllamaEndpoints['createOpenAiCompletion'] =
	async (ctx, input) => {
		const validatedInput = CreateOpenAiCompletionInputSchema.parse(input);
		const { stream: _stream, ...restInput } = validatedInput;

		const rawResponse = await makeOllamaRequest<CreateOpenAiCompletionResponse>(
			'/v1/completions',
			ctx,
			{
				method: 'POST',
				body: {
					...restInput,
					stream: false,
				},
			},
		);

		const response = CreateOpenAiCompletionResponseSchema.parse(rawResponse);

		await logEventFromContext(
			ctx,
			'ollama.openai.create_completion',
			validatedInput,
			'completed',
		);
		return response;
	};
