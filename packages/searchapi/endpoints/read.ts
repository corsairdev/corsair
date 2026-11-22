import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, searchApiGet } from '../client';
import type { SearchApiContext } from '../context';
import {
	SearchApiAccountEntity,
	SearchApiLocationEntity,
	SearchApiSearchEntity,
} from '../schema/database';
import type {
	AccountResponse,
	EmptyInput,
	HtmlResponse,
	IdInput,
	LocationInput,
	LocationListResponse,
	SearchInput,
	SearchResponse,
} from './types';
import {
	AccountResponseSchema,
	EmptyInputSchema,
	HtmlResponseSchema,
	IdInputSchema,
	LocationInputSchema,
	LocationListResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
} from './types';

// unknown: a raw JSON field; this narrows it to a non-empty string.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: a raw JSON field; this keeps finite numbers only.
function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// unknown: Google location ids arrive as numbers or strings.
function idText(value: unknown): string | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return text(value);
}

async function save<T extends { id: string }>(
	table: // unknown: only completion matters; the ORM's return value is not used.
	{ upsertByEntityId: (id: string, row: T) => Promise<unknown> } | undefined,
	row: T,
	label: string,
) {
	if (!table) return;
	try {
		await table.upsertByEntityId(row.id, row);
	} catch {
		console.warn(`Failed to save SearchAPI ${label}`);
	}
}

// unknown: the raw response body; organic_results are read field by field.
function resultsOf(body: unknown) {
	const organic = asRecord(body)?.organic_results;
	if (!Array.isArray(organic)) return [];
	return organic.flatMap((item) => {
		const row = asRecord(item);
		if (!row) return [];
		return [
			{
				position: num(row.position),
				title: text(row.title),
				link: text(row.link),
				displayed_link: text(row.displayed_link),
				snippet: text(row.snippet),
				date: text(row.date),
				source: text(row.source),
				domain: text(row.domain),
			},
		];
	});
}

// Response keys that are bookkeeping, not search content.
const NOT_SECTIONS = new Set([
	'search_metadata',
	'search_parameters',
	'organic_results',
]);

// unknown: the raw response body; everything but bookkeeping and organic_results is passed through.
function sectionsOf(body: unknown): Record<string, unknown> {
	const row = asRecord(body);
	if (!row) return {};
	return Object.fromEntries(
		Object.entries(row).filter(([key]) => !NOT_SECTIONS.has(key)),
	);
}

// unknown: the raw response body; only search_metadata and search_parameters are read.
function searchRow(body: unknown) {
	const metadata = asRecord(asRecord(body)?.search_metadata);
	const parameters = asRecord(asRecord(body)?.search_parameters);
	return SearchApiSearchEntity.safeParse({
		id: text(metadata?.id),
		status: text(metadata?.status),
		engine: text(parameters?.engine),
	});
}

export const getAccount: CorsairEndpoint<
	SearchApiContext,
	EmptyInput,
	AccountResponse
> = async (ctx, input) => {
	EmptyInputSchema.parse(input ?? {});
	// unknown: raw JSON (or HTML text); the helpers above narrow it field by field.
	const body = await searchApiGet<unknown>(ctx.key, '/api/v1/me');
	const accountRow = asRecord(asRecord(body)?.account);
	const usage = asRecord(asRecord(body)?.api_usage);
	const subscription = asRecord(asRecord(body)?.subscription);
	if (!accountRow || num(accountRow.current_month_usage) === undefined) {
		throw new Error('SearchAPI account response was missing usage');
	}
	const account = SearchApiAccountEntity.parse({
		id: 'account',
		currentMonthUsage: num(accountRow.current_month_usage),
		monthlyAllowance: num(accountRow.monthly_allowance),
		remainingCredits: num(accountRow.remaining_credits),
		remainingSearches: num(accountRow.remaining_searches),
		searchesThisHour: num(usage?.searches_this_hour),
		hourlyRateLimit: num(usage?.hourly_rate_limit),
		periodStart: text(subscription?.period_start),
		periodEnd: text(subscription?.period_end),
	});
	await save(ctx.db?.accounts, account, 'account');
	await logEventFromContext(
		ctx,
		'searchapi.account.get',
		{ count: 1 },
		'completed',
	);
	return AccountResponseSchema.parse({ account });
};

