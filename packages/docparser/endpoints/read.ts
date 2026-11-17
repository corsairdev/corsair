import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, docparserGet, seg } from '../client';
import type { DocparserContext } from '../context';
import {
	DocparserModelEntity,
	DocparserParserEntity,
	DocparserPingEntity,
	DocparserResultEntity,
} from '../schema/database';
import type {
	DocumentInput,
	DocumentStatusResponse,
	EmptyInput,
	ModelListResponse,
	ParserIdInput,
	ParserListResponse,
	PingResponse,
	ResultInput,
	ResultListResponse,
	ResultsInput,
} from './types';
import {
	DocumentInputSchema,
	DocumentStatusResponseSchema,
	ParserIdInputSchema,
	ResultInputSchema,
	ResultSchema,
	ResultsInputSchema,
} from './types';

/**
 * Local tables, or undefined when no database is configured. Core still hands
 * out stub tables then, whose writes throw, so `ctx.db` alone is not the signal.
 */
function store(ctx: DocparserContext) {
	return ctx.database ? ctx.db : undefined;
}

// Narrows one untyped JSON value.
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

// body is the raw JSON response.
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
	const msg = text(body?.msg);
	if (!msg) throw new Error('Docparser ping response was missing msg');
	const row = DocparserPingEntity.parse({ id: 'ping', msg });
	await save(store(ctx)?.pings, row, 'ping');
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
	for (const parser of parsers)
		await save(store(ctx)?.parsers, parser, 'parser');
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
	const { parserId: id } = ParserIdInputSchema.parse(input);
	const models = listOf(
		await docparserGet<unknown>(ctx.key, `/v1/parser/models/${seg(id)}`),
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
	for (const model of models) await save(store(ctx)?.models, model, 'model');
	await logEventFromContext(
		ctx,
		'docparser.models.list',
		{ count: models.length },
		'completed',
	);
	return { models };
};

/** Parsed rows: returned whole, with only metadata stored locally. */
async function resultsOf(
	ctx: DocparserContext,
	// body is the raw JSON response.
	body: unknown,
	event: string,
): Promise<ResultListResponse> {
	const results = listOf(body, 'results').flatMap((item) => {
		const parsed = ResultSchema.safeParse(asRecord(item));
		return parsed.success ? [parsed.data] : [];
	});
	for (const row of results) {
		const entity = DocparserResultEntity.safeParse({
			id: row.id,
			documentId: text(row.document_id),
			fileName: text(row.file_name),
			pageCount:
				typeof row.page_count === 'number' ? row.page_count : undefined,
			uploadedAt: text(row.uploaded_at),
			processedAt: text(row.processed_at),
		});
		if (entity.success) await save(store(ctx)?.results, entity.data, 'result');
	}
	await logEventFromContext(ctx, event, { count: results.length }, 'completed');
	return { results };
}

export const listResults: CorsairEndpoint<
	DocparserContext,
	ResultsInput,
	ResultListResponse
> = async (ctx, input) => {
	const parsed = ResultsInputSchema.parse(input);
	if (
		parsed.list &&
		parsed.list !== 'last_uploaded' &&
		parsed.date === undefined
	)
		throw new Error(`list=${parsed.list} needs date`);
	const body = await docparserGet<unknown>(
		ctx.key,
		`/v1/results/${seg(parsed.parserId)}`,
		{
			format: parsed.format,
			list: parsed.list,
			date: parsed.date,
			limit: parsed.limit,
			offset: parsed.offset,
			remote_id: parsed.remoteId,
			include_processing_queue: parsed.includeProcessingQueue,
			sort_by: parsed.sortBy,
			sort_order: parsed.sortOrder,
		},
	);
	return resultsOf(ctx, body, 'docparser.results.list');
};

export const getResult: CorsairEndpoint<
	DocparserContext,
	ResultInput,
	ResultListResponse
> = async (ctx, input) => {
	const parsed = ResultInputSchema.parse(input);
	const body = await docparserGet<unknown>(
		ctx.key,
		`/v1/results/${seg(parsed.parserId)}/${seg(parsed.documentId)}`,
		{ format: parsed.format, include_children: parsed.includeChildren },
	);
	return resultsOf(ctx, body, 'docparser.results.get');
};

export const getDocumentStatus: CorsairEndpoint<
	DocparserContext,
	DocumentInput,
	DocumentStatusResponse
> = async (ctx, input) => {
	const parsed = DocumentInputSchema.parse(input);
	const body = asRecord(
		await docparserGet<unknown>(
			ctx.key,
			`/v2/document/status/${seg(parsed.parserId)}/${seg(parsed.documentId)}`,
		),
	);
	if (!body) throw new Error('Docparser status response was not an object');
	// The response also carries an internal token; it is not returned.
	const { token: _token, ...rest } = body;
	const status = DocumentStatusResponseSchema.shape.status.parse(rest);
	const done =
		status.importing_in_progress === false &&
		status.processing_in_progress === false &&
		typeof status.processed_at === 'number' &&
		status.processed_at > 0;
	await logEventFromContext(
		ctx,
		'docparser.documents.status',
		{ count: 1 },
		'completed',
	);
	return { status, done };
};
