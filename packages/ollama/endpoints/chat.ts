import { logEventFromContext } from 'corsair/core';
import type { OllamaEndpoints } from '..';
import { makeOllamaRequest } from '../client';
import type { ChatResponse, GenerateResponse } from './types';
import {
	ChatInputSchema,
	ChatResponseSchema,
	GenerateInputSchema,
	GenerateResponseSchema,
} from './types';

export const chat: OllamaEndpoints['chat'] = async (ctx, input) => {
	const validatedInput = ChatInputSchema.parse(input);
	const { stream: _stream, ...restInput } = validatedInput;

	const rawResponse = await makeOllamaRequest<ChatResponse>('/api/chat', ctx, {
		method: 'POST',
		body: {
			...restInput,
			stream: false,
		},
	});

	const response = ChatResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'ollama.chat.chat',
		validatedInput,
		'completed',
	);
	return response;
};

export const generate: OllamaEndpoints['generate'] = async (ctx, input) => {
	const validatedInput = GenerateInputSchema.parse(input);
	const { stream: _stream, ...restInput } = validatedInput;

	const rawResponse = await makeOllamaRequest<GenerateResponse>(
		'/api/generate',
		ctx,
		{
			method: 'POST',
			body: {
				...restInput,
				stream: false,
			},
		},
	);

	const response = GenerateResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'ollama.chat.generate',
		validatedInput,
		'completed',
	);
	return response;
};
