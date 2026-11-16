import type { TwelveDataEndpoints } from '..';
import { call } from './call';
import {
	TwelveDataEndpointInputSchemas,
	TwelveDataEndpointOutputSchemas,
} from './types';

/**
 * The 24 technical indicators share one route shape: a path named after the
 * indicator, plus `symbol`, `interval`, `time_period`, `series_type`,
 * `outputsize` and `exchange`. Each one answers a different set of decimal
 * strings, so the output schema is the open indicator record.
 *
 * Twelve Data has no `/vwma` route (it answers 404), and it documents no route
 * for `vwap` or `ht_trendline` on the free surface, so none is wrapped.
 */
function indicator(
	path: string,
	event: string,
): (
	ctx: Parameters<NonNullable<TwelveDataEndpoints['rsi']>>[0],
	input: never,
) => Promise<unknown> {
	return async (ctx, input) =>
		call(
			ctx,
			{
				event,
				operation: `indicators.${event}`,
				input: TwelveDataEndpointInputSchemas.rsi,
				output: TwelveDataEndpointOutputSchemas.rsi,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path,
				query: {
					symbol: parsed.symbol,
					interval: parsed.interval,
					time_period: parsed.time_period,
					series_type: parsed.series_type,
					outputsize: parsed.outputsize,
					exchange: parsed.exchange,
				},
			}),
			{
				log: (parsed, result) => ({
					symbol: parsed.symbol,
					interval: parsed.interval,
					values: result.values?.length ?? 0,
				}),
			},
		);
}

export const rsi: TwelveDataEndpoints['rsi'] = indicator(
	'rsi',
	'rsi',
) as TwelveDataEndpoints['rsi'];
export const macd: TwelveDataEndpoints['macd'] = indicator(
	'macd',
	'macd',
) as TwelveDataEndpoints['macd'];
export const sma: TwelveDataEndpoints['sma'] = indicator(
	'sma',
	'sma',
) as TwelveDataEndpoints['sma'];
export const ema: TwelveDataEndpoints['ema'] = indicator(
	'ema',
	'ema',
) as TwelveDataEndpoints['ema'];
export const bbands: TwelveDataEndpoints['bbands'] = indicator(
	'bbands',
	'bbands',
) as TwelveDataEndpoints['bbands'];
export const stoch: TwelveDataEndpoints['stoch'] = indicator(
	'stoch',
	'stoch',
) as TwelveDataEndpoints['stoch'];
export const atr: TwelveDataEndpoints['atr'] = indicator(
	'atr',
	'atr',
) as TwelveDataEndpoints['atr'];
export const adx: TwelveDataEndpoints['adx'] = indicator(
	'adx',
	'adx',
) as TwelveDataEndpoints['adx'];
export const cci: TwelveDataEndpoints['cci'] = indicator(
	'cci',
	'cci',
) as TwelveDataEndpoints['cci'];
export const willr: TwelveDataEndpoints['willr'] = indicator(
	'willr',
	'willr',
) as TwelveDataEndpoints['willr'];
export const mfi: TwelveDataEndpoints['mfi'] = indicator(
	'mfi',
	'mfi',
) as TwelveDataEndpoints['mfi'];
export const roc: TwelveDataEndpoints['roc'] = indicator(
	'roc',
	'roc',
) as TwelveDataEndpoints['roc'];
export const supertrend: TwelveDataEndpoints['supertrend'] = indicator(
	'supertrend',
	'supertrend',
) as TwelveDataEndpoints['supertrend'];
export const apo: TwelveDataEndpoints['apo'] = indicator(
	'apo',
	'apo',
) as TwelveDataEndpoints['apo'];
export const ppo: TwelveDataEndpoints['ppo'] = indicator(
	'ppo',
	'ppo',
) as TwelveDataEndpoints['ppo'];
export const stochrsi: TwelveDataEndpoints['stochrsi'] = indicator(
	'stochrsi',
	'stochrsi',
) as TwelveDataEndpoints['stochrsi'];
export const ultosc: TwelveDataEndpoints['ultosc'] = indicator(
	'ultosc',
	'ultosc',
) as TwelveDataEndpoints['ultosc'];
export const wma: TwelveDataEndpoints['wma'] = indicator(
	'wma',
	'wma',
) as TwelveDataEndpoints['wma'];
export const min: TwelveDataEndpoints['min'] = indicator(
	'min',
	'min',
) as TwelveDataEndpoints['min'];
export const max: TwelveDataEndpoints['max'] = indicator(
	'max',
	'max',
) as TwelveDataEndpoints['max'];
export const stddev: TwelveDataEndpoints['stddev'] = indicator(
	'stddev',
	'stddev',
) as TwelveDataEndpoints['stddev'];
/** `beta` and `correl` read two price series: `series_type_1` and `series_type_2`. */
function twoSeriesIndicator(
	path: string,
	event: string,
): (
	ctx: Parameters<NonNullable<TwelveDataEndpoints['beta']>>[0],
	input: never,
) => Promise<unknown> {
	return async (ctx, input) =>
		call(
			ctx,
			{
				event,
				operation: `indicators.${event}`,
				input: TwelveDataEndpointInputSchemas.beta,
				output: TwelveDataEndpointOutputSchemas.beta,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path,
				query: {
					symbol: parsed.symbol,
					interval: parsed.interval,
					time_period: parsed.time_period,
					series_type_1: parsed.series_type_1,
					series_type_2: parsed.series_type_2,
					outputsize: parsed.outputsize,
					exchange: parsed.exchange,
				},
			}),
			{
				log: (parsed, result) => ({
					symbol: parsed.symbol,
					interval: parsed.interval,
					values: result.values?.length ?? 0,
				}),
			},
		);
}

export const beta: TwelveDataEndpoints['beta'] = twoSeriesIndicator(
	'beta',
	'beta',
) as TwelveDataEndpoints['beta'];
export const correl: TwelveDataEndpoints['correl'] = twoSeriesIndicator(
	'correl',
	'correl',
) as TwelveDataEndpoints['correl'];
export const tsf: TwelveDataEndpoints['tsf'] = indicator(
	'tsf',
	'tsf',
) as TwelveDataEndpoints['tsf'];
