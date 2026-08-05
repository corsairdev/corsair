import { logEventFromContext } from 'corsair/core';
import type { GeminiEndpoints } from '..';
import { makeGeminiRequest } from '../client';
import { stripMarkdownFences } from './text-utils';
import type {
	CountTokensResponse,
	EmbedContentResponse,
	GenerateContentResponse,
} from './types';

export { stripMarkdownFences } from './text-utils';

export const countTokens: GeminiEndpoints['countTokens'] = async (
	ctx,
	input,
) => {
	const response = await makeGeminiRequest<CountTokensResponse>(
		// Generative Language API requires the /models/ segment for model-scoped methods
		`/models/${input.model}:countTokens`,
		ctx.key,
		{
			method: 'POST',
			body: { contents: input.contents },
		},
	);

	await logEventFromContext(
		ctx,
		'gemini.content.countTokens',
		{ ...input },
		'completed',
	);
	return response;
};

export const embedContent: GeminiEndpoints['embedContent'] = async (
	ctx,
	input,
) => {
	const response = await makeGeminiRequest<EmbedContentResponse>(
		// Generative Language API requires the /models/ segment for model-scoped methods
		`/models/${input.model}:embedContent`,
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				taskType: input.taskType,
				title: input.title,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'gemini.content.embedContent',
		{ ...input },
		'completed',
	);
	return response;
};

export const generateContent: GeminiEndpoints['generateContent'] = async (
	ctx,
	input,
) => {
	const response = await makeGeminiRequest<
		Omit<GenerateContentResponse, 'text'>
		// Generative Language API requires the /models/ segment for model-scoped methods
	>(`/models/${input.model}:generateContent`, ctx.key, {
		method: 'POST',
		body: {
			contents: input.contents,
			generationConfig: input.generationConfig,
			safetySettings: input.safetySettings,
			systemInstruction: input.systemInstruction,
		},
	});

	const firstText = response.candidates?.[0]?.content?.parts?.find(
		(part) => typeof part.text === 'string',
	)?.text;

	await logEventFromContext(
		ctx,
		'gemini.content.generateContent',
		{ ...input },
		'completed',
	);
	return {
		...response,
		text: firstText !== undefined ? stripMarkdownFences(firstText) : undefined,
	};
};
