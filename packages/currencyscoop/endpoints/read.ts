import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { asRecord, currencyGet } from '../client';
import type { CurrencyScoopContext } from '../context';
import {
	CurrencyScoopCurrencyEntity,
	CurrencyScoopQuoteEntity,
} from '../schema/database';
import type {
	ConvertInput,
	ConvertResponse,
	CurrencyListResponse,
	HistoricalInput,
	ListInput,
	QuoteListResponse,
	RatesInput,
	TimeseriesInput,
} from './types';
import {
	ConvertInputSchema,
	HistoricalInputSchema,
	RatesInputSchema,
	TimeseriesInputSchema,
} from './types';

const CODE = /^[A-Za-z0-9]{2,12}$/;

async function keyOf(ctx: CurrencyScoopContext): Promise<string> {
	if (!ctx.key) throw new AuthMissingError('currencyscoop', 'api_key');
	return ctx.key;
}

function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function responseOf(body: unknown): Record<string, unknown> {
	const row = asRecord(body);
	const response = asRecord(row?.response);
	if (!response) throw new Error('CurrencyScoop response was missing');
	return response;
}

function quotesFrom(
	date: string,
	base: string,
	rates: unknown,
): CurrencyScoopQuoteEntity[] {
	const map = asRecord(rates);
	if (!map) throw new Error('CurrencyScoop rates were missing');
	return Object.entries(map).flatMap(([code, value]) => {
		if (
			!CODE.test(code) ||
			typeof value !== 'number' ||
			!Number.isFinite(value)
		) {
			return [];
		}
		const row = CurrencyScoopQuoteEntity.safeParse({
			id: `${date}:${base}:${code.toUpperCase()}`,
			date,
			base,
			code: code.toUpperCase(),
			rate: value,
		});
		return row.success ? [row.data] : [];
	});
}

async function saveQuotes(
	ctx: CurrencyScoopContext,
	rows: CurrencyScoopQuoteEntity[],
	event: string,
): Promise<void> {
	if (ctx.db?.quotes) {
		for (const row of rows) {
			try {
				await ctx.db.quotes.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save CurrencyScoop quote');
			}
		}
	}
	await logEventFromContext(ctx, event, { count: rows.length }, 'completed');
}

export const listCurrencies: CorsairEndpoint<
	CurrencyScoopContext,
	ListInput,
	CurrencyListResponse
> = async (ctx) => {
	const key = await keyOf(ctx);
	const body = await currencyGet<unknown>(key, '/currencies');
	const response = asRecord(body)?.response;
	if (!Array.isArray(response)) {
		throw new Error('CurrencyScoop currencies response was not an array');
	}
	const currencies = response.flatMap((item) => {
		const row = asRecord(item);
		const id = optionalString(row?.short_code)?.toUpperCase();
		if (!id || !CODE.test(id)) return [];
		const parsed = CurrencyScoopCurrencyEntity.safeParse({
			id,
			name: optionalString(row?.name),
			symbol: optionalString(row?.symbol),
		});
		return parsed.success ? [parsed.data] : [];
	});
	if (ctx.db?.currencies) {
		for (const row of currencies) {
			try {
				await ctx.db.currencies.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save CurrencyScoop currency');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'currencyscoop.currencies.list',
		{ count: currencies.length },
		'completed',
	);
	return { currencies };
};

async function datedQuotes(
	ctx: CurrencyScoopContext,
	path: '/latest' | '/historical',
	input: RatesInput & { date?: string },
	event: string,
): Promise<QuoteListResponse> {
	const key = await keyOf(ctx);
	const body = await currencyGet<unknown>(key, path, {
		base: input.base?.toUpperCase(),
		symbols: input.symbols,
		date: input.date,
	});
	const response = responseOf(body);
	const date = optionalString(response.date);
	const base = optionalString(response.base)?.toUpperCase();
	if (!date || !base) {
		throw new Error('CurrencyScoop rate response was missing date or base');
	}
	const quotes = quotesFrom(date, base, response.rates);
	await saveQuotes(ctx, quotes, event);
	return { quotes };
}

export const latestQuotes: CorsairEndpoint<
	CurrencyScoopContext,
	RatesInput,
	QuoteListResponse
> = async (ctx, input) => {
	const parsed = RatesInputSchema.parse(input ?? {});
	return datedQuotes(ctx, '/latest', parsed, 'currencyscoop.quotes.latest');
};

export const historicalQuotes: CorsairEndpoint<
	CurrencyScoopContext,
	HistoricalInput,
	QuoteListResponse
> = async (ctx, input) => {
	const parsed = HistoricalInputSchema.parse(input ?? {});
	return datedQuotes(
		ctx,
		'/historical',
		parsed,
		'currencyscoop.quotes.historical',
	);
};

export const convertQuote: CorsairEndpoint<
	CurrencyScoopContext,
	ConvertInput,
	ConvertResponse
> = async (ctx, input) => {
	const key = await keyOf(ctx);
	const parsed = ConvertInputSchema.parse(input ?? {});
	const body = await currencyGet<unknown>(key, '/convert', {
		from: parsed.from.toUpperCase(),
		to: parsed.to.toUpperCase(),
		amount: String(parsed.amount),
		date: parsed.date,
	});
	const response = responseOf(body);
	const value = response.value;
	const amount = response.amount;
	const from = optionalString(response.from);
	const to = optionalString(response.to);
	const date = optionalString(response.date);
	if (
		typeof value !== 'number' ||
		typeof amount !== 'number' ||
		!from ||
		!to ||
		!date
	) {
		throw new Error('CurrencyScoop convert response was missing a value');
	}
	await logEventFromContext(
		ctx,
		'currencyscoop.quotes.convert',
		{ count: 1 },
		'completed',
	);
	return { from, to, amount, value, date };
};

export const timeseriesQuotes: CorsairEndpoint<
	CurrencyScoopContext,
	TimeseriesInput,
	QuoteListResponse
> = async (ctx, input) => {
	const key = await keyOf(ctx);
	const parsed = TimeseriesInputSchema.parse(input ?? {});
	const body = await currencyGet<unknown>(key, '/timeseries', {
		base: parsed.base?.toUpperCase(),
		symbols: parsed.symbols,
		start_date: parsed.start_date,
		end_date: parsed.end_date,
	});
	const response = responseOf(body);
	// The live API answers `response: { "YYYY-MM-DD": { CODE: rate } }` with no
	// base or rates wrapper; keep reading the documented `{ base, rates }` shape too.
	const base = (
		optionalString(response.base) ??
		parsed.base ??
		'USD'
	).toUpperCase();
	const byDate = asRecord(response.rates) ?? response;
	const quotes = Object.entries(byDate).flatMap(([date, rates]) => {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
		try {
			return quotesFrom(date, base, rates);
		} catch {
			return [];
		}
	});
	await saveQuotes(ctx, quotes, 'currencyscoop.quotes.timeseries');
	return { quotes };
};
