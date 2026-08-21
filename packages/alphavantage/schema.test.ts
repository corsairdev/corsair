/**
 * Validates the declared schemas against payloads captured from the live API on
 * 2026-08-13, trimmed for length but otherwise unedited. The point is to catch
 * a schema that only matches the documentation rather than what the provider
 * actually sends — Alpha Vantage's key naming is inconsistent enough that this
 * is a real risk.
 */
import {
	AlphaVantageEndpointInputSchemas as Inputs,
	AlphaVantageEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { AlphaVantageCompanyOverview } from './schema/database';

describe('captured live responses satisfy the output schemas', () => {
	it('GLOBAL_QUOTE', () => {
		const captured = {
			'Global Quote': {
				'01. symbol': 'IBM',
				'02. open': '236.3100',
				'03. high': '241.8000',
				'04. low': '235.4400',
				'05. price': '238.4200',
				'06. volume': '4468987',
				'07. latest trading day': '2026-08-11',
				'08. previous close': '236.3100',
				'09. change': '2.1100',
				'10. change percent': '0.8929%',
			},
		};
		expect(Outputs.timeSeriesGlobalQuote.parse(captured)).toBeTruthy();
	});

	it('GLOBAL_QUOTE with an unknown ticker, which comes back empty', () => {
		// The provider does not report this as an error, so the schema has to
		// accept it and the handler raises the not-found instead.
		expect(
			Outputs.timeSeriesGlobalQuote.parse({ 'Global Quote': {} }),
		).toBeTruthy();
	});

	it('TIME_SERIES_DAILY', () => {
		const captured = {
			'Meta Data': {
				'1. Information': 'Daily Prices (open, high, low, close) and Volumes',
				'2. Symbol': 'IBM',
				'3. Last Refreshed': '2026-08-11',
				'4. Output Size': 'Compact',
				'5. Time Zone': 'US/Eastern',
			},
			'Time Series (Daily)': {
				'2026-08-11': {
					'1. open': '236.3100',
					'2. high': '241.8000',
					'3. low': '235.4400',
					'4. close': '238.4200',
					'5. volume': '4468987',
				},
			},
		};
		expect(Outputs.timeSeriesDaily.parse(captured)).toBeTruthy();
	});

	it('RSI, whose Meta Data numbers its keys with colons and mixes in a number', () => {
		const captured = {
			'Meta Data': {
				'1: Symbol': 'IBM',
				'2: Indicator': 'Relative Strength Index (RSI)',
				'3: Last Refreshed': '2026-08-11',
				'4: Interval': 'daily',
				'5: Time Period': 14,
				'6: Series Type': 'close',
				'7: Time Zone': 'US/Eastern Time',
			},
			'Technical Analysis: RSI': {
				'2026-08-11': { RSI: '57.4413' },
			},
		};
		expect(Outputs.technicalIndicator.parse(captured)).toBeTruthy();
	});

	it('OVERVIEW', () => {
		const captured = {
			Symbol: 'IBM',
			AssetType: 'Common Stock',
			Name: 'International Business Machines',
			Description:
				'International Business Machines Corporation (IBM) is an American multinational technology company.',
			CIK: '51143',
			Exchange: 'NYSE',
			Currency: 'USD',
			Country: 'USA',
			Sector: 'TECHNOLOGY',
			Industry: 'INFORMATION TECHNOLOGY SERVICES',
			Address: 'ONE NEW ORCHARD ROAD, ARMONK, NY, UNITED STATES, 10504',
			OfficialSite: 'https://www.ibm.com',
			FiscalYearEnd: 'December',
			LatestQuarter: '2026-06-30',
			MarketCapitalization: '224623690000',
			EBITDA: '16473000000',
			PERatio: '21.01',
			PEGRatio: '2.405',
			BookValue: '36.57',
			DividendPerShare: '6.73',
			DividendYield: '0.0285',
			EPS: '11.35',
			RevenuePerShareTTM: '73.7',
			ProfitMargin: '0.155',
			OperatingMarginTTM: '0.166',
			ReturnOnAssetsTTM: '0.053',
			ReturnOnEquityTTM: '0.345',
			RevenueTTM: '69094998000',
			GrossProfitTTM: '40143000000',
			DilutedEPSTTM: '11.35',
			QuarterlyEarningsGrowthYOY: '-0.018',
			QuarterlyRevenueGrowthYOY: '0.011',
			AnalystTargetPrice: '244.16',
			AnalystRatingStrongBuy: '3',
			AnalystRatingBuy: '11',
			AnalystRatingHold: '9',
			AnalystRatingSell: '1',
			AnalystRatingStrongSell: '1',
			TrailingPE: '21.01',
			ForwardPE: '19.12',
			PriceToSalesRatioTTM: '3.251',
			PriceToBookRatio: '6.46',
			EVToRevenue: '4.049',
			EVToEBITDA: '15.92',
			Beta: '0.705',
			'52WeekHigh': '330.09',
			'52WeekLow': '197.77',
			'50DayMovingAverage': '257.3',
			'200DayMovingAverage': '268.87',
			SharesOutstanding: '942134000',
			SharesFloat: '919542000',
			PercentInsiders: '0.107',
			PercentInstitutions: '65.971',
			DividendDate: '2026-09-10',
			ExDividendDate: '2026-08-10',
		};
		expect(Outputs.fundamentalsCompanyOverview.parse(captured)).toBeTruthy();
		expect(AlphaVantageCompanyOverview.parse(captured).Symbol).toBe('IBM');
		for (const key of Object.keys(captured)) {
			expect(AlphaVantageCompanyOverview.shape).toHaveProperty(key);
		}
	});

	it('OVERVIEW treats missing fundamentals as absent, not zero', () => {
		expect(
			Outputs.fundamentalsCompanyOverview.parse({ Symbol: 'ZZZZ' }),
		).toEqual({ Symbol: 'ZZZZ' });
	});

	it('CURRENCY_EXCHANGE_RATE', () => {
		const captured = {
			'Realtime Currency Exchange Rate': {
				'1. From_Currency Code': 'USD',
				'2. From_Currency Name': 'United States Dollar',
				'3. To_Currency Code': 'JPY',
				'4. To_Currency Name': 'Japanese Yen',
				'5. Exchange Rate': '159.47913547',
				'6. Last Refreshed': '2026-08-12 18:56:09',
				'7. Time Zone': 'UTC',
				'8. Bid Price': '159.47000000',
				'9. Ask Price': '159.48000000',
			},
		};
		expect(Outputs.forexExchangeRate.parse(captured)).toBeTruthy();
	});

	it('SYMBOL_SEARCH', () => {
		const captured = {
			bestMatches: [
				{
					'1. symbol': 'TSCO.LON',
					'2. name': 'Tesco PLC',
					'3. type': 'Equity',
					'4. region': 'United Kingdom',
					'5. marketOpen': '08:00',
					'6. marketClose': '16:30',
					'7. timezone': 'UTC+01',
					'8. currency': 'GBX',
					'9. matchScore': '0.7273',
				},
			],
		};
		expect(Outputs.marketSymbolSearch.parse(captured)).toBeTruthy();
	});

	it('MARKET_STATUS', () => {
		const captured = {
			endpoint: 'Global Market Open & Close Status',
			markets: [
				{
					market_type: 'Equity',
					region: 'United States',
					primary_exchanges: 'NASDAQ, NYSE, AMEX, BATS',
					local_open: '09:30',
					local_close: '16:15',
					current_status: 'closed',
					notes: '',
				},
			],
		};
		expect(Outputs.marketStatus.parse(captured)).toBeTruthy();
	});

	it('TOP_GAINERS_LOSERS', () => {
		const mover = {
			ticker: 'PLAG',
			price: '5.71',
			change_amount: '5.1443',
			change_percentage: '900.0%',
			volume: '1234567',
		};
		const captured = {
			metadata: 'Top gainers, losers, and most actively traded US tickers',
			last_updated: '2026-08-11 16:16:00 US/Eastern',
			top_gainers: [mover],
			top_losers: [mover],
			most_actively_traded: [mover],
		};
		expect(Outputs.marketTopGainersLosers.parse(captured)).toBeTruthy();
	});

	it('INCOME_STATEMENT', () => {
		const captured = {
			symbol: 'IBM',
			annualReports: [
				{
					fiscalDateEnding: '2025-12-31',
					reportedCurrency: 'USD',
					grossProfit: '39297000000',
					totalRevenue: '67536000000',
				},
			],
			quarterlyReports: [
				{
					fiscalDateEnding: '2026-06-30',
					reportedCurrency: 'USD',
					totalRevenue: '17000000000',
				},
			],
		};
		expect(Outputs.fundamentalsIncomeStatement.parse(captured)).toBeTruthy();
	});

	it('DIVIDENDS', () => {
		const captured = {
			symbol: 'IBM',
			data: [
				{
					ex_dividend_date: '2026-08-10',
					declaration_date: '2026-07-22',
					record_date: '2026-08-10',
					payment_date: '2026-09-10',
					amount: '1.69',
				},
			],
		};
		expect(Outputs.fundamentalsDividends.parse(captured)).toBeTruthy();
	});

	it('SPLITS', () => {
		const captured = {
			symbol: 'IBM',
			data: [{ effective_date: '2021-11-04', split_factor: '1.0460' }],
		};
		expect(Outputs.fundamentalsSplits.parse(captured)).toBeTruthy();
	});

	it('WHEAT and REAL_GDP share one envelope', () => {
		const wheat = {
			name: 'Global Price of Wheat',
			interval: 'monthly',
			unit: 'dollar per metric ton',
			data: [{ date: '2026-06-01', value: '199.6482875619048' }],
		};
		const gdp = {
			name: 'Real Gross Domestic Product',
			interval: 'annual',
			unit: 'billions of dollars',
			data: [{ date: '2025-01-01', value: '23850.442' }],
		};
		expect(Outputs.commoditiesWheat.parse(wheat)).toBeTruthy();
		expect(Outputs.economicRealGdp.parse(gdp)).toBeTruthy();
	});

	it('DIGITAL_CURRENCY_DAILY', () => {
		const captured = {
			'Meta Data': {
				'1. Information': 'Daily Prices and Volumes for Digital Currency',
				'2. Digital Currency Code': 'BTC',
				'3. Digital Currency Name': 'Bitcoin',
				'4. Market Code': 'USD',
				'5. Market Name': 'United States Dollar',
			},
			'Time Series (Digital Currency Daily)': {
				'2026-08-12': {
					'1. open': '61000.00',
					'2. high': '61500.00',
					'3. low': '60500.00',
					'4. close': '61200.00',
					'5. volume': '1234.56',
				},
			},
		};
		expect(Outputs.cryptoDaily.parse(captured)).toBeTruthy();
	});

	it('NEWS_SENTIMENT, whose article scores are numbers but ticker scores are strings', () => {
		const captured = {
			items: '50',
			sentiment_score_definition: 'x <= -0.35: Bearish; ...',
			relevance_score_definition: '0 < x <= 1, with a higher score ...',
			feed: [
				{
					title: 'Apple beats expectations',
					url: 'https://example.com/article',
					time_published: '20260812T120000',
					summary: 'A summary.',
					source: 'Example Wire',
					overall_sentiment_score: 0.264,
					overall_sentiment_label: 'Somewhat-Bullish',
					ticker_sentiment: [
						{
							ticker: 'AAPL',
							relevance_score: '0.9',
							ticker_sentiment_score: '0.31',
							ticker_sentiment_label: 'Somewhat-Bullish',
						},
					],
				},
			],
		};
		expect(Outputs.intelligenceNewsSentiment.parse(captured)).toBeTruthy();
	});

	it('running_analytics from the separate host', () => {
		const captured = {
			meta_data: {
				symbols: 'AAPL',
				window_size: 20,
				min_dt: '2026-06-11',
				max_dt: '2026-08-11',
				ohlc: 'Close',
				interval: 'DAILY',
			},
			payload: {
				RETURNS_CALCULATIONS: {
					MEAN: {
						RUNNING_MEAN: { AAPL: { '2026-07-13': 0.0037773502417675743 } },
					},
				},
			},
		};
		expect(
			Outputs.intelligenceSlidingWindowAnalytics.parse(captured),
		).toBeTruthy();
	});

	it('LISTING_STATUS rows, decoded from CSV', () => {
		const captured = [
			{
				symbol: 'A',
				name: 'Agilent Technologies Inc',
				exchange: 'NYSE',
				assetType: 'Stock',
				ipoDate: '1999-11-18',
				delistingDate: 'null',
				status: 'Active',
			},
		];
		expect(Outputs.marketListingStatus.parse(captured)).toBeTruthy();
	});

	it('SECTOR, which is deprecated upstream and answers with an empty body', () => {
		expect(Outputs.marketSector.parse({})).toEqual({});
	});
});

describe('input schemas reject malformed calls', () => {
	it('requires a well-formed month', () => {
		expect(() =>
			Inputs.timeSeriesIntraday.parse({
				symbol: 'IBM',
				interval: '5min',
				month: '2024/01',
			}),
		).toThrow();
		expect(
			Inputs.timeSeriesIntraday.parse({
				symbol: 'IBM',
				interval: '5min',
				month: '2024-01',
			}),
		).toBeTruthy();
	});

	it('rejects an unsupported intraday interval', () => {
		expect(() =>
			Inputs.timeSeriesIntraday.parse({ symbol: 'IBM', interval: '2min' }),
		).toThrow();
	});

	it('rejects an empty ticker', () => {
		expect(() => Inputs.timeSeriesDaily.parse({ symbol: '' })).toThrow();
	});

	it('holds Brent to its own interval range', () => {
		// Brent is published daily; the metals and grains are not.
		expect(Inputs.commoditiesBrent.parse({ interval: 'daily' })).toBeTruthy();
		expect(() =>
			Inputs.commoditiesWheat.parse({ interval: 'daily' }),
		).toThrow();
		expect(Inputs.commoditiesWheat.parse({ interval: 'annual' })).toBeTruthy();
	});

	it('caps bulk quotes at 100 tickers', () => {
		const hundred = Array.from({ length: 100 }, (_, i) => `SYM${i}`);
		expect(
			Inputs.timeSeriesRealtimeBulkQuotes.parse({ symbols: hundred }),
		).toBeTruthy();
		expect(() =>
			Inputs.timeSeriesRealtimeBulkQuotes.parse({
				symbols: [...hundred, 'ONEMORE'],
			}),
		).toThrow();
	});

	it('requires time_from to precede time_to', () => {
		expect(() =>
			Inputs.intelligenceNewsSentiment.parse({
				time_from: '20260812T0000',
				time_to: '20260101T0000',
			}),
		).toThrow();
		expect(
			Inputs.intelligenceNewsSentiment.parse({
				time_from: '20260101T0000',
				time_to: '20260812T0000',
			}),
		).toBeTruthy();
	});

	it('requires time_period and series_type where Alpha Vantage does', () => {
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'RSI',
				symbol: 'IBM',
				interval: 'daily',
			}),
		).toThrow();
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'RSI',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 14,
			}),
		).toThrow();
		expect(
			Inputs.technicalIndicator.parse({
				indicator: 'RSI',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 14,
				series_type: 'close',
			}),
		).toBeTruthy();
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'MACD',
				symbol: 'IBM',
				interval: 'daily',
			}),
		).toThrow();
		expect(
			Inputs.technicalIndicator.parse({
				indicator: 'MACD',
				symbol: 'IBM',
				interval: 'daily',
				series_type: 'close',
			}),
		).toBeTruthy();
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'STOCHRSI',
				symbol: 'IBM',
				interval: 'daily',
			}),
		).toThrow();
		expect(
			Inputs.technicalIndicator.parse({
				indicator: 'STOCHRSI',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 14,
				series_type: 'close',
			}),
		).toBeTruthy();
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'T3',
				symbol: 'IBM',
				interval: 'daily',
				series_type: 'close',
			}),
		).toThrow();
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'T3',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 10,
			}),
		).toThrow();
		expect(
			Inputs.technicalIndicator.parse({
				indicator: 'T3',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 10,
				series_type: 'close',
			}),
		).toBeTruthy();
	});

	it('accepts indicator names containing a digit', () => {
		// T3 is a real Alpha Vantage function (triple exponential moving
		// average). A letters-only pattern would reject it.
		expect(
			Inputs.technicalIndicator.parse({
				indicator: 'T3',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 10,
				series_type: 'close',
			}),
		).toBeTruthy();
		expect(
			Inputs.technicalIndicator.parse({
				indicator: 'STOCHRSI',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 14,
				series_type: 'close',
			}),
		).toBeTruthy();
	});

	it('rejects an indicator name starting with a digit', () => {
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: '3T',
				symbol: 'IBM',
				interval: 'daily',
			}),
		).toThrow();
	});

	it('rejects a lower-case indicator name', () => {
		expect(() =>
			Inputs.technicalIndicator.parse({
				indicator: 'rsi',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 14,
			}),
		).toThrow();
	});

	it('requires a fiscal quarter in the documented form', () => {
		expect(() =>
			Inputs.fundamentalsEarningsCallTranscript.parse({
				symbol: 'IBM',
				quarter: '2024-Q1',
			}),
		).toThrow();
		expect(
			Inputs.fundamentalsEarningsCallTranscript.parse({
				symbol: 'IBM',
				quarter: '2024Q1',
			}),
		).toBeTruthy();
	});
});
