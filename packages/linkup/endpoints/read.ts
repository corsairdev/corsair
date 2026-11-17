import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, defined, linkupGet, linkupPost, seg } from '../client';
import type { LinkupContext } from '../context';
import { LinkupCreditEntity, LinkupSourceEntity } from '../schema/database';
import type {
	AnswerInput,
	AnswerResponse,
	CreditResponse,
	EmptyInput,
	FetchInput,
	FetchResponse,
	QueryInput,
	ResearchListInput,
	SearchResponse,
	StructuredInput,
	StructuredResponse,
	TaskIdInput,
	TaskListInput,
	TaskListResponse,
	TaskResponse,
} from './types';
import {
	AnswerInputSchema,
	EmptyInputSchema,
	FetchInputSchema,
	FetchResponseSchema,
	ListMetaSchema,
	QueryInputSchema,
	ResearchListInputSchema,
	ResultSchema,
	SourceSchema,
	StructuredInputSchema,
	TaskIdInputSchema,
	TaskListInputSchema,
	TaskSchema,
} from './types';

/**
 * Local tables, or undefined when no database is configured. Core still hands
 * out stub tables then, whose writes throw, so `ctx.db` alone is not the signal.
 */
function store(ctx: LinkupContext) {
	return ctx.database ? ctx.db : undefined;
}

// Narrows one untyped JSON value.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// Resolves to whatever the table returns; the result is not used.
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

// value is a raw JSON array of sources or results.
function rowsOf<T>(
	value: unknown,
	parse: (row: unknown) => { success: true; data: T } | { success: false },
): T[] {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		const row = parse(item);
		return row.success ? [row.data] : [];
	});
}

/** Stores url, name, type and date of each source; page text is not stored. */
async function saveSources(
	ctx: LinkupContext,
	rows: { url: string; name?: string; type?: string; publishedAt?: string }[],
) {
	for (const row of rows) {
		const source = LinkupSourceEntity.safeParse({
			id: row.url,
			name: row.name,
			type: row.type,
			publishedAt: row.publishedAt,
		});
		if (source.success) await save(store(ctx)?.sources, source.data, 'source');
	}
}

/** Search filters in the API's field names. */
export function filters(input: {
	fromDate?: string;
	toDate?: string;
	includeDomains?: string[];
	excludeDomains?: string[];
}) {
	return defined({
		fromDate: input.fromDate,
		toDate: input.toDate,
		includeDomains: input.includeDomains,
		excludeDomains: input.excludeDomains,
	});
}

// body is the raw JSON of one task.
export function taskOf(body: unknown) {
	return TaskSchema.parse(body);
}

// body is the raw JSON of a task list ({ data, metadata, quota? }).
export function taskListOf(body: unknown): TaskListResponse {
	const root = asRecord(body);
	const list = Array.isArray(body) ? body : root?.data;
	if (!Array.isArray(list))
		throw new Error('Linkup task list response was not a list');
	const meta = ListMetaSchema.safeParse(root?.metadata);
	const quota = asRecord(root?.quota);
	return {
		tasks: list.map((item) => TaskSchema.parse(item)),
		meta: meta.success && root?.metadata ? meta.data : undefined,
		quota: quota
			? {
					inFlight:
						typeof quota.inFlight === 'number' ? quota.inFlight : undefined,
					limit: typeof quota.limit === 'number' ? quota.limit : undefined,
				}
			: undefined,
	};
}

async function done(ctx: LinkupContext, event: string, count: number) {
	await logEventFromContext(ctx, event, { count }, 'completed');
}

export const getCredits: CorsairEndpoint<
	LinkupContext,
	EmptyInput,
	CreditResponse
> = async (ctx, input) => {
	EmptyInputSchema.parse(input ?? {});
	const body = asRecord(
		await linkupGet<unknown>(ctx.key, '/v1/credits/balance'),
	);
	const credit = LinkupCreditEntity.parse({
		id: 'balance',
		balance: body?.balance,
	});
	await save(store(ctx)?.credits, credit, 'credit');
	await done(ctx, 'linkup.credits.get', 1);
	return { credit };
};

export const search: CorsairEndpoint<
	LinkupContext,
	QueryInput,
	SearchResponse
> = async (ctx, input) => {
	const parsed = QueryInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(
			ctx.key,
			'/v1/search',
			defined({
				q: parsed.q,
				depth: parsed.depth ?? 'fast',
				outputType: 'searchResults',
				maxResults: parsed.maxResults,
				includeImages: parsed.includeImages,
				...filters(parsed),
			}),
		),
	);
	if (!Array.isArray(body?.results))
		throw new Error('Linkup search response had no results list');
	const results = rowsOf(body.results, (row) => ResultSchema.safeParse(row));
	await saveSources(ctx, results);
	// The query stays out of the event.
	await done(ctx, 'linkup.search.run', results.length);
	return { results };
};