export const listLocations: CorsairEndpoint<
	SearchApiContext,
	LocationInput,
	LocationListResponse
> = async (ctx, input) => {
	const parsed = LocationInputSchema.parse(input ?? {});
	// unknown: raw JSON (or HTML text); the helpers above narrow it field by field.
	const body = await searchApiGet<unknown>(ctx.key, '/api/v1/locations', {
		q: parsed.q,
		limit: parsed.limit,
	});
	if (!Array.isArray(body)) {
		throw new Error('SearchAPI locations response was not an array');
	}
	const locations = body.flatMap((item) => {
		const row = asRecord(item);
		const location = SearchApiLocationEntity.safeParse({
			id: idText(row?.google_id),
			name: text(row?.name),
			canonicalName: text(row?.canonical_name),
			countryCode: text(row?.country_code),
			targetType: text(row?.target_type),
		});
		return location.success ? [location.data] : [];
	});
	for (const location of locations) {
		await save(ctx.db?.locations, location, 'location');
	}
	await logEventFromContext(
		ctx,
		'searchapi.locations.list',
		{ count: locations.length },
		'completed',
	);
	return LocationListResponseSchema.parse({ locations });
};

export const runSearch: CorsairEndpoint<
	SearchApiContext,
	SearchInput,
	SearchResponse
> = async (ctx, input) => {
	const parsed = SearchInputSchema.parse(input ?? {});
	const { params, ...named } = parsed;
	// unknown: raw JSON (or HTML text); the helpers above narrow it field by field.
	const body = await searchApiGet<unknown>(ctx.key, '/api/v1/search', {
		...params,
		...named,
	});
	const search = searchRow(body);
	if (!search.success)
		throw new Error('SearchAPI search response was missing an id');
	await save(ctx.db?.searches, search.data, 'search');
	await logEventFromContext(
		ctx,
		'searchapi.searches.run',
		{ count: 1 },
		'completed',
	);
	return SearchResponseSchema.parse({
		search: search.data,
		results: resultsOf(body),
		sections: sectionsOf(body),
	});
};

export const getSearch: CorsairEndpoint<
	SearchApiContext,
	IdInput,
	SearchResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	// unknown: raw JSON (or HTML text); the helpers above narrow it field by field.
	const body = await searchApiGet<unknown>(
		ctx.key,
		`/api/v1/searches/${encodeURIComponent(parsed.id)}`,
	);
	const search = searchRow(body);
	if (!search.success)
		throw new Error('SearchAPI cached search was missing an id');
	await save(ctx.db?.searches, search.data, 'search');
	await logEventFromContext(
		ctx,
		'searchapi.searches.get',
		{ count: 1 },
		'completed',
	);
	return SearchResponseSchema.parse({
		search: search.data,
		results: resultsOf(body),
		sections: sectionsOf(body),
	});
};

export const getSearchHtml: CorsairEndpoint<
	SearchApiContext,
	IdInput,
	HtmlResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	// unknown: raw JSON (or HTML text); the helpers above narrow it field by field.
	const body = await searchApiGet<unknown>(
		ctx.key,
		`/api/v1/searches/${encodeURIComponent(parsed.id)}.html`,
		undefined,
		'text/html',
	);
	if (typeof body !== 'string') {
		throw new Error('SearchAPI cached HTML response was not text');
	}
	await logEventFromContext(
		ctx,
		'searchapi.searches.html',
		{ count: 1 },
		'completed',
	);
	return HtmlResponseSchema.parse({ html: body });
};
