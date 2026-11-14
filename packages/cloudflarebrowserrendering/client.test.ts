import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	CLOUDFLARE_BROWSER_RUN_API_BASE,
	CloudflareBrowserRenderingHTTPError,
	DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS,
	makeCloudflareBrowserRenderingBinaryRequest,
	makeCloudflareBrowserRenderingRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function apiError(
	status: number,
	message: string,
	retryAfter?: number,
	// `unknown` because tests construct arbitrary credential-bearing JSON to
	// prove redaction, not a fixed request shape.
	requestBody?: Record<string, unknown>,
) {
	return new ApiError(
		{
			method: 'POST',
			url: '/accounts/account-123/browser-run/content',
			...(requestBody === undefined ? {} : { body: requestBody }),
		},
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
			TIMEOUT: DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS,
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

	it('uses a configurable request timeout within the documented bound', async () => {
		mockedRequest.mockResolvedValue('<html></html>');

		await makeCloudflareBrowserRenderingRequest(
			'/accounts/account-123/browser-run/content',
			'test-token',
			{
				method: 'POST',
				body: { url: 'https://example.com' },
				timeoutMs: 30_000,
			},
		);

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({ TIMEOUT: 30_000 });
	});

	it('caps configured request timeouts at the Browser Run lifecycle bound', async () => {
		mockedRequest.mockResolvedValue('<html></html>');

		await makeCloudflareBrowserRenderingRequest(
			'/accounts/account-123/browser-run/content',
			'test-token',
			{
				method: 'POST',
				body: { url: 'https://example.com' },
				timeoutMs: DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS + 1,
			},
		);

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			TIMEOUT: DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS,
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

	it('redacts request credentials from ApiErrors while preserving retry metadata', async () => {
		const secrets = {
			authenticate: { username: 'private-user', password: 'private-password' },
			cookies: [{ name: 'session', value: 'private-cookie' }],
			custom_ai: [{ model: 'vendor/model', authorization: 'private-ai-token' }],
		};
		const limited = apiError(429, 'Rate limit exceeded', 2500, secrets);
		mockedRequest.mockRejectedValue(limited);

		const sanitized = await makeCloudflareBrowserRenderingRequest(
			'/accounts/account-123/browser-run/content',
			'test-token',
			// `unknown` because a rejection value has no static type; the
			// assertions below narrow it to ApiError.
		).catch((error: unknown) => error);
		expect(sanitized).toBeInstanceOf(ApiError);
		expect(sanitized).not.toBe(limited);
		if (!(sanitized instanceof ApiError)) {
			throw new Error('Expected the sanitized error to remain an ApiError');
		}
		expect(sanitized.request.body).toBeUndefined();
		expect(JSON.stringify(sanitized)).not.toContain('private-password');
		expect(JSON.stringify(sanitized)).not.toContain('private-cookie');
		expect(JSON.stringify(sanitized)).not.toContain('private-ai-token');
		expect(sanitized).toMatchObject({ status: 429, retryAfter: 2500 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(sanitized)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(sanitized),
		).resolves.toEqual({
			maxRetries: 0,
			headersRetryAfterMs: 2500,
		});
	});
	it('scrubs the target URL from ApiErrors and keeps status and retry fields', async () => {
		const target =
			'https://user:private-pass@example.com/doc?X-Amz-Signature=private-sig';
		const failed = new ApiError(
			{
				method: 'PUT',
				url: '/accounts/account-123/browser-run/devtools/browser/session-1/json/new',
				query: { url: target, liveViewUrlExpiresInMs: 1000 },
			},
			{
				url: `${CLOUDFLARE_BROWSER_RUN_API_BASE}/accounts/account-123/browser-run/devtools/browser/session-1/json/new?url=${encodeURIComponent(target)}&liveViewUrlExpiresInMs=1000`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { success: false, errors: [{ code: 429, message: 'limited' }] },
			},
			'Too Many Requests',
			{ retryAfter: 1500 },
		);
		mockedRequest.mockRejectedValue(failed);

		const sanitized = await makeCloudflareBrowserRenderingRequest(
			'/accounts/account-123/browser-run/devtools/browser/session-1/json/new',
			'test-token',
			{ method: 'PUT', query: { url: target, liveViewUrlExpiresInMs: 1000 } },
			// `unknown` because a rejection value has no static type; the
			// assertions below narrow it to ApiError.
		).catch((error: unknown) => error);
		if (!(sanitized instanceof ApiError)) {
			throw new Error('Expected the sanitized error to remain an ApiError');
		}
		const serialized =
			JSON.stringify(sanitized) + sanitized.url + sanitized.message;
		expect(serialized).not.toContain('private-pass');
		expect(serialized).not.toContain('private-sig');
		expect(serialized).not.toContain('example.com');
		expect(sanitized.request.query).toMatchObject({
			liveViewUrlExpiresInMs: 1000,
		});
		expect(sanitized).toMatchObject({ status: 429, retryAfter: 1500 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(sanitized)).toBe(true);
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
			expect.objectContaining({
				method: 'POST',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url: 'https://example.com' }),
				signal: expect.any(AbortSignal),
			}),
		);
	});

	it('keeps the abort deadline active while reading a binary response body', async () => {
		const fetchSpy = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (_input, init) => {
				const signal = init?.signal;
				return new Response(
					new ReadableStream<Uint8Array>({
						start(controller) {
							signal?.addEventListener(
								'abort',
								() =>
									controller.error(new DOMException('Aborted', 'AbortError')),
								{ once: true },
							);
						},
					}),
				);
			});

		await expect(
			makeCloudflareBrowserRenderingBinaryRequest(
				'/accounts/account-123/browser-run/screenshot',
				'test-token',
				{ url: 'https://example.com' },
				{ timeoutMs: 5 },
			),
		).rejects.toThrow(
			'Cloudflare Browser Run binary request failed or timed out',
		);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
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

	it('keeps HTTP status and Retry-After when body cleanup rejects', async () => {
		const failedBody = new ReadableStream<Uint8Array>({
			start(controller) {
				controller.error(new Error('connection dropped'));
			},
		});
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(failedBody, {
				status: 429,
				headers: { 'retry-after': '3' },
			}),
		);

		await expect(
			makeCloudflareBrowserRenderingBinaryRequest(
				'/accounts/account-123/browser-run/screenshot',
				'test-token',
				{ url: 'https://example.com' },
			),
		).rejects.toMatchObject({ status: 429, retryAfter: 3000 });
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
			'Cloudflare Browser Run binary request failed or timed out',
		);
	});
});
