import { makeFixerRequest } from './client';
import { Rates, Symbols } from './endpoints';
import {
	FixerEndpointInputSchemas,
	FixerEndpointOutputSchemas,
} from './endpoints/types';

jest.mock('./client', () => ({
	makeFixerRequest: jest.fn(),
}));

describe('Fixer API Endpoint Tests', () => {
	// Cast required: Unit tests supply a minimal mock context providing authentication
	// and event logging stubs rather than instantiating the full plugin database runner.
	const mockCtx = {
		key: 'test-api-key',
		options: {},
		authType: 'api_key' as const,
		$getAccountId: jest.fn().mockResolvedValue('test-account-id'),
	} as unknown as Parameters<typeof Symbols.list>[0];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('symbols.list', () => {
		it('validates schema and returns currency symbols map', async () => {
			const mockOutput = {
				success: true,
				symbols: {
					AED: 'United Arab Emirates Dirham',
					EUR: 'Euro',
					GBP: 'British Pound Sterling',
					JPY: 'Japanese Yen',
					USD: 'United States Dollar',
				},
			};
			(makeFixerRequest as jest.Mock).mockResolvedValueOnce(mockOutput);

			const input = FixerEndpointInputSchemas.symbolsList.parse({});
			const result = await Symbols.list(mockCtx, input);

			const parsed = FixerEndpointOutputSchemas.symbolsList.parse(result);
			expect(parsed.success).toBe(true);
			expect(parsed.symbols.USD).toBe('United States Dollar');
			expect(parsed.symbols.EUR).toBe('Euro');
			expect(Object.keys(parsed.symbols).length).toBe(5);
		});
	});

	describe('rates.latest', () => {
		it('validates schema and returns latest rates', async () => {
			const mockOutput = {
				success: true,
				timestamp: 1680000000,
				base: 'EUR',
				date: '2026-09-02',
				rates: {
					USD: 1.085,
					GBP: 0.855,
					JPY: 162.3,
				},
			};
			(makeFixerRequest as jest.Mock).mockResolvedValueOnce(mockOutput);

			const input = FixerEndpointInputSchemas.ratesLatest.parse({
				base: 'EUR',
				symbols: 'USD,GBP,JPY',
			});
			const result = await Rates.latest(mockCtx, input);

			const parsed = FixerEndpointOutputSchemas.ratesLatest.parse(result);
			expect(parsed.success).toBe(true);
			expect(parsed.base).toBe('EUR');
			expect(parsed.date).toBe('2026-09-02');
			expect(parsed.rates.USD).toBe(1.085);
			expect(parsed.rates.GBP).toBe(0.855);
		});
	});

	describe('rates.historical', () => {
		it('validates schema and returns historical rates for date', async () => {
			const mockOutput = {
				success: true,
				historical: true,
				date: '2025-01-15',
				timestamp: 1736900000,
				base: 'USD',
				rates: {
					EUR: 0.96,
					GBP: 0.82,
				},
			};
			(makeFixerRequest as jest.Mock).mockResolvedValueOnce(mockOutput);

			const input = FixerEndpointInputSchemas.ratesHistorical.parse({
				date: '2025-01-15',
				base: 'USD',
				symbols: 'EUR,GBP',
			});
			const result = await Rates.historical(mockCtx, input);

			const parsed = FixerEndpointOutputSchemas.ratesHistorical.parse(result);
			expect(parsed.success).toBe(true);
			expect(parsed.historical).toBe(true);
			expect(parsed.date).toBe('2025-01-15');
			expect(parsed.rates.EUR).toBe(0.96);
		});

		it('rejects invalid date format', () => {
			expect(() => {
				FixerEndpointInputSchemas.ratesHistorical.parse({
					date: '15-01-2025',
				});
			}).toThrow();
		});
	});

	describe('rates.convert', () => {
		it('validates schema and returns conversion result', async () => {
			const mockOutput = {
				success: true,
				query: {
					from: 'USD',
					to: 'EUR',
					amount: 250,
				},
				info: {
					timestamp: 1680000000,
					rate: 0.92,
				},
				date: '2026-09-02',
				result: 230,
			};
			(makeFixerRequest as jest.Mock).mockResolvedValueOnce(mockOutput);

			const input = FixerEndpointInputSchemas.ratesConvert.parse({
				from: 'USD',
				to: 'EUR',
				amount: 250,
			});
			const result = await Rates.convert(mockCtx, input);

			const parsed = FixerEndpointOutputSchemas.ratesConvert.parse(result);
			expect(parsed.success).toBe(true);
			expect(parsed.query.amount).toBe(250);
			expect(parsed.info.rate).toBe(0.92);
			expect(parsed.result).toBe(230);
		});
	});

	describe('rates.timeseries', () => {
		it('validates schema and returns timeseries rates', async () => {
			const mockOutput = {
				success: true,
				timeseries: true,
				start_date: '2026-08-01',
				end_date: '2026-08-03',
				base: 'EUR',
				rates: {
					'2026-08-01': { USD: 1.082, GBP: 0.854 },
					'2026-08-02': { USD: 1.084, GBP: 0.855 },
					'2026-08-03': { USD: 1.085, GBP: 0.856 },
				},
			};
			(makeFixerRequest as jest.Mock).mockResolvedValueOnce(mockOutput);

			const input = FixerEndpointInputSchemas.ratesTimeseries.parse({
				start_date: '2026-08-01',
				end_date: '2026-08-03',
				base: 'EUR',
				symbols: 'USD,GBP',
			});
			const result = await Rates.timeseries(mockCtx, input);

			const parsed = FixerEndpointOutputSchemas.ratesTimeseries.parse(result);
			expect(parsed.success).toBe(true);
			expect(parsed.timeseries).toBe(true);
			expect(parsed.start_date).toBe('2026-08-01');
			expect(parsed.end_date).toBe('2026-08-03');
			expect(parsed.rates['2026-08-01']?.USD).toBe(1.082);
			expect(parsed.rates['2026-08-03']?.USD).toBe(1.085);
		});
	});

	describe('rates.fluctuation', () => {
		it('validates schema and returns fluctuation metrics', async () => {
			const mockOutput = {
				success: true,
				fluctuation: true,
				start_date: '2026-08-01',
				end_date: '2026-08-15',
				base: 'EUR',
				rates: {
					USD: {
						start_rate: 1.082,
						end_rate: 1.088,
						change: 0.006,
						change_pct: 0.5545,
					},
					GBP: {
						start_rate: 0.854,
						end_rate: 0.851,
						change: -0.003,
						change_pct: -0.3512,
					},
				},
			};
			(makeFixerRequest as jest.Mock).mockResolvedValueOnce(mockOutput);

			const input = FixerEndpointInputSchemas.ratesFluctuation.parse({
				start_date: '2026-08-01',
				end_date: '2026-08-15',
				base: 'EUR',
				symbols: 'USD,GBP',
			});
			const result = await Rates.fluctuation(mockCtx, input);

			const parsed = FixerEndpointOutputSchemas.ratesFluctuation.parse(result);
			expect(parsed.success).toBe(true);
			expect(parsed.fluctuation).toBe(true);
			expect(parsed.rates.USD?.start_rate).toBe(1.082);
			expect(parsed.rates.USD?.end_rate).toBe(1.088);
			expect(parsed.rates.USD?.change).toBe(0.006);
			expect(parsed.rates.USD?.change_pct).toBe(0.5545);
			expect(parsed.rates.GBP?.change).toBe(-0.003);
		});
	});
});
