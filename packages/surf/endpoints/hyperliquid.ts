import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	HyperliquidAccountInput,
	HyperliquidAccountOutput,
	HyperliquidCandlesInput,
	HyperliquidCandlesOutput,
	HyperliquidFillsInput,
	HyperliquidFillsOutput,
	HyperliquidLeaderboardInput,
	HyperliquidLeaderboardOutput,
	HyperliquidOrdersInput,
	HyperliquidOrdersOutput,
	HyperliquidPerformanceInput,
	HyperliquidPerformanceOutput,
	HyperliquidPositionsInput,
	HyperliquidPositionsOutput,
	HyperliquidTradesAggregateInput,
	HyperliquidTradesAggregateOutput,
	HyperliquidTradesContextInput,
	HyperliquidTradesContextOutput,
	HyperliquidTradesInput,
	HyperliquidTradesOutput,
} from './types';

export const Hyperliquid = {
	account: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidAccount'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.account',
			HyperliquidAccountInput,
			HyperliquidAccountOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/account',
				query: omitEmpty({ address: validated.address }),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	candles: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidCandles'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.candles',
			HyperliquidCandlesInput,
			HyperliquidCandlesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/candles',
				query: omitEmpty({
					symbol: validated.symbol,
					interval: validated.interval,
					from: validated.from,
					to: validated.to,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	fills: (ctx: SurfContext, input: SurfEndpointInputs['hyperliquidFills']) =>
		callSurf(
			ctx,
			'hyperliquid.fills',
			HyperliquidFillsInput,
			HyperliquidFillsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/fills',
				query: omitEmpty({
					address: validated.address,
					from: validated.from,
					to: validated.to,
					to_ms: validated.to_ms,
					to_fill_id: validated.to_fill_id,
					order: validated.order,
					cursor: validated.cursor,
					symbol: validated.symbol,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	leaderboard: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidLeaderboard'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.leaderboard',
			HyperliquidLeaderboardInput,
			HyperliquidLeaderboardOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/leaderboard',
				query: omitEmpty({
					time_range: validated.time_range,
					sort_by: validated.sort_by,
					min_trades: validated.min_trades,
					min_days_active: validated.min_days_active,
					min_account_age_days: validated.min_account_age_days,
					min_human_score: validated.min_human_score,
					dex: validated.dex,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ time_range: String(validated.time_range ?? '') }),
		),
	orders: (ctx: SurfContext, input: SurfEndpointInputs['hyperliquidOrders']) =>
		callSurf(
			ctx,
			'hyperliquid.orders',
			HyperliquidOrdersInput,
			HyperliquidOrdersOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/orders',
				query: omitEmpty({
					address: validated.address,
					open_limit: validated.open_limit,
					historical_limit: validated.historical_limit,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	performance: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidPerformance'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.performance',
			HyperliquidPerformanceInput,
			HyperliquidPerformanceOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/performance',
				query: omitEmpty({ address: validated.address, dex: validated.dex }),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	positions: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidPositions'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.positions',
			HyperliquidPositionsInput,
			HyperliquidPositionsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/positions',
				query: omitEmpty({ address: validated.address, dex: validated.dex }),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	trades: (ctx: SurfContext, input: SurfEndpointInputs['hyperliquidTrades']) =>
		callSurf(
			ctx,
			'hyperliquid.trades',
			HyperliquidTradesInput,
			HyperliquidTradesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/trades',
				query: omitEmpty({
					address: validated.address,
					symbol: validated.symbol,
					direction: validated.direction,
					dex: validated.dex,
					from: validated.from,
					to: validated.to,
					cursor: validated.cursor,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	tradesAggregate: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidTradesAggregate'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.tradesAggregate',
			HyperliquidTradesAggregateInput,
			HyperliquidTradesAggregateOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/trades/aggregate',
				query: omitEmpty({
					address: validated.address,
					group_by: validated.group_by,
					from: validated.from,
					to: validated.to,
					dex: validated.dex,
					fill_gaps: validated.fill_gaps,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	tradesContext: (
		ctx: SurfContext,
		input: SurfEndpointInputs['hyperliquidTradesContext'],
	) =>
		callSurf(
			ctx,
			'hyperliquid.tradesContext',
			HyperliquidTradesContextInput,
			HyperliquidTradesContextOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/hyperliquid/trades/context',
				query: omitEmpty({
					address: validated.address,
					symbol: validated.symbol,
					direction: validated.direction,
					open_time: validated.open_time,
					close_time: validated.close_time,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
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
