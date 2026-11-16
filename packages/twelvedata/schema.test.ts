import { TwelveDataEndpointOutputSchemas } from './endpoints/types';
import { TwelveDataSchema } from './schema';

describe('Twelve Data schema', () => {
	it('declares a semver version', () => {
		expect(TwelveDataSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Quotes and candles change every tick, so a local copy would be stale
		// before it was written.
		expect(Array.isArray(TwelveDataSchema.entities)).toBe(false);
		expect(TwelveDataSchema.entities).toEqual({});
	});
});

describe('real response shapes (captured 11-16 with the public demo key)', () => {
	it('accepts a numeric exchange rate', () => {
		const real = { symbol: 'USD/JPY', rate: 159.41338, timestamp: 1794807480 };
		expect(TwelveDataEndpointOutputSchemas.exchangeRate.parse(real).rate).toBe(
			159.41338,
		);
	});

	it('accepts the indicator description object in meta.indicator', () => {
		const real = {
			meta: {
				symbol: 'AAPL',
				interval: '1day',
				currency: 'USD',
				exchange_timezone: 'America/New_York',
				exchange: 'NASDAQ',
				mic_code: 'XNGS',
				type: 'Common Stock',
				indicator: {
					name: 'RSI - Relative Strength Index',
					series_type: 'close',
					time_period: 14,
				},
			},
			values: [{ datetime: '2026-11-13', rsi: '60.64100' }],
			status: 'ok',
		};
		expect(TwelveDataEndpointOutputSchemas.rsi.safeParse(real).success).toBe(
			true,
		);
	});
});
