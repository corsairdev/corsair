import { logEventFromContext } from 'corsair/core';
import type { WebScrapingAIEndpoints } from '..';
import { makeWebScrapingAIRequest } from '../client';
import {
	AskQuestionInputSchema,
	ExtractFieldsInputSchema,
	ExtractFieldsResponseSchema,
	QuestionResponseSchema,
} from './types';

export const askQuestion: WebScrapingAIEndpoints['aiAskQuestion'] = async (
	ctx,
	rawInput,
) => {
	const input = AskQuestionInputSchema.parse(rawInput);
	const response = QuestionResponseSchema.parse(
		await makeWebScrapingAIRequest<unknown>('/ai/question', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'webscrapingai.ai.askQuestion',
		{ url: input.url },
		'completed',
	);
	return response;
};

export const extractFields: WebScrapingAIEndpoints['aiExtractFields'] = async (
	ctx,
	rawInput,
) => {
	const input = ExtractFieldsInputSchema.parse(rawInput);
	const response = ExtractFieldsResponseSchema.parse(
		await makeWebScrapingAIRequest<unknown>('/ai/fields', ctx.key, input),
	);
	await logEventFromContext(
		ctx,
		'webscrapingai.ai.extractFields',
		{ url: input.url, fields: Object.keys(input.fields) },
		'completed',
	);
	return response;
};
