import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	MarketEtfInput,
	MarketExchangeFlowExchangesInput,
	MarketFearGreedInput,
	MarketFuturesInput,
	MarketLiquidationChartInput,
	MarketLiquidationExchangeListInput,
	MarketLiquidationOrderInput,
	MarketListingInput,
	MarketOnchainIndicatorInput,
	MarketOptionsInput,
	MarketPriceIndicatorInput,
	MarketPriceInput,
	MarketPublicSaleInput,
	MarketRankingInput,
	MarketTgeInput,
	SurfResponse,
} from './types';

export const Market = {
	etf: (ctx: SurfContext, input: SurfEndpointInputs['marketEtf']) =>
		callSurf(
			ctx,
			'market.etf',
			MarketEtfInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/etf',
				query: omitEmpty({
					symbol: validated.symbol,
					sort_by: validated.sort_by,
					order: validated.order,
					from: validated.from,
					to: validated.to,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	exchangeFlowExchanges: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketExchangeFlowExchanges'],
	) =>
		callSurf(
			ctx,
			'market.exchangeFlowExchanges',
			MarketExchangeFlowExchangesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/exchange-flow/exchanges',
				query: omitEmpty({
					symbol: validated.symbol,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	fearGreed: (ctx: SurfContext, input: SurfEndpointInputs['marketFearGreed']) =>
		callSurf(
			ctx,
			'market.fearGreed',
			MarketFearGreedInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/fear-greed',
				query: omitEmpty({ from: validated.from, to: validated.to }),
			}),
			(validated) => ({ from: String(validated.from ?? '') }),
		),
	futures: (ctx: SurfContext, input: SurfEndpointInputs['marketFutures']) =>
		callSurf(
			ctx,
			'market.futures',
			MarketFuturesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/futures',
				query: omitEmpty({
					sort_by: validated.sort_by,
					order: validated.order,
				}),
			}),
			(validated) => ({ sort_by: String(validated.sort_by ?? '') }),
		),
	liquidationChart: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketLiquidationChart'],
	) =>
		callSurf(
			ctx,
			'market.liquidationChart',
			MarketLiquidationChartInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/liquidation/chart',
				query: omitEmpty({
					symbol: validated.symbol,
					interval: validated.interval,
					exchange: validated.exchange,
					limit: validated.limit,
					from: validated.from,
					to: validated.to,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	liquidationExchangeList: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketLiquidationExchangeList'],
	) =>
		callSurf(
			ctx,
			'market.liquidationExchangeList',
			MarketLiquidationExchangeListInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/liquidation/exchange-list',
				query: omitEmpty({
					symbol: validated.symbol,
					time_range: validated.time_range,
					sort_by: validated.sort_by,
					order: validated.order,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	liquidationOrder: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketLiquidationOrder'],
	) =>
		callSurf(
			ctx,
			'market.liquidationOrder',
			MarketLiquidationOrderInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/liquidation/order',
				query: omitEmpty({
					exchange: validated.exchange,
					symbol: validated.symbol,
					min_amount: validated.min_amount,
					side: validated.side,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
					from: validated.from,
					to: validated.to,
				}),
			}),
			(validated) => ({ exchange: String(validated.exchange ?? '') }),
		),
	listing: (ctx: SurfContext, input: SurfEndpointInputs['marketListing']) =>
		callSurf(
			ctx,
			'market.listing',
			MarketListingInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/listing',
				query: omitEmpty({
					from: validated.from,
					to: validated.to,
					symbol: validated.symbol,
					exchange: validated.exchange,
					product: validated.product,
					type: validated.type,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ from: String(validated.from ?? '') }),
		),
	onchainIndicator: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketOnchainIndicator'],
	) =>
		callSurf(
			ctx,
			'market.onchainIndicator',
			MarketOnchainIndicatorInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/onchain-indicator',
				query: omitEmpty({
					symbol: validated.symbol,
					metric: validated.metric,
					granularity: validated.granularity,
					from: validated.from,
					to: validated.to,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	options: (ctx: SurfContext, input: SurfEndpointInputs['marketOptions']) =>
		callSurf(
			ctx,
			'market.options',
			MarketOptionsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/options',
				query: omitEmpty({
					symbol: validated.symbol,
					sort_by: validated.sort_by,
					order: validated.order,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	price: (ctx: SurfContext, input: SurfEndpointInputs['marketPrice']) =>
		callSurf(
			ctx,
			'market.price',
			MarketPriceInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/price',
				query: omitEmpty({
					symbol: validated.symbol,
					time_range: validated.time_range,
					from: validated.from,
					to: validated.to,
					currency: validated.currency,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	priceIndicator: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketPriceIndicator'],
	) =>
		callSurf(
			ctx,
			'market.priceIndicator',
			MarketPriceIndicatorInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/price-indicator',
				query: omitEmpty({
					indicator: validated.indicator,
					symbol: validated.symbol,
					interval: validated.interval,
					exchange: validated.exchange,
					from: validated.from,
					to: validated.to,
					options: validated.options,
				}),
			}),
			(validated) => ({ indicator: String(validated.indicator ?? '') }),
		),
	publicSale: (
		ctx: SurfContext,
		input: SurfEndpointInputs['marketPublicSale'],
	) =>
		callSurf(
			ctx,
			'market.publicSale',
			MarketPublicSaleInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/public-sale',
				query: omitEmpty({ id: validated.id, q: validated.q }),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	ranking: (ctx: SurfContext, input: SurfEndpointInputs['marketRanking']) =>
		callSurf(
			ctx,
			'market.ranking',
			MarketRankingInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/ranking',
				query: omitEmpty({
					sort_by: validated.sort_by,
					order: validated.order,
					category: validated.category,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ sort_by: String(validated.sort_by ?? '') }),
		),
	tge: (ctx: SurfContext, input: SurfEndpointInputs['marketTge']) =>
		callSurf(
			ctx,
			'market.tge',
			MarketTgeInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/market/tge',
				query: omitEmpty({ id: validated.id, q: validated.q }),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
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
