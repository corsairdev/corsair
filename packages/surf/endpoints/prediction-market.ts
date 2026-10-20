import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	PredictionMarketAnalyticsInput,
	PredictionMarketAnalyticsOutput,
	PredictionMarketCorrelationsInput,
	PredictionMarketCorrelationsOutput,
	PredictionMarketKalshiEventsInput,
	PredictionMarketKalshiEventsOutput,
	PredictionMarketKalshiMarketsInput,
	PredictionMarketKalshiMarketsOutput,
	PredictionMarketKalshiOpenInterestInput,
	PredictionMarketKalshiOpenInterestOutput,
	PredictionMarketKalshiOrderbooksInput,
	PredictionMarketKalshiOrderbooksOutput,
	PredictionMarketKalshiPricesInput,
	PredictionMarketKalshiPricesOutput,
	PredictionMarketKalshiTradesInput,
	PredictionMarketKalshiTradesOutput,
	PredictionMarketKalshiVolumesInput,
	PredictionMarketKalshiVolumesOutput,
	PredictionMarketMatchingDailyInput,
	PredictionMarketMatchingDailyOutput,
	PredictionMarketMatchingPairsInput,
	PredictionMarketMatchingPairsOutput,
	PredictionMarketPolymarketEventsInput,
	PredictionMarketPolymarketEventsOutput,
	PredictionMarketPolymarketLeaderboardInput,
	PredictionMarketPolymarketLeaderboardOutput,
	PredictionMarketPolymarketMarketsInput,
	PredictionMarketPolymarketMarketsOutput,
	PredictionMarketPolymarketOpenInterestInput,
	PredictionMarketPolymarketOpenInterestOutput,
	PredictionMarketPolymarketOrderbooksInput,
	PredictionMarketPolymarketOrderbooksOutput,
	PredictionMarketPolymarketPositionsInput,
	PredictionMarketPolymarketPositionsOutput,
	PredictionMarketPolymarketPriceOhlcvConditionIdInput,
	PredictionMarketPolymarketPriceOhlcvConditionIdOutput,
	PredictionMarketPolymarketPricesInput,
	PredictionMarketPolymarketPricesOutput,
	PredictionMarketPolymarketSmartMoneyInput,
	PredictionMarketPolymarketSmartMoneyOutput,
	PredictionMarketPolymarketTradesInput,
	PredictionMarketPolymarketTradesOutput,
	PredictionMarketPolymarketVolumeSplitConditionIdInput,
	PredictionMarketPolymarketVolumeSplitConditionIdOutput,
	PredictionMarketPolymarketVolumesInput,
	PredictionMarketPolymarketVolumesOutput,
} from './types';

