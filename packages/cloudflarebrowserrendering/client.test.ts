import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CLOUDFLARE_BROWSER_RUN_API_BASE,
	CloudflareBrowserRenderingHTTPError,
	makeCloudflareBrowserRenderingBinaryRequest,
	makeCloudflareBrowserRenderingRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'POST', url: '/accounts/account-123/browser-run/content' },
		{
			url: `${CLOUDFLARE_BROWSER_RUN_API_BASE}/accounts/account-123/browser-run/content`,
			ok: false,
			status,
			statusText: message,
			body: { success: false, errors: [{ code: status, message }] },
		},
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('makeCloudflareBrowserRenderingRequest', () => {
	it('uses the Browser Run base URL and sends a Bearer token', async () => {
		mockedRequest.mockResolvedValue({ success: true, result: '<html></html>' });

		await expect(
			makeCloudflareBrowserRenderingRequest(
				'/accounts/account-123/browser-run/content',
				'test-token',
				{ method: 'POST', body: { url: 'https://example.com' } },
			),
		).resolves.toBe('<html></html>');

		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: CLOUDFLARE_BROWSER_RUN_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-token',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/accounts/account-123/browser-run/content',
				body: { url: 'https://example.com' },
				mediaType: 'application/json',
			}),
		);
		expect(mockedRequest.mock.calls[0]?.[2]).toEqual({
			rateLimitConfig: expect.objectContaining({
				enabled: true,
				maxRetries: 0,
			}),
		});
	});

	it('rejects an empty API token before sending a request', async () => {
		await expect(
			makeCloudflareBrowserRenderingRequest(
				'/accounts/account-123/browser-run/content',
				'',
			),
		).rejects.toThrow(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('preserves a 429 ApiError and its retryAfter value', async () => {
		const limited = apiError(429, 'Rate limit exceeded', 2500);
		mockedRequest.mockRejectedValue(limited);

		await expect(
			makeCloudflareBrowserRenderingRequest(
				'/accounts/account-123/browser-run/content',
				'test-token',
			),
		).rejects.toBe(limited);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(limited)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(limited),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});
});

describe('makeCloudflareBrowserRenderingBinaryRequest', () => {
	it('uses REST auth and returns a JSON-safe base64 binary response', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([104, 101, 108, 108, 111]), {
				headers: { 'content-type': 'image/png' },
			}),
		);

		await expect(
			makeCloudflareBrowserRenderingBinaryRequest(
				'/accounts/account-123/browser-run/screenshot',
				'test-token',
				{ url: 'https://example.com' },
				{ query: { browser: 'kitesurf', cacheTTL: 0 } },
			),
		).resolves.toEqual({
			contentType: 'image/png',
			byteLength: 5,
			data: 'aGVsbG8=',
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledWith(
			`${CLOUDFLARE_BROWSER_RUN_API_BASE}/accounts/account-123/browser-run/screenshot?browser=kitesurf&cacheTTL=0`,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url: 'https://example.com' }),
			},
		);
	});

	it('rejects a missing API token before fetch', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');

		await expect(
			makeCloudflareBrowserRenderingBinaryRequest(
				'/accounts/account-123/browser-run/pdf',
				'',
				{ html: '<main />' },
			),
		).rejects.toThrow(AuthMissingError);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('maps HTTP authorization failures without exposing response bodies', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('private response body', {
				status: 403,
				statusText: 'Forbidden',
			}),
		);

		const result = makeCloudflareBrowserRenderingBinaryRequest(
			'/accounts/account-123/browser-run/pdf',
			'test-token',
			{ url: 'https://example.com' },
		);
		await expect(result).rejects.toBeInstanceOf(
			CloudflareBrowserRenderingHTTPError,
		);
		await expect(result).rejects.toMatchObject({ status: 403 });
		await expect(result).rejects.not.toThrow('private response body');
		const authError = new CloudflareBrowserRenderingHTTPError(
			'Cloudflare Browser Run binary request failed with HTTP 403',
			403,
		);
		expect(errorHandlers.AUTH_ERROR.match(authError)).toBe(true);
	});

	it('preserves Retry-After for 429 without retrying the binary request', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'retry-after': '3' },
			}),
		);

		const result = makeCloudflareBrowserRenderingBinaryRequest(
			'/accounts/account-123/browser-run/screenshot',
			'test-token',
			{ url: 'https://example.com' },
		);
		await expect(result).rejects.toMatchObject({
			status: 429,
			retryAfter: 3000,
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const rateLimitError = new CloudflareBrowserRenderingHTTPError(
			'Cloudflare Browser Run binary request failed with HTTP 429',
			429,
			3000,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimitError)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rateLimitError),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 3000 });
	});

	it('sanitizes network failures rather than including request details', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockRejectedValue(
				new Error('failed URL containing test-token and customer content'),
			);

		await expect(
			makeCloudflareBrowserRenderingBinaryRequest(
				'/accounts/account-123/browser-run/screenshot',
				'test-token',
				{ html: '<main>private</main>' },
			),
		).rejects.toThrow(
			'Cloudflare Browser Run binary request failed before receiving a response',
		);
	});
});
