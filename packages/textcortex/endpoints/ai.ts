import type { TextCortexEndpoints } from '..';
import { call } from './call';
import {
	ChatCompletionsInputSchema,
	ChatCompletionsResponseSchema,
	ImagesCreateInputSchema,
	ImagesCreateResponseSchema,
	ResponsesInputSchema,
	ResponsesResponseSchema,
	WebSearchInputSchema,
	WebSearchResponseSchema,
} from './types';

export const chatCompletions: TextCortexEndpoints['chatCompletions'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'chat.completions',
			input: ChatCompletionsInputSchema,
			output: ChatCompletionsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/chat/completions',
			body: parsed,
		}),
	);
};

export const responsesCreate: TextCortexEndpoints['responsesCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'responses.create',
			input: ResponsesInputSchema,
			output: ResponsesResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/responses',
			// TextCortex stores no conversation, so store is pinned false rather
			// than left to the provider's default.
			body: { ...parsed, store: false },
		}),
	);
};

export const imagesCreate: TextCortexEndpoints['imagesCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'images.create',
			input: ImagesCreateInputSchema,
			output: ImagesCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/images/generations',
			body: parsed,
		}),
	);
};

export const webSearch: TextCortexEndpoints['webSearch'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'web.search',
			input: WebSearchInputSchema,
			output: WebSearchResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/web/search',
			body: parsed,
		}),
	);
};
