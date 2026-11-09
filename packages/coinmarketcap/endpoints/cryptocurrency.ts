import { asRecord } from 'corsair/core';
import type { CoinMarketCapContext, CoinMarketCapEndpoints } from '..';
import { CoinMarketCapAPIError } from '../client';
import { call, joinCsv } from './call';
import {
	COINMARKETCAP_DEFAULT_LISTINGS_LIMIT,
	CoinMarketCapEndpointInputSchemas as Inputs,
	CoinMarketCapEndpointOutputSchemas as Outputs,
} from './types';

// unknown: `data` is the provider's payload, which the output schema validates.
function dataOf(raw: unknown): unknown {
	return asRecord(raw)?.data;
}

/**
 * The provider's payload, which must be present.
 *
 * CoinMarketCap sends `data` on every successful call, and an empty result is
 * `data: []` rather than a missing field, verified against a filter that matched
 * nothing. So a body with no `data` at all is malformed, and turning it into an
 * empty list would make a broken response look like a real empty page.
 */
// unknown: same open body as dataOf.
function requireData(raw: unknown): unknown {
	const record = asRecord(raw);
	if (!record || !('data' in record)) {
		throw new CoinMarketCapAPIError(
			'CoinMarketCap reported success but sent no data field.',
			{ method: 'GET' },
		);
	}
	return record.data;
}

/** The `status` object, kept on the shaped result so credits stay visible. */
// unknown: see dataOf.
function statusOf(raw: unknown): unknown {
	return asRecord(raw)?.status;
}

export const listings: CoinMarketCapEndpoints['cryptocurrencyListings'] = (
	ctx: CoinMarketCapContext,
	input,
) =>
	call(
		ctx,
		{
			event: 'cryptocurrency.listings',
			input: Inputs.cryptocurrencyListings,
			output: Outputs.cryptocurrencyListings,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v3/cryptocurrency/listings/latest',
			query: {
				start: parsed.start,
				// The route answers 100 when omitted, so a caller who asked for
				// nothing gets the documented default rather than a silent 100.
				limit: parsed.limit ?? COINMARKETCAP_DEFAULT_LISTINGS_LIMIT,
				price_min: parsed.price_min,
				price_max: parsed.price_max,
				market_cap_min: parsed.market_cap_min,
				market_cap_max: parsed.market_cap_max,
				volume_24h_min: parsed.volume_24h_min,
				volume_24h_max: parsed.volume_24h_max,
				circulating_supply_min: parsed.circulating_supply_min,
				circulating_supply_max: parsed.circulating_supply_max,
				percent_change_24h_min: parsed.percent_change_24h_min,
				percent_change_24h_max: parsed.percent_change_24h_max,
				convert: joinCsv(parsed.convert),
				convert_id: joinCsv(parsed.convert_id),
				sort: parsed.sort,
				sort_dir: parsed.sort_dir,
				cryptocurrency_type: parsed.cryptocurrency_type,
				tag: parsed.tag,
				aux: parsed.aux,
			},
		}),
		{
			shape: (raw) => ({
				assets: requireData(raw),
				status: statusOf(raw),
			}),
			log: (parsed, result) => ({
				count: result.assets.length,
				start: parsed.start,
				limit: parsed.limit,
			}),
		},
	);

export const map: CoinMarketCapEndpoints['cryptocurrencyMap'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cryptocurrency.map',
			input: Inputs.cryptocurrencyMap,
			output: Outputs.cryptocurrencyMap,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/cryptocurrency/map',
			query: {
				listing_status: joinCsv(parsed.listing_status),
				start: parsed.start,
				limit: parsed.limit,
				sort: parsed.sort,
				symbol: joinCsv(parsed.symbol),
				aux: parsed.aux,
			},
		}),
		{
			shape: (raw) => ({
				cryptocurrencies: requireData(raw),
				status: statusOf(raw),
			}),
			log: (parsed, result) => ({
				count: result.cryptocurrencies.length,
				symbols: joinCsv(parsed.symbol),
			}),
		},
	);

export const quotes: CoinMarketCapEndpoints['cryptocurrencyQuotes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'cryptocurrency.quotes',
			input: Inputs.cryptocurrencyQuotes,
			output: Outputs.cryptocurrencyQuotes,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v3/cryptocurrency/quotes/latest',
			query: {
				id: joinCsv(parsed.id),
				slug: joinCsv(parsed.slug),
				symbol: joinCsv(parsed.symbol),
				convert: joinCsv(parsed.convert),
				convert_id: joinCsv(parsed.convert_id),
				aux: parsed.aux,
				skip_invalid: parsed.skip_invalid,
			},
		}),
		{
			shape: (raw) => ({
				quotes: requireData(raw),
				status: statusOf(raw),
			}),
			log: (parsed, result) => ({
				count: result.quotes.length,
				convert: joinCsv(parsed.convert),
			}),
		},
	);

/**
 * The route keys `data` by the identifier passed and, for a `symbol` or
 * `address` lookup, wraps the entries in an array because neither is unique.
 * `flattenInfo` keeps CoinMarketCap's key on every entry so a caller can tell
 * which of several same-symbol assets came back.
 */
