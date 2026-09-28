import { logEventFromContext } from 'corsair/core';
import type { TisaneEndpoints } from '..';
import { makeTisaneRequest } from '../client';
import type { TisaneParseResult, TisaneSettings, TisaneTopic } from './types';
import { TisaneEndpointOutputSchemas } from './types';

function normalizeTopic(topic: TisaneTopic): {
	topic: string;
	coverage?: number;
} {
	return typeof topic === 'string' ? { topic } : topic;
}

async function parseTisane(
	ctx: { key: string },
	input: { content: string; language: string },
	settings: TisaneSettings,
): Promise<TisaneParseResult> {
	const raw = await makeTisaneRequest<unknown>('parse', ctx.key, {
		method: 'POST',
		body: {
			content: input.content,
			language: input.language,
			settings,
		},
	});
	return TisaneEndpointOutputSchemas.textParse.parse(raw);
}

export const parse: TisaneEndpoints['textParse'] = async (ctx, input) => {
	const response = await parseTisane(ctx, input, input.settings ?? {});

	await logEventFromContext(
		ctx,
		'tisane.text.parse',
		{ language: input.language, content_length: input.content.length },
		'completed',
	);
	return response;
};

export const sentiment: TisaneEndpoints['textSentiment'] = async (
	ctx,
	input,
) => {
	const parsed = await parseTisane(ctx, input, {
		sentiment: true,
		snippets: true,
	});
	const response = TisaneEndpointOutputSchemas.textSentiment.parse({
		sentiment: parsed.sentiment_expressions ?? [],
		text: parsed.text,
	});

	await logEventFromContext(
		ctx,
		'tisane.text.sentiment',
		{ language: input.language, content_length: input.content.length },
		'completed',
	);
	return response;
};

export const moderate: TisaneEndpoints['textModerate'] = async (ctx, input) => {
	const parsed = await parseTisane(ctx, input, { abuse: true, snippets: true });
	const abuse = parsed.abuse ?? [];
	const response = TisaneEndpointOutputSchemas.textModerate.parse({
		abuse,
		flagged: abuse.length > 0,
	});

	await logEventFromContext(
		ctx,
		'tisane.text.moderate',
		{ language: input.language, content_length: input.content.length },
		'completed',
	);
	return response;
};

export const extractEntities: TisaneEndpoints['textExtractEntities'] = async (
	ctx,
	input,
) => {
	const parsed = await parseTisane(ctx, input, {
		entities: true,
		topics: true,
		snippets: true,
	});
	const response = TisaneEndpointOutputSchemas.textExtractEntities.parse({
		entities: parsed.entities_summary ?? [],
		topics: (parsed.topics ?? []).map(normalizeTopic),
	});

	await logEventFromContext(
		ctx,
		'tisane.text.extract_entities',
		{ language: input.language, content_length: input.content.length },
		'completed',
	);
	return response;
};
