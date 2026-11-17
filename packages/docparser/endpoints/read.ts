import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, docparserGet } from '../client';
import type { DocparserContext } from '../context';
import {
	DocparserModelEntity,
	DocparserParserEntity,
	DocparserPingEntity,
	DocparserResultEntity,
} from '../schema/database';
import type {
	EmptyInput,
	ModelListResponse,
	ParserIdInput,
	ParserListResponse,
	PingResponse,
	ResultListResponse,
	ResultsInput,
} from './types';
import { ParserIdInputSchema, ResultsInputSchema } from './types';

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
		console.warn(`Failed to save Docparser ${label}`);
	}
}

function listOf(body: unknown, label: string): unknown[] {
	if (!Array.isArray(body)) {
		throw new Error(`Docparser ${label} response was not a list`);
	}
	return body;
}

export const ping: CorsairEndpoint<
	DocparserContext,
	EmptyInput,
	PingResponse
> = async (ctx) => {
	const body = asRecord(await docparserGet<unknown>(ctx.key, '/v1/ping'));
	const row = DocparserPingEntity.parse({
		id: 'ping',
		msg: text(body?.msg),
	});
	await save(ctx.db?.pings, row, 'ping');
	await logEventFromContext(ctx, 'docparser.ping', { count: 1 }, 'completed');
	return { ping: row };
};

export const listParsers: CorsairEndpoint<
	DocparserContext,
	EmptyInput,
	ParserListResponse
> = async (ctx) => {
	const parsers = listOf(
		await docparserGet<unknown>(ctx.key, '/v1/parsers'),
		'parsers',
	).flatMap((item) => {
		const row = asRecord(item);
		const parser = DocparserParserEntity.safeParse({
			id: text(row?.id),
			label: text(row?.label),
		});
		return parser.success ? [parser.data] : [];
	});
	for (const parser of parsers) await save(ctx.db?.parsers, parser, 'parser');
	await logEventFromContext(
		ctx,
		'docparser.parsers.list',
		{ count: parsers.length },
		'completed',
	);
	return { parsers };
};

export const listModels: CorsairEndpoint<
	DocparserContext,
	ParserIdInput,
	ModelListResponse
> = async (ctx, input) => {
	const { id } = ParserIdInputSchema.parse(input);
	const models = listOf(
		await docparserGet<unknown>(ctx.key, `/v1/parser/models/${id}`),
		'models',
	).flatMap((item) => {
		const row = asRecord(item);
		const modelId = text(row?.id);
		const model = DocparserModelEntity.safeParse({
			id: modelId ? `${id}:${modelId}` : undefined,
			label: text(row?.label),
			parserId: id,
		});
		return model.success ? [model.data] : [];
	});
	for (const model of models) await save(ctx.db?.models, model, 'model');
	await logEventFromContext(
		ctx,
		'docparser.models.list',
		{ count: models.length },
		'completed',
	);
	return { models };
};

export const listResults: CorsairEndpoint<
	DocparserContext,
	ResultsInput,
	ResultListResponse
> = async (ctx, input) => {
	const parsed = ResultsInputSchema.parse(input);
	const results = listOf(
		await docparserGet<unknown>(ctx.key, `/v1/results/${parsed.id}`, {
			limit: parsed.limit,
			offset: parsed.offset,
		}),
		'results',
	).flatMap((item) => {
		const row = asRecord(item);
		const result = DocparserResultEntity.safeParse({
			id: text(row?.id),
			documentId: text(row?.document_id),
			fileName: text(row?.file_name),
			pageCount:
				typeof row?.page_count === 'number' ? row.page_count : undefined,
			uploadedAt: text(row?.uploaded_at),
			processedAt: text(row?.processed_at),
		});
		return result.success ? [result.data] : [];
	});
	for (const result of results) await save(ctx.db?.results, result, 'result');
	await logEventFromContext(
		ctx,
		'docparser.results.list',
		{ count: results.length },
		'completed',
	);
	return { results };
};