// unknown: the raw response body; each entry is validated by the schema.
export function flattenInfo(raw: unknown): unknown[] {
	const data = asRecord(dataOf(raw));
	if (!data) return [];
	const entries: unknown[] = []; // unknown: see flattenInfo.
	for (const [key, value] of Object.entries(data)) {
		if (Array.isArray(value)) {
			for (const item of value) {
				// unknown: each item is a provider object the schema validates.
				entries.push(
					asRecord(item) ? { ...asRecord(item), lookup_key: key } : item,
				);
			}
			continue;
		}
		// unknown: same provider object, single instead of in an array.
		entries.push(
			asRecord(value) ? { ...asRecord(value), lookup_key: key } : value,
		);
	}
	return entries;
}

export const info: CoinMarketCapEndpoints['cryptocurrencyInfo'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'cryptocurrency.info',
			input: Inputs.cryptocurrencyInfo,
			output: Outputs.cryptocurrencyInfo,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v2/cryptocurrency/info',
			query: {
				id: joinCsv(parsed.id),
				slug: joinCsv(parsed.slug),
				symbol: joinCsv(parsed.symbol),
				address: parsed.address,
				// The only route that takes this one as a real boolean.
				skip_invalid: parsed.skip_invalid,
				aux: parsed.aux,
			},
		}),
		{
			shape: (raw) => ({
				cryptocurrencies: flattenInfo(raw),
				status: statusOf(raw),
			}),
			log: (parsed, result) => ({
				count: result.cryptocurrencies.length,
				slug: joinCsv(parsed.slug),
			}),
		},
	);

export const globalMetrics: CoinMarketCapEndpoints['globalMetricsQuotes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'globalMetrics.quotes',
			input: Inputs.globalMetricsQuotes,
			output: Outputs.globalMetricsQuotes,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/global-metrics/quotes/latest',
			query: {
				convert: joinCsv(parsed.convert),
				convert_id: joinCsv(parsed.convert_id),
			},
		}),
		{
			shape: (raw) => ({
				metrics: requireData(raw),
				status: statusOf(raw),
			}),
			log: (parsed) => ({ convert: joinCsv(parsed.convert) }),
		},
	);

/**
 * The route answers a single object when it converts by `id`, and an array when
 * it converts by `symbol`, because a ticker is not unique. Both become
 * `conversions`.
 */
// unknown: the raw response body; the schema validates the result.
export function toConversionList(raw: unknown): unknown {
	const data = requireData(raw);
	return Array.isArray(data) ? data : [data];
}

export const priceConversion: CoinMarketCapEndpoints['toolsPriceConversion'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tools.priceConversion',
			input: Inputs.toolsPriceConversion,
			output: Outputs.toolsPriceConversion,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v2/tools/price-conversion',
			query: {
				amount: parsed.amount,
				id: parsed.id,
				symbol: parsed.symbol,
				time: parsed.time,
				convert: joinCsv(parsed.convert),
				convert_id: joinCsv(parsed.convert_id),
			},
		}),
		{
			shape: (raw) => ({
				conversions: toConversionList(raw),
				status: statusOf(raw),
			}),
			log: (parsed) => ({
				amount: parsed.amount,
				from: parsed.id ?? parsed.symbol,
				convert: joinCsv(parsed.convert),
			}),
		},
	);

export const exchangeInfo: CoinMarketCapEndpoints['exchangeInfo'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'exchange.info',
			input: Inputs.exchangeInfo,
			output: Outputs.exchangeInfo,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/exchange/info',
			query: {
				id: joinCsv(parsed.id),
				slug: joinCsv(parsed.slug),
				aux: parsed.aux,
			},
		}),
		{
			shape: (raw) => ({
				exchanges: flattenInfo(raw),
				status: statusOf(raw),
			}),
			log: (parsed, result) => ({
				count: result.exchanges.length,
				slug: joinCsv(parsed.slug),
			}),
		},
	);

export const keyInfo: CoinMarketCapEndpoints['keyInfo'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'key.info',
			input: Inputs.keyInfo,
			output: Outputs.keyInfo,
		},
		input,
		() => ({ method: 'GET', path: '/v1/key/info' }),
		{
			shape: (raw, _parsed) => {
				// unknown: the provider's `{ plan, usage }`, which requireData checks.
				const data = asRecord(requireData(raw));
				if (!data) {
					throw new CoinMarketCapAPIError(
						'CoinMarketCap sent a key info payload that is not an object.',
						{ method: 'GET' },
					);
				}
				// plan and usage are required by the documented model, so a body
				// missing one is malformed rather than empty.
				return {
					plan: data.plan ?? {},
					usage: data.usage ?? {},
					status: statusOf(raw),
				};
			},
			log: (_, result) => ({
				planCredits: result.plan.credit_limit_monthly ?? undefined,
				minuteLeft: result.usage.current_minute?.requests_left ?? undefined,
			}),
		},
	);
