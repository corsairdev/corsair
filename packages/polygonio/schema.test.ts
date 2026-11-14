import {
	AggregateBarSchema,
	BarsInputSchema,
	ExchangeSchema,
	MarketHolidaySchema,
	POLYGONIO_MOVER_DIRECTIONS,
	POLYGONIO_TIMESPANS,
	SnapshotTickerSchema,
	TickersListInputSchema,
} from './endpoints/types';
import { PolygonioSchema } from './schema';

describe('Polygon.io plugin schema', () => {
	it('declares a semver version', () => {
		expect(PolygonioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PolygonioSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PolygonioSchema.entities)).toBe(false);
	});
});

describe('aggregate bars', () => {
	it('parses a bar with the API single-letter keys', () => {
		expect(
			AggregateBarSchema.safeParse({
				c: 75.0875,
				h: 75.15,
				l: 73.7975,
				n: 1,
				o: 74.06,
				t: 1577941200000,
				v: 135647456,
				vw: 74.6099,
			}).success,
		).toBe(true);
	});

	it('keeps otc absent, which the API leaves off when false', () => {
		const parsed = AggregateBarSchema.parse({ c: 1, t: 1 });

		expect(parsed.otc).toBeUndefined();
	});

	it('pins the documented timespans', () => {
		expect(POLYGONIO_TIMESPANS).toEqual([
			'minute',
			'hour',
			'day',
			'week',
			'month',
			'quarter',
			'year',
		]);
	});

	it('requires the range on a bars call', () => {
		expect(
			BarsInputSchema.safeParse({
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-10',
			}).success,
		).toBe(true);
		expect(
			BarsInputSchema.safeParse({
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'day',
			}).success,
		).toBe(false);
	});

	it('caps the base aggregate limit at 50000', () => {
		const base = {
			ticker: 'AAPL',
			multiplier: 1,
			timespan: 'day' as const,
			from: '2020-01-01',
			to: '2020-01-10',
		};
		expect(BarsInputSchema.safeParse({ ...base, limit: 50_000 }).success).toBe(
			true,
		);
		expect(BarsInputSchema.safeParse({ ...base, limit: 50_001 }).success).toBe(
			false,
		);
	});
});

describe('snapshots', () => {
	it('parses a snapshot ticker with its day, minute and previous-day bars', () => {
		expect(
			SnapshotTickerSchema.safeParse({
				ticker: 'AAPL',
				todaysChange: 1.2,
				todaysChangePerc: 0.63,
				updated: 1700000000000000000,
				day: { c: 1, h: 2, l: 0.5, o: 1, v: 10, vw: 1.5 },
				prevDay: { c: 1, h: 2, l: 0.5, o: 1, v: 10, vw: 1.5 },
				min: { c: 1, h: 1, l: 1, o: 1, v: 1, vw: 1 },
				lastTrade: { p: 14.22, s: 25, t: 1605195929997325600 },
				lastQuote: { P: 14.44, S: 11, p: 14.2, s: 25, t: 1605195929997325600 },
			}).success,
		).toBe(true);
	});

	it('pins the two mover directions', () => {
		expect(POLYGONIO_MOVER_DIRECTIONS).toEqual(['gainers', 'losers']);
	});
});

describe('tickers', () => {
	it('accepts the camelCase range filters that map to the dotted names', () => {
		expect(
			TickersListInputSchema.safeParse({
				market: 'stocks',
				tickerGte: 'A',
				tickerLt: 'B',
			}).success,
		).toBe(true);
	});

	it('drops a dotted name, so it cannot bypass the mapping to the API', () => {
		// `ticker.gte` is the wire name; the schema takes `tickerGte`. An extra
		// key is stripped, so the endpoint never sees it and never sends it.
		const parsed = TickersListInputSchema.parse({ 'ticker.gte': 'A' });

		expect(parsed).toEqual({});
		expect('ticker.gte' in parsed).toBe(false);
	});

	it('caps the ticker page at the documented 1000', () => {
		expect(TickersListInputSchema.safeParse({ limit: 1000 }).success).toBe(
			true,
		);
		expect(TickersListInputSchema.safeParse({ limit: 1001 }).success).toBe(
			false,
		);
	});
});

describe('market operations', () => {
	it('parses a holiday that closes a full day', () => {
		expect(
			MarketHolidaySchema.safeParse({
				date: '2020-11-26',
				exchange: 'NYSE',
				name: 'Thanksgiving',
				status: 'closed',
			}).success,
		).toBe(true);
	});

	it('parses an early-close holiday with its close time', () => {
		const parsed = MarketHolidaySchema.parse({
			date: '2020-11-27',
			exchange: 'NYSE',
			name: 'Thanksgiving',
			status: 'early-close',
			close: '2020-11-27T18:00:00.000Z',
		});

		expect(parsed.status).toBe('early-close');
		expect(parsed.close).toBe('2020-11-27T18:00:00.000Z');
	});

	it('parses an exchange with its MICs', () => {
		expect(
			ExchangeSchema.safeParse({
				id: 1,
				type: 'exchange',
				asset_class: 'stocks',
				locale: 'us',
				name: 'New York Stock Exchange',
				acronym: 'NYSE',
				mic: 'XNYS',
				operating_mic: 'XNYS',
				url: 'https://www.nyse.com',
			}).success,
		).toBe(true);
	});
});
