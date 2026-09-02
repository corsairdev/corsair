import { ApiError } from 'corsair/http';
import { FixerAPIError, makeFixerRequest } from './client';
import { currencies, rates } from './endpoints';

describe('Fixer Endpoints Execution & Error Policies', () => {
	const mockCtx: any = {
		key: 'fixer_test_key_123',
		authType: 'api_key',
		$getAccountId: async () => 'acc-123',
		database: {},
	};

	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	function mockResponse(status: number, data: any) {
		const bodyText = typeof data === 'string' ? data : JSON.stringify(data);
		return {
			ok: status >= 200 && status < 300,
			status,
			statusText: status === 401 ? 'Unauthorized' : 'OK',
			headers: {
				get: (name: string) => {
					if (name.toLowerCase() === 'content-type') return 'application/json';
					return null;
				},
			},
			json: async () =>
				typeof data === 'object' ? data : { success: true, message: data },
			text: async () => bodyText,
		};
	}

	it('executes rates.latest endpoint with correct query formatting', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				success: true,
				timestamp: 1600000000,
				base: 'EUR',
				date: '2026-09-02',
				rates: { USD: 1.08, GBP: 0.85 },
			}),
		);

		const res = await rates.latest(mockCtx, {
			base: 'EUR',
			symbols: ['USD', 'GBP'],
		});

		expect(res.success).toBe(true);
		expect(res.rates.USD).toBe(1.08);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://data.fixer.io/api/latest?access_key=fixer_test_key_123&base=EUR&symbols=USD%2CGBP',
			expect.anything(),
		);
	});

	it('executes rates.convert endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				success: true,
				query: { from: 'USD', to: 'EUR', amount: 100 },
				info: { timestamp: 1600000000, rate: 0.92 },
				date: '2026-09-02',
				result: 92,
			}),
		);

		const res = await rates.convert(mockCtx, {
			from: 'USD',
			to: 'EUR',
			amount: 100,
		});

		expect(res.result).toBe(92);
	});

	it('executes rates.historical endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				success: true,
				historical: true,
				date: '2026-01-01',
				base: 'EUR',
				rates: { USD: 1.08 },
			}),
		);

		const res = await rates.historical(mockCtx, {
			date: '2026-01-01',
			base: 'EUR',
		});

		expect(res.date).toBe('2026-01-01');
		expect(global.fetch).toHaveBeenCalledWith(
			'https://data.fixer.io/api/2026-01-01?access_key=fixer_test_key_123&base=EUR',
			expect.anything(),
		);
	});

	it('executes currencies.getAll endpoint', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				success: true,
				symbols: { USD: 'United States Dollar', EUR: 'Euro' },
			}),
		);

		const res = await currencies.getAll(mockCtx, {});

		expect(res.symbols.USD).toBe('United States Dollar');
	});

	it('handles Fixer API error codes inside JSON response', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(200, {
				success: false,
				error: { code: 101, info: 'Invalid access key' },
			}),
		);

		await expect(makeFixerRequest('latest', 'invalid_key', {})).rejects.toThrow(
			FixerAPIError,
		);
	});

	it('preserves ApiError on HTTP status error (401)', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce(
			mockResponse(401, 'Unauthorized'),
		);

		await expect(makeFixerRequest('latest', 'invalid_key', {})).rejects.toThrow(
			ApiError,
		);
	});
});
