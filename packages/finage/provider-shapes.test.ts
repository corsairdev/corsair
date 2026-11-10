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
});
