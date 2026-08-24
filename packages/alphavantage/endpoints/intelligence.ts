import { logEventFromContext } from 'corsair/core';
import {
	makeAlphaVantageAnalyticsRequest,
	makeAlphaVantageRequest,
} from '../client';
import type { AlphaVantageEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactQuery, listParam } from './shared';
import type { AlphaVantageEndpointOutputs } from './types';

/**
 * Market news with per-article and per-ticker sentiment scores.
 *
 * Note the asymmetry in the response: the article-level sentiment scores are
 * JSON numbers while the ticker-level ones are strings. Both are modelled as
 * the provider sends them rather than normalised, so a caller can tell which
 * field it is reading.
 */
export const newsSentiment: AlphaVantageEndpoints['intelligenceNewsSentiment'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['intelligenceNewsSentiment']
		>(
			'NEWS_SENTIMENT',
			ctx.key,
			compactQuery({
				tickers: listParam(input.tickers),
				topics: listParam(input.topics),
				time_from: input.time_from,
				time_to: input.time_to,
				sort: input.sort,
				limit: input.limit,
			}),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.intelligence.newsSentiment',
			// Tickers and topics are omitted: together they describe a watchlist.
			auditPayload(input, ['sort', 'limit']),
			'completed',
		);
		return result;
	};

/**
 * Rolling-window statistics (mean, variance, correlation and similar) over a
 * set of tickers.
 *
 * This is the one operation not served from the main query endpoint: it lives
 * on `alphavantageapi.co`, is addressed by path rather than by a `function`
 * parameter, and takes upper-case query parameters. The lower-case input here
 * is mapped onto that convention.
 */
export const slidingWindowAnalytics: AlphaVantageEndpoints['intelligenceSlidingWindowAnalytics'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageAnalyticsRequest<
			AlphaVantageEndpointOutputs['intelligenceSlidingWindowAnalytics']
		>(
			'timeseries/running_analytics',
			ctx.key,
			compactQuery({
				SYMBOLS: listParam(input.symbols),
				RANGE: input.range,
				INTERVAL: input.interval,
				WINDOW_SIZE: input.window_size,
				CALCULATIONS: listParam(input.calculations),
				OHLC: input.ohlc,
			}),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.intelligence.slidingWindowAnalytics',
			{
				symbolCount: input.symbols.length,
				interval: input.interval,
				window_size: input.window_size,
			},
			'completed',
		);
		return result;
	};

/**
 * The full options chain for one symbol on one date.
 *
 * Premium-plan only. On the free tier Alpha Vantage answers with a notice
 * rather than data or an error, which the client turns into a permission error.
 */
export const historicalOptions: AlphaVantageEndpoints['intelligenceHistoricalOptions'] =
	async (ctx, input) => {
		const result = await makeAlphaVantageRequest<
			AlphaVantageEndpointOutputs['intelligenceHistoricalOptions']
		>(
			'HISTORICAL_OPTIONS',
			ctx.key,
			compactQuery({ symbol: input.symbol, date: input.date }),
		);

		await logEventFromContext(
			ctx,
			'alphavantage.intelligence.historicalOptions',
			auditPayload(input, ['symbol', 'date']),
			'completed',
		);
		return result;
	};
