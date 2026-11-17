import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, linkupGet, linkupPost } from '../client';
import type { LinkupContext } from '../context';
import {
	LinkupCreditEntity,
	LinkupResponseEntity,
	LinkupSourceEntity,
} from '../schema/database';
import type {
	AnswerResponse,
	CreditResponse,
	EmptyInput,
	FetchInput,
	FetchResponse,
	QueryInput,
	ResponseInput,
	ResponsesResponse,
	SearchResponse,
} from './types';
import {
	FetchInputSchema,
	QueryInputSchema,
	ResponseInputSchema,
} from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

async function save<T extends { id: string }>(
	table:
		| { upsertByEntityId: (id: string, row: T) => Promise<unknown> }
		| undefined,
	row: T,
	label: string,
) {
	if (!table) return;
	try {
		await table.upsertByEntityId(row.id, row);
	} catch {
		console.warn(`Failed to save Linkup ${label}`);
	}
}

function sourcesOf(value: unknown) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		const row = asRecord(item);
		const source = LinkupSourceEntity.safeParse({
			id: text(row?.url),
			name: text(row?.name),
			type: text(row?.type),
			publishedAt: text(row?.publishedAt),
		});
		return source.success ? [source.data] : [];
	});
}

export const getCredits: CorsairEndpoint<
	LinkupContext,
	EmptyInput,
	CreditResponse
> = async (ctx) => {
	const body = asRecord(
		await linkupGet<unknown>(ctx.key, '/v1/credits/balance'),
	);
	const credit = LinkupCreditEntity.parse({
		id: 'balance',
		balance: body?.balance,
	});
	await save(ctx.db?.credits, credit, 'credit');
	await logEventFromContext(
		ctx,
		'linkup.credits.get',
		{ count: 1 },
		'completed',
	);
	return { credit };
};

export const search: CorsairEndpoint<
	LinkupContext,
	QueryInput,
	SearchResponse
> = async (ctx, input) => {
	const { q } = QueryInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(ctx.key, '/v1/search', {
			q,
			depth: 'fast',
			outputType: 'searchResults',
		}),
	);
	const results = sourcesOf(body?.results);
	for (const source of results) await save(ctx.db?.sources, source, 'source');
	await logEventFromContext(
		ctx,
		'linkup.search.run',
		{ count: results.length },
		'completed',
	);
	return { results };
};

export const getAnswer: CorsairEndpoint<
	LinkupContext,
	QueryInput,
	AnswerResponse
> = async (ctx, input) => {
	const { q } = QueryInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(ctx.key, '/v1/search', {
			q,
			depth: 'fast',
			outputType: 'sourcedAnswer',
		}),
	);
	const answer = text(body?.answer);
	if (!answer) throw new Error('Linkup answer response had no answer');
	const sources = sourcesOf(body?.sources);
	for (const source of sources) await save(ctx.db?.sources, source, 'source');
	await logEventFromContext(
		ctx,
		'linkup.answers.get',
		{ count: sources.length },
		'completed',
	);
	return { answer, sources };
};

export const fetchPage: CorsairEndpoint<
	LinkupContext,
	FetchInput,
	FetchResponse
> = async (ctx, input) => {
	const { url } = FetchInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(ctx.key, '/v1/fetch', { url }),
	);
	const markdown = text(body?.markdown);
	if (!markdown) throw new Error('Linkup fetch response had no markdown');
	await logEventFromContext(
		ctx,
		'linkup.pages.fetch',
		{ count: 1 },
		'completed',
	);
	return { markdown };
};

export const createResponse: CorsairEndpoint<
	LinkupContext,
	ResponseInput,
	ResponsesResponse
> = async (ctx, input) => {
	const parsed = ResponseInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(ctx.key, '/v1/responses', {
			input: parsed.input,
			model: parsed.model,
		}),
	);
	const response = LinkupResponseEntity.parse({
		id: text(body?.id),
		model: text(body?.model),
		object: text(body?.object),
	});
	await save(ctx.db?.responses, response, 'response');
	await logEventFromContext(
		ctx,
		'linkup.responses.create',
		{ count: 1 },
		'completed',
	);
	return { response };
};
