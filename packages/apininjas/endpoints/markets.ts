import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import { cacheSp500, cacheStockExchanges } from './persist';
import { asArray } from './shared';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Equities, funds, crypto, commodities and foreign exchange.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/**
 * Returns price information for any given ticker symbol. Premium members
 * have access to live prices, while free users only have access to
 * 15-minute delayed data.
 */
export const stockPrice: ApiNinjasEndpoints['marketsStockPrice'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsStockPrice']
	>('stockprice', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.stockPrice',
		withCount(auditPayload(input, ['ticker']), result),
		'completed',
	);
	return result;
};

/**
 * Returns comprehensive company profile information including company
 * name, CEO, address, financial data, exchange information, identifiers
 * (CIK, CUSIP, ISIN), and latest earnings information when available.
 * Premium members have access to live prices, while free users only have
 * access to 15-minute delayed data.
 */
export const ticker: ApiNinjasEndpoints['marketsTicker'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsTicker']
	>('ticker', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.ticker',
		withCount(auditPayload(input, ['ticker']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a list of all available companies and their ticker symbols.
 * Supports pagination to retrieve results in batches.
 */
export const tickerList: ApiNinjasEndpoints['marketsTickerList'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsTickerList']
	>('stockpricelist', ctx.key, {
		version: 'v1',
		query: {
			offset: input.offset,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.tickerList',
		withCount(auditPayload(input, ['offset', 'limit']), result),
		'completed',
	);
	return result;
};

/**
 * Returns detailed information about stock exchanges matching the
 * specified criteria. At least one parameter is required.
 */
export const stockExchanges: ApiNinjasEndpoints['marketsStockExchanges'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['marketsStockExchanges']
		>('stockexchange', ctx.key, {
			version: 'v1',
			query: {
				mic: input.mic,
				name: input.name,
				city: input.city,
				country: input.country,
			},
		});

		await cacheStockExchanges(
			ctx.db.stockExchanges,
			asArray(result),
			new Date(),
		);

		await logEventFromContext(
			ctx,
			'apininjas.markets.stockExchanges',
			withCount(
				auditPayload(input, ['mic', 'name', 'city', 'country']),
				result,
			),
			'completed',
		);
		return result;
	};

/**
 * Returns S&P 500 index constituents, filterable by ticker, company name,
 * sector or the date the company joined the index.
 */
export const sp500: ApiNinjasEndpoints['marketsSp500'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsSp500']
	>('sp500', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
			name: input.name,
			sector: input.sector,
			date_added: input.date_added,
		},
	});

	await cacheSp500(ctx.db.sp500, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.markets.sp500',
		withCount(
			auditPayload(input, ['ticker', 'name', 'sector', 'date_added']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns the current market cap data for any given company ticker.
 * Premium members have access to live prices, while free users only have
 * access to 15-minute delayed data.
 */
export const marketCap: ApiNinjasEndpoints['marketsMarketCap'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsMarketCap']
	>('marketcap', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.marketCap',
		withCount(auditPayload(input, ['ticker']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a JSON array of detailed earnings reports, each with
 * comprehensive financial statements and key performance metrics. Query a
 * single company by ticker or cik, or query every company that filed
 * within a date range using date or date_start/date_end. Results are
 * paginated 50 per page via offset.
 */
export const earnings: ApiNinjasEndpoints['marketsEarnings'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsEarnings']
	>('earnings', ctx.key, {
		version: 'v2',
		query: {
			ticker: input.ticker,
			cik: input.cik,
			period: input.period,
			year: input.year,
			quarter: input.quarter,
			date: input.date,
			date_start: input.date_start,
			date_end: input.date_end,
			offset: input.offset,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.earnings',
		withCount(
			auditPayload(input, [
				'ticker',
				'cik',
				'period',
				'year',
				'quarter',
				'date',
				'date_start',
				'date_end',
				'offset',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns a list of past earnings results and upcoming earnings dates. You
 * can query by ticker symbol to get earnings for a specific company, by a
 * single date, or by a date range. Up to 50 earnings results are returned
 * per request.
 */
export const earningsCalendar: ApiNinjasEndpoints['marketsEarningsCalendar'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['marketsEarningsCalendar']
		>('earningscalendar', ctx.key, {
			version: 'v1',
			query: {
				ticker: input.ticker,
				date: input.date,
				date_start: input.date_start,
				date_end: input.date_end,
				show_upcoming: input.show_upcoming,
				offset: input.offset,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.markets.earningsCalendar',
			withCount(
				auditPayload(input, [
					'ticker',
					'date',
					'date_start',
					'date_end',
					'show_upcoming',
					'offset',
				]),
				result,
			),
			'completed',
		);
		return result;
	};

/** Returns the earnings transcript for a given company earning quarter. */
export const earningsTranscript: ApiNinjasEndpoints['marketsEarningsTranscript'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['marketsEarningsTranscript']
		>('earningstranscript', ctx.key, {
			version: 'v1',
			query: {
				ticker: input.ticker,
				cik: input.cik,
				year: input.year,
				quarter: input.quarter,
				qa_only: input.qa_only,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.markets.earningsTranscript',
			withCount(
				auditPayload(input, ['ticker', 'cik', 'year', 'quarter', 'qa_only']),
				result,
			),
			'completed',
		);
		return result;
	};

/**
 * Returns a list of insider trading transactions that match the specified
 * filters. All parameters are optional and can be combined for advanced
 * filtering.
 */
export const insiderTransactions: ApiNinjasEndpoints['marketsInsiderTransactions'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['marketsInsiderTransactions']
		>('insidertransactions', ctx.key, {
			version: 'v1',
			query: {
				ticker: input.ticker,
				cik: input.cik,
				name: input.name,
				form_type: input.form_type,
				transaction_type: input.transaction_type,
				transaction_code: input.transaction_code,
				transaction_date: input.transaction_date,
				min_transaction_date: input.min_transaction_date,
				max_transaction_date: input.max_transaction_date,
				insider_type: input.insider_type,
				min_transaction_value: input.min_transaction_value,
				max_transaction_value: input.max_transaction_value,
				limit: input.limit,
				offset: input.offset,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.markets.insiderTransactions',
			withCount(
				auditPayload(input, [
					'ticker',
					'cik',
					'name',
					'form_type',
					'transaction_type',
					'transaction_date',
					'min_transaction_date',
					'max_transaction_date',
					'insider_type',
					'min_transaction_value',
					'max_transaction_value',
					'limit',
					'offset',
				]),
				result,
			),
			'completed',
		);
		return result;
	};

/**
 * Returns a list of SEC filing information (including the submission URL)
 * corresponding to the given search parameters.
 */
export const secFilings: ApiNinjasEndpoints['marketsSecFilings'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsSecFilings']
	>('sec', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
			filing: input.filing,
			start: input.start,
			end: input.end,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.secFilings',
		withCount(
			auditPayload(input, ['ticker', 'filing', 'start', 'end', 'limit']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns comprehensive information about any ETF by its ticker. Premium
 * members have access to live prices, while free users only have access to
 * 15-minute delayed data.
 */
export const etf: ApiNinjasEndpoints['marketsEtf'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsEtf']
	>('etf', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.etf',
		withCount(auditPayload(input, ['ticker']), result),
		'completed',
	);
	return result;
};

/** Returns comprehensive information about any Mutual Fund by its ticker. */
export const mutualFund: ApiNinjasEndpoints['marketsMutualFund'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsMutualFund']
	>('mutualfund', ctx.key, {
		version: 'v1',
		query: {
			ticker: input.ticker,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.mutualFund',
		withCount(auditPayload(input, ['ticker']), result),
		'completed',
	);
	return result;
};

/**
 * Returns the current price and current time (in UNIX timestamp in
 * seconds) for any cryptocurrency symbol. Premium members have access to
 * live prices, while free users only have access to 15-minute delayed
 * data. For historical price data, see /v1/cryptopricehistorical.
 */
export const cryptoPrice: ApiNinjasEndpoints['marketsCryptoPrice'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsCryptoPrice']
	>('cryptoprice', ctx.key, {
		version: 'v1',
		query: {
			symbol: input.symbol,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.cryptoPrice',
		withCount(auditPayload(input, ['symbol']), result),
		'completed',
	);
	return result;
};

/**
 * Returns the latest Bitcoin price in USD and 24-hour market data. Premium
 * members have access to live prices, while free users only have access to
 * 15-minute delayed data. For historical price data, see
 * /v1/bitcoinhistorical.
 */
export const bitcoin: ApiNinjasEndpoints['marketsBitcoin'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsBitcoin']
	>('bitcoin', ctx.key, {
		version: 'v1',
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.bitcoin',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns the current price information for one or more commodities.
 * Prices are based on rolling futures contracts and are quoted in the
 * commodity's native unit and currency convention - see the unit and
 * currency_unit fields below. Use the optional currency and unit
 * parameters to convert into any supported currency or compatible
 * mass/volume/energy unit. Premium members have access to live prices,
 * while free users only have access to 15-minute delayed data.
 */
export const commodityPrice: ApiNinjasEndpoints['marketsCommodityPrice'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['marketsCommodityPrice']
		>('commodityprice', ctx.key, {
			version: 'v1',
			query: {
				name: input.name,
				names: input.names,
				currency: input.currency,
				unit: input.unit,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.markets.commodityPrice',
			withCount(
				auditPayload(input, ['name', 'names', 'currency', 'unit']),
				result,
			),
			'completed',
		);
		return result;
	};

/** Converts an existing currency and amount into a new currency. */
export const convertCurrency: ApiNinjasEndpoints['marketsConvertCurrency'] =
	async (ctx, input) => {
		const result = await makeApiNinjasRequest<
			ApiNinjasEndpointOutputs['marketsConvertCurrency']
		>('convertcurrency', ctx.key, {
			version: 'v1',
			query: {
				have: input.have,
				want: input.want,
				amount: input.amount,
			},
		});

		await logEventFromContext(
			ctx,
			'apininjas.markets.convertCurrency',
			withCount(auditPayload(input, ['have', 'want']), result),
			'completed',
		);
		return result;
	};

/** Returns the exchange rate for a given currency pair. */
export const exchangeRate: ApiNinjasEndpoints['marketsExchangeRate'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['marketsExchangeRate']
	>('exchangerate', ctx.key, {
		version: 'v1',
		query: {
			pair: input.pair,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.markets.exchangeRate',
		withCount(auditPayload(input, ['pair']), result),
		'completed',
	);
	return result;
};
