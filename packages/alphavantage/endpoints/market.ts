import { logEventFromContext } from 'corsair/core';
import { makeAlphaVantageCsvRequest, makeAlphaVantageRequest } from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheSymbols } from './persist';
import { compactQuery } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * Searches securities by name or ticker fragment, and mirrors the matches into
 * the local symbol cache so a later lookup does not spend another request.
 */
export const symbolSearch: AlphaVantageEndpoints['marketSymbolSearch'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['marketSymbolSearch']
	>('SYMBOL_SEARCH', ctx.key, compactQuery({ keywords: input.keywords }));

	const matches = result.bestMatches ?? [];
	await cacheSymbols(
		ctx.db.symbols,
		matches.map((match) => ({
			symbol: match['1. symbol'],
			name: match['2. name'],
			assetType: match['3. type'],
			region: match['4. region'],
			marketOpen: match['5. marketOpen'],
			marketClose: match['6. marketClose'],
			timezone: match['7. timezone'],
			currency: match['8. currency'],
		})),
	);

	await logEventFromContext(
		ctx,
		'alphavantage.market.symbolSearch',
		// The search term itself is omitted: it is caller-authored free text.
		{ matches: matches.length },
		'completed',
	);
	return result;
};

/** Open/closed state of the major global exchanges. */
export const status: AlphaVantageEndpoints['marketStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['marketStatus']
	>('MARKET_STATUS', ctx.key);

	await logEventFromContext(
		ctx,
		'alphavantage.market.status',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

/** The day's largest movers and most actively traded US tickers. */
export const topGainersLosers: AlphaVantageEndpoints['marketTopGainersLosers'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['marketTopGainersLosers']
		>('TOP_GAINERS_LOSERS', ctx.key);

		await logEventFromContext(
			ctx,
			'alphavantage.market.topGainersLosers',
			auditPayload(input, []),
			'completed',
		);
		return result;
	};

/**
 * Every security Alpha Vantage covers, active or delisted.
 *
 * This operation answers with CSV rather than JSON, so it goes through the
 * CSV transport and is returned as parsed rows. The payload is around a
 * megabyte, which is why the rows are also written to the symbol cache.
 */
export const listingStatus: AlphaVantageEndpoints['marketListingStatus'] =
	async (ctx, input) => {
		const rows = await makeAlphaVantageCsvRequest(
			'LISTING_STATUS',
			ctx.key,
			compactQuery({ date: input.date, state: input.state }),
		);

		await cacheSymbols(
			ctx.db.symbols,
			rows.map((row) => ({
				symbol: row.symbol,
				name: row.name,
				exchange: row.exchange,
				assetType: row.assetType,
				ipoDate: row.ipoDate,
				// Alpha Vantage writes the string "null" for a security still listed.
				delistingDate: row.delistingDate === 'null' ? null : row.delistingDate,
				status: row.status,
			})),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.market.listingStatus',
			{ ...auditPayload(input, ['date', 'state']), rows: rows.length },
			'completed',
		);
		return rows;
	};

/**
 * Sector performance.
 *
 * Alpha Vantage has deprecated this function: it still responds 200 but the
 * body is an empty object. The operation is implemented because the catalog
 * lists it, and the empty response is returned rather than being reported as an
 * error, since an empty body is the endpoint's actual current behaviour and not
 * a failure of this call.
 */
export const sector: AlphaVantageEndpoints['marketSector'] = async (
	ctx,
	input,
) => {
	const result = await makeAlphaVantageRequest<
		AlphaVantageEndpointOutputs['marketSector']
	>('SECTOR', ctx.key);

	if (Object.keys(result).length === 0) {
		console.warn(
			'[ALPHAVANTAGE:market.sector] SECTOR is deprecated upstream and returned an empty body',
		);
	}

	await logEventFromContext(
		ctx,
		'alphavantage.market.sector',
		auditPayload(input, []),
		'completed',
	);
	return result;
};
