import 'dotenv/config';
import { request } from 'corsair/http';
import { FixerAPIError, fixerGet, joinSymbols } from './client';
import { historical } from './endpoints/historical';
import { latest } from './endpoints/latest';
import { list } from './endpoints/symbols';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		// Defaults to the real implementation so the live-API tests below
		// still hit the network; mocked tests override per-call with
		// mockResolvedValueOnce/mockImplementationOnce.
		request: jest.fn(original.request),
	};
});

const mockRequest = request as jest.Mock;
const TEST_API_KEY = process.env.FIXER_API_KEY;

function createTestContext() {
	return {
		key: 'test-api-key',
		options: { authType: 'api_key' as const },
		$getAccountId: async () => null,
		db: {
			rates: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
	};
}

afterEach(() => {
	mockRequest.mockClear();
});

describe('joinSymbols', () => {
	it('returns undefined for an empty or missing list', () => {
		expect(joinSymbols(undefined)).toBeUndefined();
		expect(joinSymbols([])).toBeUndefined();
	});

	it('uppercases and comma-joins currency codes', () => {
		expect(joinSymbols(['usd', 'gbp'])).toBe('USD,GBP');
	});
});

describe('Rates.latest (mocked Fixer responses)', () => {
	it('parses a successful response and caches the snapshot', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			timestamp: 1663753443,
			base: 'EUR',
			date: '2022-09-21',
			rates: { USD: 1.0025, GBP: 0.8631 },
		});

		const ctx = createTestContext();
		const result = await latest(ctx as never, { symbols: ['usd', 'gbp'] });

		expect(result).toEqual({
			success: true,
			timestamp: 1663753443,
			base: 'EUR',
			date: '2022-09-21',
			rates: { USD: 1.0025, GBP: 0.8631 },
		});
		expect(ctx.db.rates.upsertByEntityId).toHaveBeenCalledWith(
			'EUR:2022-09-21',
			expect.objectContaining({
				base: 'EUR',
				date: '2022-09-21',
				timestamp: 1663753443,
				rates: { USD: 1.0025, GBP: 0.8631 },
			}),
		);

		const [, query] = mockRequest.mock.calls[0] as unknown as [
			unknown,
			{ query?: Record<string, unknown> },
		];
		expect(query.query?.symbols).toBe('USD,GBP');
		expect(query.query?.access_key).toBe('test-api-key');
	});

	it('surfaces a business error body as a FixerAPIError instead of a parsed result', async () => {
		mockRequest.mockResolvedValueOnce({
			success: false,
			error: {
				code: 101,
				type: 'invalid_access_key',
				info: 'You have not supplied a valid API Access Key.',
			},
		});

		const ctx = createTestContext();
		await expect(latest(ctx as never, {})).rejects.toThrow(FixerAPIError);
		expect(ctx.db.rates.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('rejects an invalid base currency code before returning', async () => {
		const ctx = createTestContext();
		await expect(
			latest(ctx as never, { base: 'EURO' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('Rates.historical (mocked Fixer responses)', () => {
	it('requests the date-scoped path and parses the response', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			timestamp: 1519295999,
			historical: true,
			base: 'EUR',
			date: '2018-02-22',
			rates: { USD: 1.2345 },
		});

		const ctx = createTestContext();
		const result = await historical(ctx as never, { date: '2018-02-22' });

		expect(result.date).toBe('2018-02-22');
		expect(result.rates.USD).toBe(1.2345);
		expect(ctx.db.rates.upsertByEntityId).toHaveBeenCalledWith(
			'EUR:2018-02-22',
			expect.objectContaining({ date: '2018-02-22' }),
		);

		const [, requestOptions] = mockRequest.mock.calls[0] as unknown as [
			unknown,
			{ url?: string },
		];
		expect(requestOptions.url).toBe('/2018-02-22');
	});

	it('rejects a malformed date before calling the API', async () => {
		const ctx = createTestContext();
		await expect(
			historical(ctx as never, { date: '02-22-2018' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('surfaces a business error body as a FixerAPIError', async () => {
		mockRequest.mockResolvedValueOnce({
			success: false,
			error: { code: 106, type: 'no_rates_available' },
		});

		await expect(
			historical(createTestContext() as never, { date: '1990-01-01' }),
		).rejects.toThrow(FixerAPIError);
	});
});

describe('Symbols.list (mocked Fixer responses)', () => {
	it('parses the supported symbols map', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			symbols: {
				USD: 'United States Dollar',
				EUR: 'Euro',
			},
		});

		const result = await list(createTestContext() as never, {});

		expect(result.success).toBe(true);
		expect(result.symbols.USD).toBe('United States Dollar');
	});

	it('surfaces a business error body as a FixerAPIError', async () => {
		mockRequest.mockResolvedValueOnce({
			success: false,
			error: { code: 104, type: 'usage_limit_reached' },
		});

		await expect(list(createTestContext() as never, {})).rejects.toThrow(
			FixerAPIError,
		);
	});
});

describe('Fixer Live API & Endpoint Integration Tests', () => {
	const maybeTest = TEST_API_KEY ? it : it.skip;

	maybeTest('fixerGet returns a parseable /latest response', async () => {
		const raw = await fixerGet<{ success: boolean; rates: unknown }>(
			'/latest',
			TEST_API_KEY!,
			{},
		);
		expect(raw.success).toBe(true);
		expect(raw.rates).toBeTruthy();
	});

	maybeTest(
		'Rates.latest returns real-time rates for selected symbols',
		async () => {
			const ctx = {
				key: TEST_API_KEY!,
				options: { authType: 'api_key' as const },
				$getAccountId: async () => null,
				db: {
					rates: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
				},
			};
			const result = await latest(ctx as never, { symbols: ['USD', 'GBP'] });

			expect(result.success).toBe(true);
			expect(result.rates.USD).toBeGreaterThan(0);
			expect(ctx.db.rates.upsertByEntityId).toHaveBeenCalled();
		},
	);

	maybeTest(
		'Rates.historical returns rates for a known past date',
		async () => {
			const ctx = {
				key: TEST_API_KEY!,
				options: { authType: 'api_key' as const },
				$getAccountId: async () => null,
				db: {
					rates: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
				},
			};
			const result = await historical(ctx as never, { date: '2020-01-01' });

			expect(result.date).toBe('2020-01-01');
			expect(Object.keys(result.rates).length).toBeGreaterThan(0);
		},
	);

	maybeTest('Symbols.list returns the supported currency map', async () => {
		const ctx = {
			key: TEST_API_KEY!,
			options: { authType: 'api_key' as const },
			$getAccountId: async () => null,
		};
		const result = await list(ctx as never, {});

		expect(result.success).toBe(true);
		expect(result.symbols.USD).toBeTruthy();
	});

	maybeTest(
		'fixerGet throws FixerAPIError for an invalid access key',
		async () => {
			await expect(
				fixerGet('/latest', 'definitely-invalid-key', {}),
			).rejects.toThrow(FixerAPIError);
		},
	);
});
