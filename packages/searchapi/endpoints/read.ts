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
import { IdInputSchema, LocationInputSchema, SearchInputSchema } from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

function idText(value: unknown): string | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	return text(value);
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
		console.warn(`Failed to save SearchAPI ${label}`);
	}
}

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
			},
		];
	});
}

function searchRow(body: unknown, fallbackId?: string) {
	const metadata = asRecord(asRecord(body)?.search_metadata);
	const parameters = asRecord(asRecord(body)?.search_parameters);
	return SearchApiSearchEntity.safeParse({
		id: text(metadata?.id) ?? fallbackId,
		status: text(metadata?.status),
		engine: text(parameters?.engine),
	});
}

export const getAccount: CorsairEndpoint<
	SearchApiContext,
	EmptyInput,
	AccountResponse
> = async (ctx) => {
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
	return { account };
};

export const listLocations: CorsairEndpoint<
	SearchApiContext,
	LocationInput,
	LocationListResponse
> = async (ctx, input) => {
	const parsed = LocationInputSchema.parse(input ?? {});
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
	return { locations };
};

export const runSearch: CorsairEndpoint<
	SearchApiContext,
	SearchInput,
	SearchResponse
> = async (ctx, input) => {
	const parsed = SearchInputSchema.parse(input ?? {});
	const body = await searchApiGet<unknown>(ctx.key, '/api/v1/search', {
		engine: parsed.engine,
		q: parsed.q,
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
	return { search: search.data, results: resultsOf(body) };
};

export const getSearch: CorsairEndpoint<
	SearchApiContext,
	IdInput,
	SearchResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
	const body = await searchApiGet<unknown>(
		ctx.key,
		`/api/v1/searches/${encodeURIComponent(parsed.id)}`,
	);
	const search = searchRow(body, parsed.id);
	if (!search.success)
		throw new Error('SearchAPI cached search was missing an id');
	await save(ctx.db?.searches, search.data, 'search');
	await logEventFromContext(
		ctx,
		'searchapi.searches.get',
		{ count: 1 },
		'completed',
	);
	return { search: search.data, results: resultsOf(body) };
};

export const getSearchHtml: CorsairEndpoint<
	SearchApiContext,
	IdInput,
	HtmlResponse
> = async (ctx, input) => {
	const parsed = IdInputSchema.parse(input ?? {});
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
	return { html: body };
};
