import {
	EquityBalanceSheetInput,
	MarketPriceInput,
	SurfResponse,
} from './endpoints/types';

describe('surf input bounds', () => {
	it('accepts the longest price window and rejects the next invented window', () => {
		expect(
			MarketPriceInput.parse({ symbol: 'BTC', time_range: '365d' }).time_range,
		).toBe('365d');
		expect(() =>
			MarketPriceInput.parse({ symbol: 'BTC', time_range: '2d' }),
		).toThrow();
	});

	it('accepts a balance-sheet page of 100 and rejects 101', () => {
		expect(
			EquityBalanceSheetInput.parse({ symbol: 'AAPL', limit: 100 }).limit,
		).toBe(100);
		expect(() =>
			EquityBalanceSheetInput.parse({ symbol: 'AAPL', limit: 101 }),
		).toThrow();
	});

	it('rejects a start date without an end date', () => {
		expect(() =>
			MarketPriceInput.parse({ symbol: 'BTC', from: '2026-01-01' }),
		).toThrow();
	});

	it('parses an empty price series', () => {
		expect(
			SurfResponse.parse({
				data: [],
				meta: { credits_used: 1 },
				symbol: 'BTC',
			}).symbol,
		).toBe('BTC');
	});
});
