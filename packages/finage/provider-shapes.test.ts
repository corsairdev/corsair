import { FinageInputSchemas, FinageOutputSchemas } from './endpoints/types';

// Response shapes taken from Finage's reference (https://finage.co.uk/docs/api)
// that the first version of the output schemas rejected.
describe('Finage provider response shapes', () => {
	const signal = {
		timestamp: '2025-05-06T10:41:32.571747715Z',
		symbol: 'EURUSD',
		signal: 'hold',
		confidence: 0.5,
		indicators: {
			sma_20: 1.13228,
			sma_50: 1.13269,
			rsi: 42.61,
			macd: -0.00004,
			macd_signal: 0.00023,
			macd_diff: -0.00027,
			bollinger_high: 1.1347,
			bollinger_low: 1.13069,
			ma_crossover: false,
			macd_cross: false,
		},
		price: 1.1317059,
	};

	it('accepts a signal as a bare object and wrapped in an array', () => {
		// "Forex Signal API" documents the bare object; "Forex Technical
		// Indicators" documents the same route with the object inside an array.
		for (const operation of ['getForexSignal', 'getUsStocksSignal'] as const) {
			expect(FinageOutputSchemas[operation].safeParse(signal).success).toBe(
				true,
			);
			expect(FinageOutputSchemas[operation].safeParse([signal]).success).toBe(
				true,
			);
		}
	});

	it('does not reject a signal value Finage adds later', () => {
		const parsed = FinageOutputSchemas.getForexSignal.safeParse({
			...signal,
			signal: 'strong_buy',
			confidence: 72,
		});
		expect(parsed.success).toBe(true);
	});

	it('still rejects a signal without its documented fields', () => {
		expect(
			FinageOutputSchemas.getForexSignal.safeParse({ symbol: 'EURUSD' })
				.success,
		).toBe(false);
	});

	it('accepts datetime bar times returned for date_format dt', () => {
		const bars = {
			symbol: 'AAPL',
			totalResults: 1,
			results: [
				{
					o: 80.88,
					h: 81.19,
					l: 79.73,
					c: 80.36,
					v: 118746872,
					t: '2020-02-05',
				},
			],
		};
		for (const operation of [
			'getStockMarketAggregates',
			'getForexMarketAggregates',
		] as const) {
			expect(
				FinageInputSchemas[operation].safeParse({
					symbol: 'AAPL',
					multiply: 1,
					time: 'day',
					from: '2020-02-05',
					to: '2020-02-07',
					date_format: 'dt',
				}).success,
			).toBe(true);
			expect(FinageOutputSchemas[operation].safeParse(bars).success).toBe(true);
		}
	});

	it('caps the news limit at the documented maximum of 30', () => {
		for (const operation of [
			'getStockMarketNews',
			'getForexNews',
			'getCryptoNews',
		] as const) {
			expect(
				FinageInputSchemas[operation].safeParse({ symbol: 'BTC', limit: 30 })
					.success,
			).toBe(true);
			expect(
				FinageInputSchemas[operation].safeParse({ symbol: 'BTC', limit: 31 })
					.success,
			).toBe(false);
		}
	});

	it('keeps a calendar when one row has a blank or missing value', () => {
		expect(
			FinageOutputSchemas.getHistoricalDividendsCalendar.safeParse([
				{
					label: 'May 11, 87',
					adj_dividend: 0.000536,
					dividend: 0.12,
					record_date: '',
					payment_date: '',
					declaration_date: '',
					date: '1987-05-11',
				},
			]).success,
		).toBe(true);
		expect(
			FinageOutputSchemas.getIpoCalendar.safeParse([
				{
					symbol: 'NEWCO',
					date: '2026-12-01',
					exchange: 'NASDAQ',
					status: 'Expected',
					shares: null,
					price_range: null,
					market_cap: null,
					company: 'New Company Inc',
				},
			]).success,
		).toBe(true);
		expect(
			FinageOutputSchemas.getDelistedCompanies.safeParse([
				{
					symbol: 'CEO',
					company_name: 'Cnooc Ltd',
					exchange: 'NYSE',
					ipo_date: '',
					delisted_date: '2021-11-05',
				},
			]).success,
		).toBe(true);
		expect(
			FinageOutputSchemas.getMutualFundHolders.safeParse([
				{
					holder: 'Example Fund',
					shares: 319516,
					change: null,
					report_date: '2020-07-31',
					weight_percentage: null,
				},
			]).success,
		).toBe(true);
	});

	it('still requires the field that identifies a calendar row', () => {
		expect(
			FinageOutputSchemas.getIpoCalendar.safeParse([{ date: '2026-12-01' }])
				.success,
		).toBe(false);
		expect(
			FinageOutputSchemas.getMutualFundHolders.safeParse([{ shares: 1 }])
				.success,
		).toBe(false);
	});

	it('accepts null for optional company and cryptocurrency details', () => {
		expect(
			FinageOutputSchemas.getStockCompanyDetails.safeParse([
				{
					symbol: 'SPY',
					name: 'SPDR S&P 500 ETF Trust',
					ceo: null,
					industry: null,
					employees: null,
					marketcap: null,
				},
			]).success,
		).toBe(true);
		expect(
			FinageOutputSchemas.getCryptoDetail.safeParse({
				name: 'Example Token',
				symbol: 'EXT',
				type: 'token',
				isActive: true,
				description: null,
				hashAlgorithm: null,
				startedAt: null,
				opensource: null,
			}).success,
		).toBe(true);
	});
});
