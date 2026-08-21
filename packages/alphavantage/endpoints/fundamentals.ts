import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageCsvRequest, makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheCompany, cacheSymbol, cacheSymbols } from './persist';
import { assertNotEmpty, compactQuery } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * Company profile, sector, and headline valuation figures.
 *
 * The provider function is `OVERVIEW`; the catalog names the operation
 * `COMPANY_OVERVIEW`.
 */
export const companyOverview: AlphaVantageEndpoints['fundamentalsCompanyOverview'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['fundamentalsCompanyOverview']
		>('OVERVIEW', ctx.key, compactQuery({ symbol: input.symbol }));

		assertNotEmpty(result, 'fundamentals.companyOverview', input.symbol);

		await cacheSymbol(ctx.db.symbols, {
			symbol: result.Symbol,
			name: result.Name,
			exchange: result.Exchange,
			assetType: result.AssetType,
			currency: result.Currency,
		});
		await cacheCompany(ctx.db.companies, result);

		await logEventFromContext(
			ctx,
			'alphavantage.fundamentals.companyOverview',
			auditPayload(input, ['symbol']),
			'completed',
		);
		return result;
	};

/** Annual and quarterly income statements. */
export const incomeStatement: AlphaVantageEndpoints['fundamentalsIncomeStatement'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['fundamentalsIncomeStatement']
		>('INCOME_STATEMENT', ctx.key, compactQuery({ symbol: input.symbol }));

		assertNotEmpty(result, 'fundamentals.incomeStatement', input.symbol);

		await logEventFromContext(
			ctx,
			'alphavantage.fundamentals.incomeStatement',
			auditPayload(input, ['symbol']),
			'completed',
		);
		return result;
	};

/** Annual and quarterly balance sheets. */
export const balanceSheet: AlphaVantageEndpoints['fundamentalsBalanceSheet'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['fundamentalsBalanceSheet']
		>('BALANCE_SHEET', ctx.key, compactQuery({ symbol: input.symbol }));

		assertNotEmpty(result, 'fundamentals.balanceSheet', input.symbol);

		await logEventFromContext(
			ctx,
			'alphavantage.fundamentals.balanceSheet',
			auditPayload(input, ['symbol']),
			'completed',
		);
		return result;
	};

/** Annual and quarterly cash flow statements. */
export const cashFlow: AlphaVantageEndpoints['fundamentalsCashFlow'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['fundamentalsCashFlow']
	>('CASH_FLOW', ctx.key, compactQuery({ symbol: input.symbol }));

	assertNotEmpty(result, 'fundamentals.cashFlow', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.fundamentals.cashFlow',
		auditPayload(input, ['symbol']),
		'completed',
	);
	return result;
};

/** Reported and estimated earnings per share, annual and quarterly. */
export const earnings: AlphaVantageEndpoints['fundamentalsEarnings'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['fundamentalsEarnings']
	>('EARNINGS', ctx.key, compactQuery({ symbol: input.symbol }));

	assertNotEmpty(result, 'fundamentals.earnings', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.fundamentals.earnings',
		auditPayload(input, ['symbol']),
		'completed',
	);
	return result;
};

/**
 * Upcoming earnings dates.
 *
 * CSV upstream, returned here as parsed rows.
 */
export const earningsCalendar: AlphaVantageEndpoints['fundamentalsEarningsCalendar'] =
	async (ctx, input) => {
		const rows = await makeAlphaVantageCsvRequest(
			'EARNINGS_CALENDAR',
			ctx.key,
			compactQuery({ symbol: input.symbol, horizon: input.horizon }),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.fundamentals.earningsCalendar',
			{ ...auditPayload(input, ['symbol', 'horizon']), rows: rows.length },
			'completed',
		);
		return rows;
	};

/** Transcript of one quarter's earnings call, with per-speaker sentiment. */
export const earningsCallTranscript: AlphaVantageEndpoints['fundamentalsEarningsCallTranscript'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['fundamentalsEarningsCallTranscript']
		>(
			'EARNINGS_CALL_TRANSCRIPT',
			ctx.key,
			compactQuery({ symbol: input.symbol, quarter: input.quarter }),
		);

		assertNotEmpty(
			result,
			'fundamentals.earningsCallTranscript',
			`${input.symbol} ${input.quarter}`,
		);

		await logEventFromContext(
			ctx,
			'alphavantage.fundamentals.earningsCallTranscript',
			auditPayload(input, ['symbol', 'quarter']),
			'completed',
		);
		return result;
	};

/**
 * IPOs expected in the next three months.
 *
 * CSV upstream, returned here as parsed rows. The listings are also written to
 * the symbol cache, since a newly listed ticker will not be in it yet.
 */
export const ipoCalendar: AlphaVantageEndpoints['fundamentalsIpoCalendar'] =
	async (ctx, input) => {
		const rows = await makeAlphaVantageCsvRequest('IPO_CALENDAR', ctx.key);

		await cacheSymbols(
			ctx.db.symbols,
			rows.map((row) => ({
				symbol: row.symbol,
				name: row.name,
				exchange: row.exchange,
				currency: row.currency,
				ipoDate: row.ipoDate,
			})),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.fundamentals.ipoCalendar',
			{ ...auditPayload(input, []), rows: rows.length },
			'completed',
		);
		return rows;
	};

/**
 * Historical and declared dividends.
 *
 * The provider function is `DIVIDENDS`; the catalog names the operation
 * `GET_DIVIDENDS`.
 */
export const dividends: AlphaVantageEndpoints['fundamentalsDividends'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['fundamentalsDividends']
	>('DIVIDENDS', ctx.key, compactQuery({ symbol: input.symbol }));

	assertNotEmpty(result, 'fundamentals.dividends', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.fundamentals.dividends',
		auditPayload(input, ['symbol']),
		'completed',
	);
	return result;
};

/** Historical stock splits. */
export const splits: AlphaVantageEndpoints['fundamentalsSplits'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['fundamentalsSplits']
	>('SPLITS', ctx.key, compactQuery({ symbol: input.symbol }));

	assertNotEmpty(result, 'fundamentals.splits', input.symbol);

	await logEventFromContext(
		ctx,
		'alphavantage.fundamentals.splits',
		auditPayload(input, ['symbol']),
		'completed',
	);
	return result;
};
