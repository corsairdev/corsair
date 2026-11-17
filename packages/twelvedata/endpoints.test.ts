import { z } from 'zod';
import { TwelveDataEndpointOutputSchemas } from './endpoints/types';
import {
	apiUsage,
	bondsList,
	cryptoList,
	etfList,
	exchangeRate,
	exchangesList,
	forexPairsList,
	fundsList,
	macdSeries,
	price,
	quote,
	rsiSeries,
	stocksList,
	timeSeries,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a quote whose numbers are all strings', () => {
		const parsed = TwelveDataEndpointOutputSchemas.quote.parse(quote);
		expect(parsed.close).toBe('211.00');
		expect(parsed.percent_change).toBe('1.44231');
		expect(typeof parsed.close).toBe('string');
	});

	it('keeps snake_case: the field is percent_change, not percentChange', () => {
		const parsed = TwelveDataEndpointOutputSchemas.quote.parse(quote);
		expect(parsed.percent_change).toBe('1.44231');
		expect(parsed).not.toHaveProperty('percentChange');
	});

	it('parses the nested fifty_two_week block', () => {
		const parsed = TwelveDataEndpointOutputSchemas.quote.parse(quote);
		expect(parsed.fifty_two_week?.low).toBe('164.08');
		expect(parsed.fifty_two_week?.high).toBe('260.10');
	});

	it('parses a price answer', () => {
		const parsed = TwelveDataEndpointOutputSchemas.price.parse(price);
		expect(parsed.price).toBe('211.66000');
	});

	it('parses a time series with its meta and candles', () => {
		const parsed = TwelveDataEndpointOutputSchemas.timeSeries.parse(timeSeries);
		expect(parsed.values).toHaveLength(2);
		expect(parsed.meta?.interval).toBe('1day');
		expect(parsed.values[0]?.close).toBe('211.00');
	});

	it('parses an indicator whose fields differ from another indicator', () => {
		const rsi = TwelveDataEndpointOutputSchemas.rsi.parse(rsiSeries);
		const macd = TwelveDataEndpointOutputSchemas.macd.parse(macdSeries);
		expect(rsi.values?.[0]?.rsi).toBe('62.34189');
		expect(macd.values?.[0]?.macd_hist).toBe('0.24691');
	});

	it('parses a stock list', () => {
		const parsed = TwelveDataEndpointOutputSchemas.listStocks.parse(stocksList);
		expect(parsed.data).toHaveLength(2);
		expect(parsed.data[0]?.mic_code).toBe('XWBO');
	});

	it('parses a forex pair list with its currency names', () => {
		const parsed =
			TwelveDataEndpointOutputSchemas.listForexPairs.parse(forexPairsList);
		expect(parsed.data[0]?.currency_base).toBe('Euro');
		expect(parsed.data[0]?.currency_group).toBe('Exotic-Cross');
	});

	it('parses a crypto list with its available exchanges', () => {
		const parsed =
			TwelveDataEndpointOutputSchemas.listCryptocurrencies.parse(cryptoList);
		expect(parsed.data[0]?.available_exchanges).toHaveLength(2);
	});

	it('parses an exchange list', () => {
		const parsed =
			TwelveDataEndpointOutputSchemas.listExchanges.parse(exchangesList);
		expect(parsed.data[0]?.code).toBe('IEXG');
		expect(parsed.data[0]?.timezone).toBe('America/New_York');
	});

	it('parses an ETF list through the data envelope', () => {
		const parsed = TwelveDataEndpointOutputSchemas.listEtf.parse(etfList);
		expect(parsed.data[0]?.symbol).toBe('0000D0');
		expect(parsed.data[0]?.exchange).toBe('KRX');
	});

	it('parses a funds list through the result envelope', () => {
		const parsed = TwelveDataEndpointOutputSchemas.listFunds.parse(fundsList);
		expect(parsed.result.count).toBe(137321);
		expect(parsed.result.list[0]?.type).toBe('Mutual Fund');
	});

	it('parses a bonds list through the result envelope', () => {
		const parsed = TwelveDataEndpointOutputSchemas.listBonds.parse(bondsList);
		expect(parsed.result.list[0]?.type).toBe('Bond');
	});

	it('rejects a funds body that used the data envelope instead', () => {
		// Funds and bonds answer `{ result }`; a `{ data }` body is the wrong route.
		expect(() =>
			TwelveDataEndpointOutputSchemas.listFunds.parse({ data: [] }),
		).toThrow(z.ZodError);
	});

	it('parses an exchange rate', () => {
		const parsed =
			TwelveDataEndpointOutputSchemas.exchangeRate.parse(exchangeRate);
		expect(parsed.rate).toBe('1.08542');
	});

	it('parses the api usage counters', () => {
		const parsed = TwelveDataEndpointOutputSchemas.apiUsage.parse(apiUsage);
		expect(parsed.current_usage).toBe(42);
		expect(parsed.plan_limit).toBe(800);
	});

	it('parses an empty reference list', () => {
		expect(
			TwelveDataEndpointOutputSchemas.listStocks.parse({ data: [] }).data,
		).toEqual([]);
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a reference list whose data is not an array', () => {
		expect(() =>
			TwelveDataEndpointOutputSchemas.listStocks.parse({ data: {} }),
		).toThrow(z.ZodError);
	});

	it('rejects a quote whose close arrived as a number', () => {
		expect(() =>
			TwelveDataEndpointOutputSchemas.quote.parse({ close: 211 }),
		).toThrow(z.ZodError);
	});

	it('rejects a time series with no values array', () => {
		expect(() =>
			TwelveDataEndpointOutputSchemas.timeSeries.parse({ meta: {} }),
		).toThrow(z.ZodError);
	});

	it('rejects a candle missing its datetime', () => {
		expect(() =>
			TwelveDataEndpointOutputSchemas.timeSeries.parse({
				values: [{ open: '1', high: '1', low: '1', close: '1' }],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a price answer with no price field', () => {
		expect(() => TwelveDataEndpointOutputSchemas.price.parse({})).toThrow(
			z.ZodError,
		);
	});

	it('rejects an exchange whose code is a number', () => {
		expect(() =>
			TwelveDataEndpointOutputSchemas.listExchanges.parse({
				data: [{ code: 42 }],
			}),
		).toThrow(z.ZodError);
	});
});
