import type { ApiRequestOptions } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { FINAGE_API_BASE, FinageAPIError, makeFinageRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const httpRequest = jest.mocked(request);

describe('Finage HTTP client', () => {
	it('sends GET requests with the API key in Finage apikey query parameter', async () => {
		httpRequest.mockResolvedValueOnce({ symbol: 'AAPL' });

		await makeFinageRequest('/last/stock/AAPL', 'secret-key', {
			limit: 10,
			includeExtended: false,
		});

		expect(httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: FINAGE_API_BASE,
				WITH_CREDENTIALS: false,
				TOKEN: undefined,
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/last/stock/AAPL',
				query: {
					limit: 10,
					includeExtended: false,
					apikey: 'secret-key',
				},
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 0,
				}),
			}),
		);
	});

	it('wraps provider errors with status, code, and Retry-After metadata', async () => {
		httpRequest.mockRejectedValueOnce(
			new ApiError(
				{ method: 'GET', url: '/last/stock/AAPL' } as ApiRequestOptions,
				{
					url: 'https://api.finage.co.uk/last/stock/AAPL',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: {
						error: {
							code: 'rate_limited',
							message: 'Too many requests',
						},
					},
				},
				'Too Many Requests',
				{ retryAfter: 30_000 },
			),
		);

		const error = await makeFinageRequest(
			'/last/stock/AAPL',
			'secret-key',
		).catch((caught: unknown) => caught); // unknown: rejection value, narrowed below

		expect(error).toBeInstanceOf(FinageAPIError);
		expect(error).toMatchObject({
			name: 'FinageAPIError',
			status: 429,
			code: 'rate_limited',
			retryAfter: 30_000,
			message: 'rate_limited: Too many requests',
		});
	});

	// The two error bodies Finage returns today (probed 2026-11-10): the market
	// data routes send { error: "<text>" } and the news and market-status routes
	// send { success, statusCode, message }.
	it.each([
		[
			{
				error: 'You do not have permission to make a request to this endpoint.',
			},
			'You do not have permission to make a request to this endpoint.',
		],
		[
			{
				success: false,
				statusCode: 401,
				message: 'Invalid API Key!',
				isFree: false,
			},
			'Invalid API Key!',
		],
	])(
		'keeps the message from the provider error body %#',
		async (body, message) => {
			httpRequest.mockRejectedValueOnce(
				new ApiError(
					{ method: 'GET', url: '/last/stock/AAPL' } as ApiRequestOptions,
					{
						url: 'https://api.finage.co.uk/last/stock/AAPL',
						ok: false,
						status: 401,
						statusText: 'Unauthorized',
						body,
					},
					'Unauthorized',
				),
			);

			await expect(
				makeFinageRequest('/last/stock/AAPL', 'secret-key'),
			).rejects.toMatchObject({
				name: 'FinageAPIError',
				status: 401,
				message,
			});
		},
	);

	it('redacts the API key from a failure that quotes the request URL', async () => {
		// A request that never gets a response is not an ApiError, and Node quotes
		// the whole URL, key included, when it cannot parse or reach it.
		httpRequest.mockRejectedValueOnce(
			new TypeError(
				'Failed to parse URL from https://api.finage.co.uk/last/stock/AAPL?apikey=secret-key',
			),
		);

		const error = await makeFinageRequest(
			'/last/stock/AAPL',
			'secret-key',
		).catch((caught: Error) => caught);

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).not.toContain('secret-key');
		expect((error as Error).message).toContain('[redacted]');
	});

	it('never carries the API key or the request URL on the thrown error', async () => {
		// Core's ApiError keeps the request URL and query, and its redaction list
		// does not include Finage's `apikey` parameter name.
		httpRequest.mockRejectedValueOnce(
			new ApiError(
				{
					method: 'GET',
					url: '/last/stock/AAPL',
					query: { apikey: 'secret-key' },
				} as ApiRequestOptions,
				{
					url: 'https://api.finage.co.uk/last/stock/AAPL?apikey=secret-key',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { error: 'Please use your APIKey to make a request.' },
				},
				'Unauthorized',
			),
		);

		const error = await makeFinageRequest(
			'/last/stock/AAPL',
			'secret-key',
		).catch((caught: unknown) => caught); // unknown: rejection value, narrowed below

		expect(error).toBeInstanceOf(FinageAPIError);
		if (!(error instanceof FinageAPIError)) return;
		const everything = [
			error.message,
			error.stack ?? '',
			JSON.stringify(error),
			JSON.stringify(
				Object.getOwnPropertyNames(error).map((name) => [
					name,
					// unknown: reads every own property to prove none holds the key.
					String((error as unknown as Record<string, unknown>)[name]),
				]),
			),
			String(error.cause ?? ''),
		].join('\n');
		expect(everything).not.toContain('secret-key');
		expect(everything).not.toContain('apikey=');
	});

	it('wraps non-Error rejections without losing the plugin error type', async () => {
		httpRequest.mockRejectedValueOnce('offline');

		await expect(
			makeFinageRequest('/last/stock/AAPL', 'secret-key'),
		).rejects.toMatchObject({
			name: 'FinageAPIError',
			message: 'Unknown Finage API error',
		});
	});
});
