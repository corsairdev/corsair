import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	EquityBalanceSheetInput,
	EquityCandlesInput,
	EquityCashFlowInput,
	EquityEtfHoldingsInput,
	EquityFilingsInput,
	EquityIncomeStatementInput,
	EquityLatestFilingsInput,
	EquityLatestFinancialsInput,
	EquityListingsInput,
	EquityMetaInput,
	EquityMetricsInput,
	EquityOverviewInput,
	EquityProfileInput,
	EquitySegmentsInput,
	SurfResponse,
} from './types';

export const Equity = {
	balanceSheet: (
		ctx: SurfContext,
		input: SurfEndpointInputs['equityBalanceSheet'],
	) =>
		callSurf(
			ctx,
			'equity.balanceSheet',
			EquityBalanceSheetInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/balance-sheet',
				query: omitEmpty({
					symbol: validated.symbol,
					period: validated.period,
					end_date: validated.end_date,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	candles: (ctx: SurfContext, input: SurfEndpointInputs['equityCandles']) =>
		callSurf(
			ctx,
			'equity.candles',
			EquityCandlesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/candles',
				query: omitEmpty({
					symbol: validated.symbol,
					interval: validated.interval,
					interval_multiplier: validated.interval_multiplier,
					start_date: validated.start_date,
					end_date: validated.end_date,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	cashFlow: (ctx: SurfContext, input: SurfEndpointInputs['equityCashFlow']) =>
		callSurf(
			ctx,
			'equity.cashFlow',
			EquityCashFlowInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/cash-flow',
				query: omitEmpty({
					symbol: validated.symbol,
					period: validated.period,
					end_date: validated.end_date,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	etfHoldings: (
		ctx: SurfContext,
		input: SurfEndpointInputs['equityEtfHoldings'],
	) =>
		callSurf(
			ctx,
			'equity.etfHoldings',
			EquityEtfHoldingsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/etf/holdings',
				query: omitEmpty({
					symbol: validated.symbol,
					as_of: validated.as_of,
					asset_class: validated.asset_class,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	filings: (ctx: SurfContext, input: SurfEndpointInputs['equityFilings']) =>
		callSurf(
			ctx,
			'equity.filings',
			EquityFilingsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/filings',
				query: omitEmpty({
					symbol: validated.symbol,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	incomeStatement: (
		ctx: SurfContext,
		input: SurfEndpointInputs['equityIncomeStatement'],
	) =>
		callSurf(
			ctx,
			'equity.incomeStatement',
			EquityIncomeStatementInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/income-statement',
				query: omitEmpty({
					symbol: validated.symbol,
					period: validated.period,
					end_date: validated.end_date,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	latestFilings: (
		ctx: SurfContext,
		input: SurfEndpointInputs['equityLatestFilings'],
	) =>
		callSurf(
			ctx,
			'equity.latestFilings',
			EquityLatestFilingsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/latest-filings',
				query: omitEmpty({ limit: validated.limit }),
			}),
			(validated) => ({ limit: String(validated.limit ?? '') }),
		),
	latestFinancials: (
		ctx: SurfContext,
		input: SurfEndpointInputs['equityLatestFinancials'],
	) =>
		callSurf(
			ctx,
			'equity.latestFinancials',
			EquityLatestFinancialsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/latest-financials',
				query: omitEmpty({
					limit: validated.limit,
					market_cap_min: validated.market_cap_min,
				}),
			}),
			(validated) => ({ limit: String(validated.limit ?? '') }),
		),
	listings: (ctx: SurfContext, input: SurfEndpointInputs['equityListings']) =>
		callSurf(
			ctx,
			'equity.listings',
			EquityListingsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/listings',
				query: omitEmpty({
					symbol: validated.symbol,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	meta: (ctx: SurfContext, input: SurfEndpointInputs['equityMeta']) =>
		callSurf(
			ctx,
			'equity.meta',
			EquityMetaInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/meta',
				query: omitEmpty({
					symbol: validated.symbol,
					include_tokenized: validated.include_tokenized,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	metrics: (ctx: SurfContext, input: SurfEndpointInputs['equityMetrics']) =>
		callSurf(
			ctx,
			'equity.metrics',
			EquityMetricsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/metrics',
				query: omitEmpty({
					symbol: validated.symbol,
					period: validated.period,
					end_date: validated.end_date,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	overview: (ctx: SurfContext, input: SurfEndpointInputs['equityOverview']) =>
		callSurf(
			ctx,
			'equity.overview',
			EquityOverviewInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/overview',
				query: omitEmpty({
					symbol: validated.symbol,
					period: validated.period,
					end_date: validated.end_date,
					limit: validated.limit,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	profile: (ctx: SurfContext, input: SurfEndpointInputs['equityProfile']) =>
		callSurf(
			ctx,
			'equity.profile',
			EquityProfileInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/profile',
				query: omitEmpty({ symbol: validated.symbol }),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
		),
	segments: (ctx: SurfContext, input: SurfEndpointInputs['equitySegments']) =>
		callSurf(
			ctx,
			'equity.segments',
			EquitySegmentsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/equity/segments',
				query: omitEmpty({
					symbol: validated.symbol,
					period: validated.period,
					statement_type: validated.statement_type,
					metric_code: validated.metric_code,
					dimension_type: validated.dimension_type,
					label: validated.label,
					start_date: validated.start_date,
					end_date: validated.end_date,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ symbol: String(validated.symbol ?? '') }),
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
