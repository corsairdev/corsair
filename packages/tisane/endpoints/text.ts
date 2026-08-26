import { logEventFromContext } from 'corsair/core';
import type { TisaneEndpoints } from '..';
import type { TextExtractEntitiesResponse, TextModerateResponse, TextParseResponse, TextSentimentResponse } from './types';
import { makeTisaneRequest } from '../client';

export const parse: TisaneEndpoints['textParse'] = async (ctx, input) => {
	const response = await makeTisaneRequest<TextParseResponse>(
		'parse',
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				language: input.language,
				settings: input.settings ?? {},
			},
		},
	);

	await logEventFromContext(ctx, 'tisane.text.parse', { ...input }, 'completed');
	return response;
};

export const sentiment: TisaneEndpoints['textSentiment'] = async (ctx, input) => {
	const rawResponse = await makeTisaneRequest<TextParseResponse>(
		'parse',
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				language: input.language,
				settings: { fetch_sentiment: true },
			},
		},
	);

	const response: TextSentimentResponse = {
		sentiment: rawResponse.sentiment || [],
		text: rawResponse.text || input.content,
	};

	await logEventFromContext(ctx, 'tisane.text.sentiment', { ...input }, 'completed');
	return response;
};

export const moderate: TisaneEndpoints['textModerate'] = async (ctx, input) => {
	const rawResponse = await makeTisaneRequest<TextParseResponse>(
		'parse',
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				language: input.language,
				settings: { fetch_abuse: true },
			},
		},
	);

	const abuseList = rawResponse.abuse || [];
	const response: TextModerateResponse = {
		abuse: abuseList,
		flagged: abuseList.length > 0,
	};

	await logEventFromContext(ctx, 'tisane.text.moderate', { ...input }, 'completed');
	return response;
};

export const extractEntities: TisaneEndpoints['textExtractEntities'] = async (ctx, input) => {
	const rawResponse = await makeTisaneRequest<TextParseResponse>(
		'parse',
		ctx.key,
		{
			method: 'POST',
			body: {
				content: input.content,
				language: input.language,
				settings: { fetch_entities: true, fetch_topics: true },
			},
		},
	);

	const response: TextExtractEntitiesResponse = {
		entities: rawResponse.entities || [],
		topics: rawResponse.topics || [],
	};

	await logEventFromContext(ctx, 'tisane.text.extract_entities', { ...input }, 'completed');
	return response;
};
