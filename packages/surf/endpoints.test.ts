import {
	EquityBalanceSheetInput,
	MarketPriceInput,
	MarketPriceOutput,
	OnchainSqlJobsJobIdResultsOutput,
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
			MarketPriceOutput.parse({
				data: [],
				summary: {
					change_abs: 0,
					change_pct: 0,
					first: 0,
					high: 0,
					last: 0,
					latest_dt: 0,
					low: 0,
					n_points: 0,
				},
				meta: { cached: false, credits_used: 1 },
				symbol: 'BTC',
			}).symbol,
		).toBe('BTC');
	});

	it('parses sql results as json rows or csv text', () => {
		const csv = OnchainSqlJobsJobIdResultsOutput.parse('block,value\n1,2');
		expect(csv).toBe('block,value\n1,2');
		const json = OnchainSqlJobsJobIdResultsOutput.parse({
			data: [{ block: 1 }],
			meta: { cached: false, credits_used: 1, limit: 20, offset: 0 },
		});
		expect(json).toMatchObject({ data: [{ block: 1 }] });
	});

	it('rejects an empty success body when the route requires data', () => {
		expect(() => MarketPriceOutput.parse({})).toThrow();
	});
});