export const getAnswer: CorsairEndpoint<
	LinkupContext,
	AnswerInput,
	AnswerResponse
> = async (ctx, input) => {
	const parsed = AnswerInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(
			ctx.key,
			'/v1/search',
			defined({
				q: parsed.q,
				depth: parsed.depth ?? 'fast',
				outputType: 'sourcedAnswer',
				includeInlineCitations: parsed.includeInlineCitations,
				...filters(parsed),
			}),
		),
	);
	const answer = text(body?.answer);
	if (!answer) throw new Error('Linkup answer response had no answer');
	const sources = rowsOf(body?.sources, (row) => SourceSchema.safeParse(row));
	await saveSources(ctx, sources);
	await done(ctx, 'linkup.answers.get', sources.length);
	return { answer, sources };
};

export const searchStructured: CorsairEndpoint<
	LinkupContext,
	StructuredInput,
	StructuredResponse
> = async (ctx, input) => {
	const parsed = StructuredInputSchema.parse(input);
	const body = await linkupPost<unknown>(
		ctx.key,
		'/v1/search',
		defined({
			q: parsed.q,
			depth: parsed.depth ?? 'fast',
			outputType: 'structured',
			structuredOutputSchema: JSON.stringify(parsed.schema),
			includeSources: parsed.includeSources,
			...filters(parsed),
		}),
	);
	const root = asRecord(body);
	// With includeSources the data sits under `data` next to `sources`;
	// without it the body is the data itself.
	if (
		parsed.includeSources &&
		!(root && 'data' in root && Array.isArray(root.sources))
	)
		throw new Error('Linkup structured response was missing data or sources');
	const withSources = parsed.includeSources && root;
	const sources = withSources
		? rowsOf(root.sources, (row) => SourceSchema.safeParse(row))
		: undefined;
	if (sources) await saveSources(ctx, sources);
	await done(ctx, 'linkup.search.structured', sources?.length ?? 1);
	return { data: withSources ? root.data : body, sources };
};

export const fetchPage: CorsairEndpoint<
	LinkupContext,
	FetchInput,
	FetchResponse
> = async (ctx, input) => {
	const parsed = FetchInputSchema.parse(input);
	const body = asRecord(
		await linkupPost<unknown>(
			ctx.key,
			'/v1/fetch',
			defined({
				url: parsed.url,
				mode: parsed.mode,
				renderJs: parsed.renderJs,
				extractImages: parsed.extractImages,
				includeRawContent: parsed.includeRawContent,
				schema: parsed.schema ? JSON.stringify(parsed.schema) : undefined,
				instructions: parsed.instructions,
			}),
		),
	);
	// An empty page is valid; only a missing field is not.
	const markdown =
		typeof body?.markdown === 'string' ? body.markdown : undefined;
	if (markdown === undefined)
		throw new Error('Linkup fetch response had no markdown');
	// The URL and the page stay out of the event and the database.
	await done(ctx, 'linkup.pages.fetch', 1);
	return FetchResponseSchema.parse(
		defined({
			markdown,
			data: asRecord(body?.data),
			rawContent: text(body?.rawContent),
			images: Array.isArray(body?.images) ? body.images : undefined,
			contentType: text(body?.contentType),
		}),
	);
};

export const getResearch: CorsairEndpoint<
	LinkupContext,
	TaskIdInput,
	TaskResponse
> = async (ctx, input) => {
	const { id } = TaskIdInputSchema.parse(input);
	const task = taskOf(
		await linkupGet<unknown>(ctx.key, `/v1/research/${seg(id)}`),
	);
	await done(ctx, 'linkup.research.get', 1);
	return { task };
};

export const listResearch: CorsairEndpoint<
	LinkupContext,
	ResearchListInput,
	TaskListResponse
> = async (ctx, input) => {
	const parsed = ResearchListInputSchema.parse(input ?? {});
	const result = taskListOf(
		await linkupGet<unknown>(ctx.key, '/v1/research', parsed),
	);
	await done(ctx, 'linkup.research.list', result.tasks.length);
	return result;
};

export const getTask: CorsairEndpoint<
	LinkupContext,
	TaskIdInput,
	TaskResponse
> = async (ctx, input) => {
	const { id } = TaskIdInputSchema.parse(input);
	const task = taskOf(
		await linkupGet<unknown>(ctx.key, `/v1/tasks/${seg(id)}`),
	);
	await done(ctx, 'linkup.tasks.get', 1);
	return { task };
};

export const listTasks: CorsairEndpoint<
	LinkupContext,
	TaskListInput,
	TaskListResponse
> = async (ctx, input) => {
	const parsed = TaskListInputSchema.parse(input ?? {});
	const result = taskListOf(
		await linkupGet<unknown>(ctx.key, '/v1/tasks', parsed),
	);
	await done(ctx, 'linkup.tasks.list', result.tasks.length);
	return result;
};
