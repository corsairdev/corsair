import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	ExchangeCandlesInput,
	ExchangeCoverageInput,
	ExchangeDepthInput,
	ExchangeFundingHistoryInput,
	ExchangeKlinesInput,
	ExchangeLongShortRatioInput,
	ExchangeMarketsInput,
	ExchangePerpInput,
	ExchangePriceInput,
	SurfResponse,
} from './types';

export const Exchange = {
	candles: (ctx: SurfContext, input: SurfEndpointInputs['exchangeCandles']) =>
		callSurf(
			ctx,
			'exchange.candles',
			ExchangeCandlesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/candles',
				query: omitEmpty({
					exchange: validated.exchange,
					pair: validated.pair,
					interval: validated.interval,
					from: validated.from,
					to: validated.to,
					include_synthetic: validated.include_synthetic,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ exchange: String(validated.exchange ?? '') }),
		),
	coverage: (ctx: SurfContext, input: SurfEndpointInputs['exchangeCoverage']) =>
		callSurf(
			ctx,
			'exchange.coverage',
			ExchangeCoverageInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/coverage',
				query: omitEmpty({
					exchange: validated.exchange,
					q: validated.q,
					quote: validated.quote,
					type: validated.type,
					status: validated.status,
					data_status: validated.data_status,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ exchange: String(validated.exchange ?? '') }),
		),
	depth: (ctx: SurfContext, input: SurfEndpointInputs['exchangeDepth']) =>
		callSurf(
			ctx,
			'exchange.depth',
			ExchangeDepthInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/depth',
				query: omitEmpty({
					pair: validated.pair,
					type: validated.type,
					limit: validated.limit,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ pair: String(validated.pair ?? '') }),
		),
	fundingHistory: (
		ctx: SurfContext,
		input: SurfEndpointInputs['exchangeFundingHistory'],
	) =>
		callSurf(
			ctx,
			'exchange.fundingHistory',
			ExchangeFundingHistoryInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/funding-history',
				query: omitEmpty({
					pair: validated.pair,
					from: validated.from,
					limit: validated.limit,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ pair: String(validated.pair ?? '') }),
		),
	klines: (ctx: SurfContext, input: SurfEndpointInputs['exchangeKlines']) =>
		callSurf(
			ctx,
			'exchange.klines',
			ExchangeKlinesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/klines',
				query: omitEmpty({
					pair: validated.pair,
					type: validated.type,
					interval: validated.interval,
					from: validated.from,
					limit: validated.limit,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ pair: String(validated.pair ?? '') }),
		),
	longShortRatio: (
		ctx: SurfContext,
		input: SurfEndpointInputs['exchangeLongShortRatio'],
	) =>
		callSurf(
			ctx,
			'exchange.longShortRatio',
			ExchangeLongShortRatioInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/long-short-ratio',
				query: omitEmpty({
					pair: validated.pair,
					interval: validated.interval,
					from: validated.from,
					limit: validated.limit,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ pair: String(validated.pair ?? '') }),
		),
	markets: (ctx: SurfContext, input: SurfEndpointInputs['exchangeMarkets']) =>
		callSurf(
			ctx,
			'exchange.markets',
			ExchangeMarketsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/markets',
				query: omitEmpty({
					exchange: validated.exchange,
					type: validated.type,
					base: validated.base,
					quote: validated.quote,
					search: validated.search,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ exchange: String(validated.exchange ?? '') }),
		),
	perp: (ctx: SurfContext, input: SurfEndpointInputs['exchangePerp']) =>
		callSurf(
			ctx,
			'exchange.perp',
			ExchangePerpInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/perp',
				query: omitEmpty({
					pair: validated.pair,
					fields: validated.fields,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ pair: String(validated.pair ?? '') }),
		),
	price: (ctx: SurfContext, input: SurfEndpointInputs['exchangePrice']) =>
		callSurf(
			ctx,
			'exchange.price',
			ExchangePriceInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/exchange/price',
				query: omitEmpty({
					pair: validated.pair,
					type: validated.type,
					exchange: validated.exchange,
				}),
			}),
			(validated) => ({ pair: String(validated.pair ?? '') }),
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
