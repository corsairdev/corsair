import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	joinSymbols,
	MARKETSTACK_API_BASE,
	MarketstackAPIError,
	makeMarketstackRequest,
	tryGetStoredKey,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const EOD_BODY = {
	pagination: { limit: 100, offset: 0, count: 1, total: 1 },
	data: [
		{
			open: 172.92,
			high: 173.66,
			low: 171.12,
			close: 172.03,
			volume: 58133500,
			symbol: 'AAPL',
			exchange: 'XNAS',
			date: '2026-05-28T00:00:00+0000',
		},
	],
};

describe('joinSymbols', () => {
	it('joins an array of symbols with commas', () => {
		expect(joinSymbols(['AAPL', 'MSFT'])).toBe('AAPL,MSFT');
	});

	it('passes a single symbol through unchanged', () => {
		expect(joinSymbols('AAPL')).toBe('AAPL');
	});
});

describe('tryGetStoredKey', () => {
	it('returns the stored key', async () => {
		await expect(tryGetStoredKey(async () => 'stored-key')).resolves.toBe(
			'stored-key',
		);
	});

	it('returns undefined when the getter yields null', async () => {
		await expect(tryGetStoredKey(async () => null)).resolves.toBeUndefined();
	});

	it('returns undefined when the account has no DEK', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error(
					'No DEK found for account (tenant: "default", integration: "marketstack")',
				);
			}),
		).resolves.toBeUndefined();
	});

	it('rethrows errors that are not a missing DEK', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('decryption failed');
			}),
		).rejects.toThrow('decryption failed');
	});
});

describe('makeMarketstackRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('puts access_key in the query string and always uses HTTPS', async () => {
		mockRequest.mockResolvedValue(EOD_BODY);

		await makeMarketstackRequest('eod', 'test-access-key', {
			query: { symbols: 'AAPL' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: MARKETSTACK_API_BASE,
				TOKEN: undefined,
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'eod',
				query: expect.objectContaining({
					symbols: 'AAPL',
					access_key: 'test-access-key',
				}),
			}),
		);
		const lastCall = mockRequest.mock.calls.at(-1);
		expect(new URL(lastCall?.[0].BASE ?? '').protocol).toBe('https:');
	});

	it('throws MarketstackAPIError with apiCode when the body has an error object', async () => {
		mockRequest.mockResolvedValue({
			error: {
				code: 'invalid_access_key',
				message: 'You have not supplied a valid API Access Key.',
			},
		});

		await expect(
			makeMarketstackRequest('eod', 'bad-key', { query: { symbols: 'AAPL' } }),
		).rejects.toMatchObject({
			constructor: MarketstackAPIError,
			apiCode: 'invalid_access_key',
			message: 'You have not supplied a valid API Access Key.',
		});
	});

	it('does not throw on a body with a malformed error field', async () => {
		mockRequest.mockResolvedValue({ error: null });

		await expect(
			makeMarketstackRequest('eod', 'test-access-key', {
				query: { symbols: 'AAPL' },
			}),
		).resolves.toEqual({ error: null });
	});

	it('copies status and retryAfter off a transport ApiError', async () => {
		const response = {
			url: 'https://api.marketstack.com/v1/eod',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		} satisfies ApiResult;

		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'eod' } satisfies ApiRequestOptions,
				response,
				'Rate limit exceeded',
				{ retryAfter: 2000 },
			),
		);

		await expect(
			makeMarketstackRequest('eod', 'test-access-key', {
				query: { symbols: 'AAPL' },
			}),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
		});
	});
});