export const PredictionMarket = {
	analytics: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketAnalytics'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.analytics',
			PredictionMarketAnalyticsInput,
			PredictionMarketAnalyticsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/analytics',
				query: omitEmpty({
					category: validated.category,
					platform: validated.platform,
					time_range: validated.time_range,
					top_n: validated.top_n,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ category: String(validated.category ?? '') }),
		),
	correlations: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketCorrelations'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.correlations',
			PredictionMarketCorrelationsInput,
			PredictionMarketCorrelationsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/correlations',
				query: omitEmpty({
					category: validated.category,
					condition_id: validated.condition_id,
					min_correlation: validated.min_correlation,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ category: String(validated.category ?? '') }),
		),
	kalshiEvents: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiEvents'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiEvents',
			PredictionMarketKalshiEventsInput,
			PredictionMarketKalshiEventsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/events',
				query: omitEmpty({
					event_ticker: validated.event_ticker,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ event_ticker: String(validated.event_ticker ?? '') }),
		),
	kalshiMarkets: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiMarkets'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiMarkets',
			PredictionMarketKalshiMarketsInput,
			PredictionMarketKalshiMarketsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/markets',
				query: omitEmpty({
					market_ticker: validated.market_ticker,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ market_ticker: String(validated.market_ticker ?? '') }),
		),
	kalshiOpenInterest: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiOpenInterest'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiOpenInterest',
			PredictionMarketKalshiOpenInterestInput,
			PredictionMarketKalshiOpenInterestOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/open-interest',
				query: omitEmpty({
					ticker: validated.ticker,
					time_range: validated.time_range,
				}),
			}),
			(validated) => ({ ticker: String(validated.ticker ?? '') }),
		),
	kalshiOrderbooks: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiOrderbooks'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiOrderbooks',
			PredictionMarketKalshiOrderbooksInput,
			PredictionMarketKalshiOrderbooksOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/orderbooks',
				query: omitEmpty({
					ticker: validated.ticker,
					start_time: validated.start_time,
					end_time: validated.end_time,
					limit: validated.limit,
					pagination_key: validated.pagination_key,
				}),
			}),
			(validated) => ({ ticker: String(validated.ticker ?? '') }),
		),
	kalshiPrices: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiPrices'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiPrices',
			PredictionMarketKalshiPricesInput,
			PredictionMarketKalshiPricesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/prices',
				query: omitEmpty({
					ticker: validated.ticker,
					time_range: validated.time_range,
					interval: validated.interval,
				}),
			}),
			(validated) => ({ ticker: String(validated.ticker ?? '') }),
		),
	kalshiTrades: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiTrades'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiTrades',
			PredictionMarketKalshiTradesInput,
			PredictionMarketKalshiTradesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/trades',
				query: omitEmpty({
					ticker: validated.ticker,
					taker_side: validated.taker_side,
					min_amount: validated.min_amount,
					from: validated.from,
					to: validated.to,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ ticker: String(validated.ticker ?? '') }),
		),
	kalshiVolumes: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketKalshiVolumes'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.kalshiVolumes',
			PredictionMarketKalshiVolumesInput,
			PredictionMarketKalshiVolumesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/kalshi/volumes',
				query: omitEmpty({
					ticker: validated.ticker,
					time_range: validated.time_range,
				}),
			}),
			(validated) => ({ ticker: String(validated.ticker ?? '') }),
		),
	matchingDaily: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketMatchingDaily'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.matchingDaily',
			PredictionMarketMatchingDailyInput,
			PredictionMarketMatchingDailyOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/matching/daily',
				query: omitEmpty({
					polymarket_condition_id: validated.polymarket_condition_id,
					kalshi_market_ticker: validated.kalshi_market_ticker,
					time_range: validated.time_range,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({
				polymarket_condition_id: String(
					validated.polymarket_condition_id ?? '',
				),
			}),
		),
	matchingPairs: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketMatchingPairs'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.matchingPairs',
			PredictionMarketMatchingPairsInput,
			PredictionMarketMatchingPairsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/matching/pairs',
				query: omitEmpty({
					category: validated.category,
					match_type: validated.match_type,
					active_only: validated.active_only,
					min_confidence: validated.min_confidence,
					polymarket_condition_id: validated.polymarket_condition_id,
					kalshi_market_ticker: validated.kalshi_market_ticker,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ category: String(validated.category ?? '') }),
		),
	polymarketEvents: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketEvents'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketEvents',
			PredictionMarketPolymarketEventsInput,
			PredictionMarketPolymarketEventsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/events',
				query: omitEmpty({
					event_slug: validated.event_slug,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ event_slug: String(validated.event_slug ?? '') }),
		),
	polymarketLeaderboard: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketLeaderboard'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketLeaderboard',
			PredictionMarketPolymarketLeaderboardInput,
			PredictionMarketPolymarketLeaderboardOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/leaderboard',
				query: omitEmpty({
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ sort_by: String(validated.sort_by ?? '') }),
		),
	polymarketMarkets: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketMarkets'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketMarkets',
			PredictionMarketPolymarketMarketsInput,
			PredictionMarketPolymarketMarketsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/markets',
				query: omitEmpty({
					market_slug: validated.market_slug,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ market_slug: String(validated.market_slug ?? '') }),
		),
	polymarketOpenInterest: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketOpenInterest'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketOpenInterest',
			PredictionMarketPolymarketOpenInterestInput,
			PredictionMarketPolymarketOpenInterestOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/open-interest',
				query: omitEmpty({
					condition_id: validated.condition_id,
					time_range: validated.time_range,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
	polymarketOrderbooks: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketOrderbooks'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketOrderbooks',
			PredictionMarketPolymarketOrderbooksInput,
			PredictionMarketPolymarketOrderbooksOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/orderbooks',
				query: omitEmpty({
					token_id: validated.token_id,
					start_time: validated.start_time,
					end_time: validated.end_time,
					limit: validated.limit,
					pagination_key: validated.pagination_key,
				}),
			}),
			(validated) => ({ token_id: String(validated.token_id ?? '') }),
		),
	polymarketPositions: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketPositions'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketPositions',
			PredictionMarketPolymarketPositionsInput,
			PredictionMarketPolymarketPositionsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/positions',
				query: omitEmpty({
					address: validated.address,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	polymarketPriceOhlcvConditionId: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketPriceOhlcvConditionId'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketPriceOhlcvConditionId',
			PredictionMarketPolymarketPriceOhlcvConditionIdInput,
			PredictionMarketPolymarketPriceOhlcvConditionIdOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/price-ohlcv/{condition_id}',
				path: { condition_id: validated.condition_id },
				query: omitEmpty({
					start_time: validated.start_time,
					end_time: validated.end_time,
					interval: validated.interval,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
	polymarketPrices: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketPrices'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketPrices',
			PredictionMarketPolymarketPricesInput,
			PredictionMarketPolymarketPricesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/prices',
				query: omitEmpty({
					condition_id: validated.condition_id,
					time_range: validated.time_range,
					interval: validated.interval,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
	polymarketSmartMoney: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketSmartMoney'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketSmartMoney',
			PredictionMarketPolymarketSmartMoneyInput,
			PredictionMarketPolymarketSmartMoneyOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/smart-money',
				query: omitEmpty({
					view: validated.view,
					condition_id: validated.condition_id,
					category: validated.category,
					direction: validated.direction,
					whale_tier: validated.whale_tier,
					from: validated.from,
					to: validated.to,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ view: String(validated.view ?? '') }),
		),
	polymarketTrades: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketTrades'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketTrades',
			PredictionMarketPolymarketTradesInput,
			PredictionMarketPolymarketTradesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/trades',
				query: omitEmpty({
					condition_id: validated.condition_id,
					address: validated.address,
					type: validated.type,
					outcome_label: validated.outcome_label,
					min_amount: validated.min_amount,
					from: validated.from,
					to: validated.to,
					sort_by: validated.sort_by,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
	polymarketVolumeSplitConditionId: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketVolumeSplitConditionId'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketVolumeSplitConditionId',
			PredictionMarketPolymarketVolumeSplitConditionIdInput,
			PredictionMarketPolymarketVolumeSplitConditionIdOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/volume-split/{condition_id}',
				path: { condition_id: validated.condition_id },
				query: omitEmpty({
					granularity: validated.granularity,
					start_time: validated.start_time,
					end_time: validated.end_time,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
	polymarketVolumes: (
		ctx: SurfContext,
		input: SurfEndpointInputs['predictionMarketPolymarketVolumes'],
	) =>
		callSurf(
			ctx,
			'predictionMarket.polymarketVolumes',
			PredictionMarketPolymarketVolumesInput,
			PredictionMarketPolymarketVolumesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/prediction-market/polymarket/volumes',
				query: omitEmpty({
					condition_id: validated.condition_id,
					token_id: validated.token_id,
					time_range: validated.time_range,
					interval: validated.interval,
					granularity: validated.granularity,
					start_time: validated.start_time,
					end_time: validated.end_time,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
