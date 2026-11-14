import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	describePolygonError,
	makePolygonRequest,
	mintPolygonToken,
	POLYGON_HOSTS,
	PolygonAPIError,
	readErrorCode,
	resetPolygonTokenCache,
	resolvePolygonToken,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const CREDENTIALS = { apiKey: 'sk_sdbx_key', apiSecret: 'secret-value' };

/** An ApiError carrying the OMS error envelope. */
function apiError(
	status: number,
	body: Record<string, unknown>, // unknown: OMS's error body, read by key.
	retryAfter?: number,
) {
	return new ApiError(
		{ method: 'GET', url: '/networks' },
		{
			url: `${POLYGON_HOSTS.live}/networks`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		String(body.msg ?? 'error'),
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
	resetPolygonTokenCache();
});

describe('OMS error body', () => {
	it('reads the stable error name and keeps the message free of the secret', () => {
		const body = {
			error: 'InvalidCredentials',
			code: 1003,
			msg: 'invalid credentials',
			status: 401,
		};

		expect(readErrorCode(body)).toBe('InvalidCredentials');
		expect(describePolygonError(401, body, 'fallback')).toBe(
			'Polygon 401 InvalidCredentials: invalid credentials',
		);
	});

	it('falls back to the supplied text when the body is not OMS shaped', () => {
		expect(
			describePolygonError(502, '<html>bad gateway</html>', 'Bad Gateway'),
		).toBe('Polygon 502: Bad Gateway');
	});
});

describe('mintPolygonToken', () => {
	it('posts the key and secret to /auth/token on the chosen host', async () => {
		mockRequest.mockResolvedValue({
			accessToken: 'jwt-value',
			tokenType: 'bearer',
			expiresIn: 3600,
			expiresAt: '2026-01-01T00:00:00Z',
			projectId: 'prj_1',
			projectMode: 'sandbox',
		});

		const token = await mintPolygonToken('sandbox', CREDENTIALS);

		expect(token.accessToken).toBe('jwt-value');
		// The response's own lifetime is what the cache honours.
		expect(token.expiresInSeconds).toBe(3600);
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({ BASE: POLYGON_HOSTS.sandbox });
		expect(options).toMatchObject({
			method: 'POST',
			url: '/auth/token',
			body: { apiKey: 'sk_sdbx_key', apiSecret: 'secret-value' },
			mediaType: 'application/json',
		});
	});

	it('reports InvalidCredentials as an auth failure without the secret', async () => {
		mockRequest.mockRejectedValue(
			apiError(401, {
				error: 'InvalidCredentials',
				code: 1003,
				msg: 'invalid credentials',
				status: 401,
			}),
		);

		const error = await captureError(mintPolygonToken('live', CREDENTIALS));

		expect(error).toBeInstanceOf(PolygonAPIError);
		if (!(error instanceof PolygonAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.code).toBe('InvalidCredentials');
		expect(error.errorNumber).toBe(1003);
		// The secret never reaches an error, since it rides in the POST body.
		expect(JSON.stringify(error)).not.toContain('secret-value');
		expect(String(error.stack)).not.toContain('secret-value');
	});

	it('refuses a 200 that carries no access token rather than caching undefined', async () => {
		mockRequest.mockResolvedValue({ tokenType: 'bearer' });

		await expect(mintPolygonToken('live', CREDENTIALS)).rejects.toThrow(
			/did not return an access token/,
		);
	});
});

describe('resolvePolygonToken', () => {
	it('mints one token and reuses it across calls', async () => {
		mockRequest.mockResolvedValue({
			accessToken: 'cached-jwt',
			expiresIn: 3600,
		});

		const first = await resolvePolygonToken('live', CREDENTIALS);
		const second = await resolvePolygonToken('live', CREDENTIALS);

		expect(first).toBe('cached-jwt');
		expect(second).toBe('cached-jwt');
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('mints a separate token per host, so sandbox and live never mix', async () => {
		mockRequest
			.mockResolvedValueOnce({ accessToken: 'sandbox-jwt' })
			.mockResolvedValueOnce({ accessToken: 'live-jwt' });

		await expect(resolvePolygonToken('sandbox', CREDENTIALS)).resolves.toBe(
			'sandbox-jwt',
		);
		await expect(resolvePolygonToken('live', CREDENTIALS)).resolves.toBe(
			'live-jwt',
		);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('deduplicates concurrent mints into one request', async () => {
		mockRequest.mockResolvedValue({ accessToken: 'single-jwt' });

		const tokens = await Promise.all([
			resolvePolygonToken('live', CREDENTIALS),
			resolvePolygonToken('live', CREDENTIALS),
			resolvePolygonToken('live', CREDENTIALS),
		]);

		expect(tokens).toEqual(['single-jwt', 'single-jwt', 'single-jwt']);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('honours a short expiresIn from the response instead of assuming 60 minutes', async () => {
		jest.useFakeTimers();
		try {
			// One second of life, so the refresh margin alone makes it stale.
			mockRequest.mockResolvedValue({ accessToken: 'short-jwt', expiresIn: 1 });

			await resolvePolygonToken('live', CREDENTIALS);
			await jest.advanceTimersByTimeAsync(2000);
			mockRequest.mockResolvedValue({
				accessToken: 'second-jwt',
				expiresIn: 3600,
			});
			const next = await resolvePolygonToken('live', CREDENTIALS);

			// A hardcoded hour would have kept serving `short-jwt` here.
			expect(next).toBe('second-jwt');
			expect(mockRequest).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
		}
	});

	it('throws AuthMissingError without a request when a credential is blank', async () => {
		await expect(
			resolvePolygonToken('live', { apiKey: 'key', apiSecret: '  ' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('makePolygonRequest', () => {
	it('sends the bearer token and no secret', async () => {
		mockRequest.mockResolvedValue({ data: [] });

		await makePolygonRequest('live', 'jwt-value', {
			method: 'GET',
			path: '/networks',
			query: { limit: 10 },
		});

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POLYGON_HOSTS.live,
			HEADERS: {
				Authorization: 'Bearer jwt-value',
				Accept: 'application/json',
			},
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/networks',
			query: { limit: 10 },
		});
	});

	it('sends the Idempotency-Key header only when one is supplied', async () => {
		mockRequest.mockResolvedValue({});

		await makePolygonRequest('live', 'jwt', {
			method: 'POST',
			path: '/customers',
			body: { type: 'individual' },
			idempotencyKey: 'attempt-1',
		});
		const withKey = mockRequest.mock.calls[0]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(withKey.HEADERS['Idempotency-Key']).toBe('attempt-1');
		expect(withKey.HEADERS['Content-Type']).toBe('application/json');

		await makePolygonRequest('live', 'jwt', {
			method: 'GET',
			path: '/networks',
		});
		const withoutKey = mockRequest.mock.calls[1]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(withoutKey.HEADERS['Idempotency-Key']).toBeUndefined();
		// A bodyless request must not claim a JSON body it is not sending.
		expect(withoutKey.HEADERS['Content-Type']).toBeUndefined();
	});

	it('keeps status, error code and Retry-After, and drops the failed request', async () => {
		mockRequest.mockRejectedValue(
			apiError(
				429,
				{
					error: 'RateLimited',
					code: 1040,
					msg: 'too many requests',
					status: 429,
				},
				2500,
			),
		);

		const error = await captureError(
			makePolygonRequest('live', 'jwt', {
				method: 'GET',
				path: '/transactions',
			}),
		);

		expect(error).toBeInstanceOf(PolygonAPIError);
		if (!(error instanceof PolygonAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.code).toBe('RateLimited');
		expect(error.retryAfter).toBe(2500);
		expect(error.method).toBe('GET');
		expect(JSON.stringify(error)).not.toContain('jwt');
	});

	it('flags a dropped connection as a transport failure with its method', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePolygonRequest('live', 'jwt', {
				method: 'POST',
				path: '/transactions',
			}),
		);

		expect(error).toBeInstanceOf(PolygonAPIError);
		if (!(error instanceof PolygonAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
	});
});
